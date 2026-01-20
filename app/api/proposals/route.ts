import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { getDocuments } from '@/lib/db';

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
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    // Filter by type 'proposal' strictly
    const result = await getDocuments(workspace.id, { 
        page, 
        limit, 
        type: 'proposal', 
        status: status === 'all' ? undefined : status,
        search 
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}
