import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('biondesk_session')?.value;

        if (token) {
            // Delete session from database
            await deleteSession(token);
        }

        // Clear session cookie
        cookieStore.delete('biondesk_session');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'An error occurred during logout' },
            { status: 500 }
        );
    }
}
