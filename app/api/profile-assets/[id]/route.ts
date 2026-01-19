import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { getProfileAssetById, updateProfileAsset, deleteProfileAsset } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/profile-assets/[id] - Get single profile asset
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
    const asset = await getProfileAssetById(workspace.id, id);

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error fetching profile asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile asset' },
      { status: 500 }
    );
  }
}

// PUT /api/profile-assets/[id] - Update profile asset
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

    const asset = await updateProfileAsset(workspace.id, id, {
      title: body.title,
      type: body.type,
      content: body.content,
      tags: body.tags,
      image_url: body.image_url,
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error updating profile asset:', error);
    return NextResponse.json(
      { error: 'Failed to update profile asset' },
      { status: 500 }
    );
  }
}

// DELETE /api/profile-assets/[id] - Delete profile asset
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
    await deleteProfileAsset(workspace.id, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile asset:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile asset' },
      { status: 500 }
    );
  }
}
