import { NextRequest, NextResponse } from 'next/server';
import { getDocumentByToken } from '@/lib/db';

interface RouteParams {
  params: Promise<{ token: string }>;
}

// GET /api/public/[token] - Get public document (no auth required)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const document = await getDocumentByToken(token);

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Only return documents that have been sent
    if (document.status === 'draft') {
      return NextResponse.json({ error: 'Document not available' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching public document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}
