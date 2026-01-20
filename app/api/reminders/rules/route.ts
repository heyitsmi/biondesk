import { NextRequest, NextResponse } from 'next/server';
import { getReminderRules, toggleReminderRule } from '@/lib/db';

import { getCurrentUser, getUserWorkspace } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const workspace = await getUserWorkspace(user.id);
        if (!workspace) return NextResponse.json({ error: 'No workspace found' }, { status: 404 });

        const rules = await getReminderRules(workspace.id);
        return NextResponse.json(rules);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const workspace = await getUserWorkspace(user.id);
        if (!workspace) return NextResponse.json({ error: 'No workspace found' }, { status: 404 });

        const body = await request.json();
        const { id, isActive } = body;
        
        await toggleReminderRule(workspace.id, id, isActive);
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
    }
}
