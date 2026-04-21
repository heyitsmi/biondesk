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

        // Username generation logic
        let usernameToSave = data.username;

        // If username is explicitly requested to be generated (empty string) or we want to enforce it
        if (data.username === '') {
             // Generate from user name
             const baseName = user.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
             let candidate = baseName;
             let isUnique = false;
             let attempts = 0;

             while (!isUnique && attempts < 5) {
                 const { data: existing } = await supabase
                    .from('workspaces')
                    .select('id')
                    .eq('username', candidate)
                    .single();
                 
                 if (!existing) {
                     isUnique = true;
                 } else {
                     // Append random string
                     const random = Math.random().toString(36).substring(2, 7);
                     candidate = `${baseName}${random}`;
                 }
                 attempts++;
             }
             
             if (isUnique) {
                 usernameToSave = candidate;
             } else {
                // FallbackUUID if all fails
                 usernameToSave = `${baseName}${crypto.randomUUID().split('-')[0]}`;
             }
        }

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
                username: usernameToSave,
                services: data.services,
            })
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            // Check for uniqueness constraint violation
            if (error.code === '23505') { // Postgres unique_violation
                 return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json({ success: true, workspace });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
