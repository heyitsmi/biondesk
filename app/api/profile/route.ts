import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { getProfileInfo, upsertProfileInfo } from '@/lib/db/assets';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) return NextResponse.json({ error: 'No workspace found' }, { status: 404 });

    const profile = await getProfileInfo(workspace.id);
    return NextResponse.json(profile || {}); // Return empty object if not found
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) return NextResponse.json({ error: 'No workspace found' }, { status: 404 });

    const body = await request.json();
    const profile = await upsertProfileInfo(workspace.id, {
      title: body.title, // Display Name
      content: body.content, // Bio
      tags: body.tags, // Skills
      image_url: body.image_url // Job Title (repurposed or handled differently?)
    });
    
    // Note: image_url is standard for "Job Title" in this quick implementation? 
    // Wait, reusing image_url for job title is weird. 
    // ProfileAsset has: title, content, tags, image_url.
    // UI needs: Display Name (title), Job Title (?), Bio (content), Skills (tags).
    // I will map Job Title to image_url for now or assume it's part of content JSON?
    // Let's assume Job Title is stored in image_url or we just append it to title?
    // "Alex Designer - Senior Product Designer"?
    // Or I can store a JSON object in `content`? 
    // `content` is a string. Stringified JSON?
    // `lib/types.ts` says content is string or null.
    
    // Let's decide: 
    // title -> Display Name
    // image_url -> Job Title (Hack, but workable if URL validation isn't strict. `image_url` is text usually).
    // content -> Bio
    // tags -> Skills.

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
