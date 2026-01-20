import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createServerClient();
        
        // Exchange code for session
        // Note: exchangeCodeForSession returns a session that is valid for Supabase Auth.
        // We use it to verify the user and then sign them into our custom auth system.
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && user && user.email) {
            // Check if user exists in public.users
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', user.email)
                .single();

            let userId = existingUser?.id;

            if (!userId) {
                // Create new user in public.users
                // We use a placeholder password hash since they use OAuth
                const { data: newUser, error: createError } = await supabase
                    .from('users')
                    .insert({
                        email: user.email,
                        name: user.user_metadata?.full_name || user.email.split('@')[0],
                        avatar_url: user.user_metadata?.avatar_url,
                        plan: 'free',
                        password_hash: 'oauth:google' 
                    })
                    .select('id')
                    .single();
                
                if (createError) {
                    console.error('Error creating user from OAuth:', createError);
                    return NextResponse.redirect(`${requestUrl.origin}/login?error=Registration failed`);
                }
                userId = newUser.id;

                // Create default workspace for new user
                await supabase.from('workspaces').insert({
                    user_id: userId,
                    name: `${user.user_metadata?.full_name || 'My'} Workspace`,
                    slug: (user.user_metadata?.full_name || 'workspace').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000)
                });
            }

            // Create custom session (this is what the app uses for auth)
            const token = await createSession(userId);

            // Set session cookie
            const cookieStore = await cookies();
            cookieStore.set('flova_session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });

            return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${requestUrl.origin}/login?error=Authentication failed`);
}
