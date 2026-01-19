import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { logEvent } from '@/lib/db';

interface RouteParams {
  params: Promise<{ token: string }>;
}

// POST /api/public/[token]/accept - Accept a quote (client action)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Get the document
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('id, workspace_id, status, type')
      .eq('public_token', token)
      .single();

    if (fetchError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check if document is a quote and in sent/viewed status
    if (document.type !== 'quote') {
      return NextResponse.json(
        { error: 'Only quotes can be accepted' },
        { status: 400 }
      );
    }

    if (!['sent', 'viewed'].includes(document.status)) {
      return NextResponse.json(
        { error: 'Quote cannot be accepted in current status' },
        { status: 400 }
      );
    }

    // Get optional signature data from request body
    const body = await request.json().catch(() => ({}));

    // Update the document status to accepted
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', document.id);

    if (updateError) {
      throw updateError;
    }

    // Log event
    await logEvent(document.workspace_id, 'document', document.id, 'accepted', {
      signature_name: body.signature_name,
      accepted_by_ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      message: 'Quote accepted successfully',
    });
  } catch (error) {
    console.error('Error accepting quote:', error);
    return NextResponse.json(
      { error: 'Failed to accept quote' },
      { status: 500 }
    );
  }
}
