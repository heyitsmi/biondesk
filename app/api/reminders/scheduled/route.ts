import { NextRequest, NextResponse } from 'next/server';
import { getScheduledReminders, createManualReminder } from '@/lib/db';

import { getCurrentUser, getUserWorkspace } from '@/lib/auth';

// GET: Fetch upcoming reminders
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) return NextResponse.json({ error: 'No workspace found' }, { status: 404 });

    const reminders = await getScheduledReminders(workspace.id);
    return NextResponse.json(reminders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

// POST: Create manual reminder
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) return NextResponse.json({ error: 'No workspace found' }, { status: 404 });

    const body = await request.json();
    // Validate body...
    const { document_id, scheduled_at, content } = body;
    
    const job = await createManualReminder(workspace.id, {
        document_id,
        scheduled_at,
        content
    });
    
    return NextResponse.json(job);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}
