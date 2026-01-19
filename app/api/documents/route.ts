import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { getDocuments, createDocument } from '@/lib/db';

// GET /api/documents - List all documents (quotes, invoices, proposals)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') as 'quote' | 'invoice' | 'proposal' | undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const result = await getDocuments(workspace.id, { page, limit, type, status, search });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create new document
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.type) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    if (!['quote', 'invoice', 'proposal'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // Calculate amount from items if not provided
    const items = body.items || [];
    const itemsAmount = items.reduce((sum: number, item: { quantity: number; unit_price: number }) => {
      return sum + (item.quantity * item.unit_price);
    }, 0);

    const document = await createDocument(workspace.id, {
      type: body.type,
      contact_id: body.contact_id || undefined,
      opportunity_id: body.opportunity_id || undefined,
      title: body.title,
      content: body.content,
      amount: body.amount || itemsAmount,
      tax: body.tax || 0,
      discount: body.discount || 0,
      deposit: body.deposit || 0,
      terms: body.terms,
      notes: body.notes,
      valid_until: body.valid_until,
      due_date: body.due_date,
      reference: body.reference,
      items: items.map((item: { description: string; quantity: number; unit_price: number }) => ({
        description: item.description,
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        amount: (item.quantity || 1) * (item.unit_price || 0),
      })),
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
