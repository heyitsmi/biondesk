import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { getDocumentById, updateDocument, deleteDocument } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/documents/[id] - Get single document with items
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
    const document = await getDocumentById(workspace.id, id);

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update document and items
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

    // Calculate amount from items if items are provided
    let items;
    if (body.items) {
      items = body.items.map((item: { description: string; quantity: number; unit_price: number }) => ({
        description: item.description,
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        amount: (item.quantity || 1) * (item.unit_price || 0),
      }));
    }

    const document = await updateDocument(workspace.id, id, {
      contact_id: body.contact_id,
      title: body.title,
      content: body.content,
      amount: body.amount,
      tax: body.tax,
      discount: body.discount,
      deposit: body.deposit,
      terms: body.terms,
      notes: body.notes,
      valid_until: body.valid_until,
      due_date: body.due_date,
      items,
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete document
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
    await deleteDocument(workspace.id, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
