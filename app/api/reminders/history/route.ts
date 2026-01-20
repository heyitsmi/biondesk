import { NextRequest, NextResponse } from 'next/server';
import { getReminderHistory } from '@/lib/db';

import { getCurrentUser, getUserWorkspace } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const workspace = await getUserWorkspace(user.id);
        if (!workspace) return NextResponse.json({ error: 'No workspace found' }, { status: 404 });

        const history = await getReminderHistory(workspace.id);
        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
