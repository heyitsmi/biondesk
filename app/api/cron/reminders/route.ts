import { NextRequest, NextResponse } from 'next/server';
import { getDueReminders, updateReminderJobStatus } from '@/lib/db';
import { sendEmail } from '@/lib/brevo';

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
                const emailContent = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4f46e5;">Reminder: ${job.content || 'Scheduled Reminder'}</h2>
                        <p>This is a scheduled reminder for document <strong>${document.title || document.number}</strong>.</p>
                        
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p>${job.content || 'No content provided.'}</p>
                        </div>

                        <p style="font-size: 12px; color: #6b7280;">Biondesk Cron System</p>
                    </div>
                `;

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
