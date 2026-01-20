import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createContact, createOpportunity } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { workspace_id, name, email, company, service, budget, detailed_needs, message } = body;
        
        if (!workspace_id || !name || !email) {
             return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = createServerClient();

        // 1. Find or create Contact
        let contactId: string;
        
        const { data: existingContact } = await supabase
            .from('contacts')
            .select('id')
            .eq('workspace_id', workspace_id)
            .eq('email', email)
            .single();

        if (existingContact) {
            contactId = existingContact.id;
        } else {
            const newContact = await createContact(workspace_id, {
                name,
                email,
                company: company || null,
                phone: null,
                type: 'lead',
                notes: 'Created via Public Inquiry Form',
            });
            contactId = newContact.id;
        }

        // 2. Create Opportunity
        await createOpportunity(workspace_id, {
            contact_id: contactId,
            title: `${service} for ${company || name}`,
            description: `Budget: ${budget}\n\nNeeds:\n${detailed_needs || '-'}\n\nContext:\n${message}`,
            source: 'other', // or 'web_form' if added to enum
            stage: 'inbox',
            priority: 'medium',
            value: 0, // Estimating based on budget range is hard, leave 0
            job_link: null,
            notes: null,
            client_name: name,
            budget_type: null
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Inquiry submission error:', error);
        return NextResponse.json(
            { error: 'Failed to process inquiry' },
            { status: 500 }
        );
    }
}
