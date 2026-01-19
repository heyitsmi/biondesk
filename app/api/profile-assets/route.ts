import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { getProfileAssets, createProfileAsset } from '@/lib/db';

// GET /api/profile-assets - List all profile assets
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
    const type = searchParams.get('type') || undefined;

    const assets = await getProfileAssets(workspace.id, { type });
    
    return NextResponse.json({ data: assets });
  } catch (error) {
    console.error('Error fetching profile assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile assets' },
      { status: 500 }
    );
  }
}

// POST /api/profile-assets - Create new profile asset
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
    if (!body.title) {
      return NextResponse.json(
        { error: 'Asset title is required' },
        { status: 400 }
      );
    }

    if (!body.type || !['portfolio', 'testimonial', 'snippet'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Valid asset type is required (portfolio, testimonial, snippet)' },
        { status: 400 }
      );
    }

    const asset = await createProfileAsset(workspace.id, {
      title: body.title,
      type: body.type,
      content: body.content || null,
      tags: body.tags || [],
      image_url: body.image_url || null,
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error('Error creating profile asset:', error);
    return NextResponse.json(
      { error: 'Failed to create profile asset' },
      { status: 500 }
    );
  }
}
