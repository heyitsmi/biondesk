
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateProjectEstimate } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { description, userContext, hourlyRate } = body;

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const estimate = await generateProjectEstimate({
        description,
        userContext,
        hourlyRate
    });

    return NextResponse.json({ estimate });
  } catch (error) {
    console.error('Error generating estimate:', error);
    return NextResponse.json({ error: 'Failed to generate estimate' }, { status: 500 });
  }
}
