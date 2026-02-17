import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { extractJobDetails } from '@/lib/ai';

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        const { description } = await req.json();
        if (!description) {
             return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }
        
        const data = await extractJobDetails(description, user.id);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('AI API Error:', error);
        return NextResponse.json({ 
            error: 'Failed to extract details', 
            details: error.message 
        }, { status: 500 });
    }
}
