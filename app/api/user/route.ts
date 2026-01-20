import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const supabase = createServerClient();

        // Update user
        const { data: updatedUser, error } = await supabase
            .from('users')
            .update({
                name: data.name,
                email: data.email,
            })
            .eq('id', user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('User update error:', error);
        return NextResponse.json(
            { error: 'Failed to update user profile' },
            { status: 500 }
        );
    }
}
