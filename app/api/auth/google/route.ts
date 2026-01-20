import { NextResponse } from 'next/server';
import { getGoogleAuthURL } from '@/lib/google-auth';

export async function GET() {
    return NextResponse.redirect(getGoogleAuthURL());
}
