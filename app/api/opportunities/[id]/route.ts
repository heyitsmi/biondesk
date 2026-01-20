import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { getOpportunityById, updateOpportunity, deleteOpportunity } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/opportunities/[id] - Get single opportunity
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const { id } = await params;
    const opportunity = await getOpportunityById(workspace.id, id);

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

// PUT /api/opportunities/[id] - Update opportunity
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();

    const opportunity = await updateOpportunity(workspace.id, id, {
      title: body.title,
      contact_id: body.contact_id,
      description: body.description,
      source: body.source,
      stage: body.stage,
      priority: body.priority,
      value: body.value,
      job_link: body.job_link,
      notes: body.notes,
      client_name: body.client_name,
      budget_type: body.budget_type,
      country_code: body.country_code,
    });

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

// DELETE /api/opportunities/[id] - Delete opportunity
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const { id } = await params;
    await deleteOpportunity(workspace.id, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}
