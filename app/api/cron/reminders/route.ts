import { NextRequest, NextResponse } from 'next/server';
import { getDueReminders, updateReminderJobStatus } from '@/lib/db';
import { sendEmail } from '@/lib/brevo';
import { generateReminderEmail } from '@/lib/email-templates';

export const dynamic = 'force-dynamic'; // Ensure this route is not cached

export async function GET(request: NextRequest) {
    // 1. Security Check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Fetch due reminders
        // Limit batch size to avoid timeouts (Vercel Serverless Function limit is 10s on free tier)
        const reminders = await getDueReminders(10); 
        
        const results = {
            processed: 0,
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        // 3. Process each reminder
        for (const job of reminders) {
            results.processed++;
            try {
                const document = job.document;
                const workspace = document?.workspace;
                const user = workspace?.user;

                if (!user?.email) {
                    throw new Error(`No user email found for job ${job.id}`);
                }

                // Construct Email Content
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://biondesk.com';
                const actionUrl = document.public_token 
                    ? `${baseUrl}/p/doc/${document.public_token}` 
                    : `${baseUrl}/login`;

                const emailContent = generateReminderEmail(document.type as any, {
                    recipientName: user.name || 'User',
                    documentType: document.type,
                    documentNumber: document.number,
                    documentTitle: document.title,
                    amount: document.amount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: document.currency || 'USD' }).format(document.amount) : undefined,
                    dueDate: document.due_date ? new Date(document.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
                    sentDate: document.sent_at ? new Date(document.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
                    validUntil: document.valid_until ? new Date(document.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
                    actionUrl: actionUrl,
                    senderName: workspace.name,
                    senderEmail: user.email // Or a dedicated support email if preferred
                });

                // Send Email
                const emailResult = await sendEmail({
                    to: [{ email: user.email, name: user.name || 'User' }],
                    subject: `Reminder: ${job.content?.substring(0, 50) || 'Scheduled Task'}`,
                    htmlContent: emailContent,
                });

                if (emailResult.success) {
                    await updateReminderJobStatus(job.id, 'sent');
                    results.success++;
                } else {
                    throw new Error('Email sending failed');
                }

            } catch (error: any) {
                console.error(`Failed to process job ${job.id}:`, error);
                await updateReminderJobStatus(job.id, 'failed', error.message);
                results.failed++;
                results.errors.push(`Job ${job.id}: ${error.message}`);
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
