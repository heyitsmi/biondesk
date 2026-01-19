
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateProposal } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { description, tone, format, clientName } = body;

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const generatedContent = await generateProposal({
        description,
        tone: tone || 'professional',
        format: format || 'proposal',
        clientName,
        userProfile: 'A specialized agency focusing on high-quality design and development.' // Hardcoded for now, or fetch from user/workspace profile
    });

    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating proposal:', error);
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 });
  }
}
