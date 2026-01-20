import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createSession } from '@/lib/auth';
import { getGoogleTokens, getGoogleUser } from '@/lib/google-auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(`${requestUrl.origin}/login?error=Google authentication failed`);
    }

    try {
        // 1. Exchange code for tokens
        const { access_token, id_token } = await getGoogleTokens(code);

        if (!access_token) {
            console.error('No access token received from Google');
            return NextResponse.redirect(`${requestUrl.origin}/login?error=Failed to verify Google account`);
        }

        // 2. Get user info
        const googleUser = await getGoogleUser(access_token, id_token);

        if (!googleUser.email) {
            return NextResponse.redirect(`${requestUrl.origin}/login?error=Google account email missing`);
        }

        const supabase = createServerClient();

        // 3. User Sync Logic
        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', googleUser.email)
            .single();

        let userId = existingUser?.id;

        if (!userId) {
            // Create new user
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    email: googleUser.email,
                    name: googleUser.name || googleUser.email.split('@')[0],
                    avatar_url: googleUser.picture,
                    plan: 'free',
                    password_hash: 'oauth:google'
                })
                .select('id')
                .single();
            
            if (createError) {
                console.error('Error creating user from Google:', createError);
                return NextResponse.redirect(`${requestUrl.origin}/login?error=Registration failed`);
            }
            userId = newUser.id;

            // Create default workspace
            await supabase.from('workspaces').insert({
                user_id: userId,
                name: `${googleUser.given_name || 'My'} Workspace`,
                slug: (googleUser.name || 'workspace').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000)
            });
        } else {
             // (Optional) Update existing user avatar/name to match Google?
             // Not strictly necessary but polite.
        }

        // 4. Create local session
        const token = await createSession(userId);

        // 5. Set cookie
        const cookieStore = await cookies();
        cookieStore.set('flova_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.redirect(`${requestUrl.origin}/dashboard`);

    } catch (error) {
        console.error('Google callback error:', error);
        return NextResponse.redirect(`${requestUrl.origin}/login?error=Authentication error`);
    }
}
