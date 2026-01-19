import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { sendDocument } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/documents/[id]/send - Send document (mark as sent)
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const document = await sendDocument(workspace.id, id);

    return NextResponse.json({
      success: true,
      document,
      publicUrl: `/quote/${document.public_token}`,
    });
  } catch (error) {
    console.error('Error sending document:', error);
    return NextResponse.json(
      { error: 'Failed to send document' },
      { status: 500 }
    );
  }
}
