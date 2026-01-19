import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { generatePasswordResetToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Find user by email
        const { data: user } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email.toLowerCase())
            .single();

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.',
            });
        }

        // Generate password reset token
        const token = await generatePasswordResetToken(user.id);

        // In production, you would send an email here
        // For now, we'll just log the reset URL
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
        console.log('Password reset URL:', resetUrl);

        // TODO: Integrate with email service (e.g., Resend, SendGrid)
        // await sendPasswordResetEmail(user.email, resetUrl);

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.',
            // Remove this in production - only for development
            ...(process.env.NODE_ENV === 'development' && { resetUrl }),
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
