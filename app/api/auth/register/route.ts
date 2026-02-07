import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { hashPassword, createSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                name,
                email: email.toLowerCase(),
                password_hash: passwordHash,
                plan: 'free',
            })
            .select('id, email, name')
            .single();

        if (createError || !newUser) {
            console.error('Create user error:', createError);
            return NextResponse.json(
                { error: 'Failed to create account' },
                { status: 500 }
            );
        }

        // Create default workspace for user
        await supabase.from('workspaces').insert({
            user_id: newUser.id,
            name: 'My Workspace',
            currency: 'USD',
            locale: 'en-US',
        });

        // Create session
        const token = await createSession(newUser.id);

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set('biondesk_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
