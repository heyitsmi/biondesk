import { NextRequest, NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { sendEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
    try {
        const { name, email, subject, message, turnstileToken } = await request.json();

        // 1. Verify Turnstile
        const isTurnstileValid = await verifyTurnstileToken(turnstileToken);
        if (!isTurnstileValid) {
            return NextResponse.json(
                { error: 'Invalid CAPTCHA' },
                { status: 400 }
            );
        }

        // 2. Validate fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // 3. Send Email to Support Team
        await sendEmail({
            to: [{ email: process.env.MAIL_ADMIN_ADDRESS || 'admin@biondesk.com', name: 'Biondesk Admin' }],
            subject: `[Support] ${subject}: ${name}`,
            htmlContent: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>New Support Message</h2>
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Topic:</strong> ${subject}</p>
                    <hr/>
                    <p style="white-space: pre-wrap;">${message}</p>
                    <hr/>
                    <p style="color: #666; font-size: 12px;">Sent from Biondesk Contact Form</p>
                </div>
            `,
            sender: { 
                email: process.env.MAIL_FROM_ADDRESS || 'noreply@notification.biondesk.com',
                name: process.env.MAIL_FROM_NAME || 'Biondesk System'
            }
        });

        // 4. Send Confirmation Email to User (Optional but good UX)
        // For now, skipping to keep it simple as per request, but can be added if needed.

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Support form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
