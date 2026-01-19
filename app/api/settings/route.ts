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

        // Update workspace
        const { data: workspace, error } = await supabase
            .from('workspaces')
            .update({
                name: data.name,
                address: data.address,
                currency: data.currency,
                logo_url: data.logo_url,
                default_payment_link: data.default_payment_link,
                bank_details: data.bank_details,
            })
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, workspace });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
