import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { verifyPasswordResetToken, markPasswordResetTokenUsed, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Verify token
        const tokenData = await verifyPasswordResetToken(token);
        if (!tokenData) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Hash new password
        const passwordHash = await hashPassword(password);

        // Update user password
        const { error: updateError } = await supabase
            .from('users')
            .update({ password_hash: passwordHash })
            .eq('id', tokenData.userId);

        if (updateError) {
            console.error('Update password error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update password' },
                { status: 500 }
            );
        }

        // Mark token as used
        await markPasswordResetTokenUsed(token);

        // Delete all existing sessions for this user (force re-login)
        await supabase
            .from('sessions')
            .delete()
            .eq('user_id', tokenData.userId);

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
