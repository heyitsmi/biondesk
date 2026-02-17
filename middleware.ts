import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

// Routes that don't require authentication
const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/quote',
    '/invoice',
    '/about',
    '/cookie',
    '/faq',
    '/privacy',
    '/support',
    '/terms',
];

// Check if path starts with any public route
function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some(route => {
        if (route === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(route);
    });
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // Allow API routes (they handle their own auth)
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Allow static files
    if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Check for session cookie
    const token = request.cookies.get('biondesk_session')?.value;

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('biondesk_session');
        return response;
    }

    // Verify session exists in database
    const supabase = createServerClient();
    const { data: session } = await supabase
        .from('sessions')
        .select('id')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single();

    if (!session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('biondesk_session');
        return response;
    }

    // Check Admin Routes
    if (pathname.startsWith('/admin')) {
        const { data: user } = await supabase
            .from('users')
            .select('role')
            .eq('id', payload.userId)
            .single();
            
        if (!user || user.role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Check Subscription Status for Protected Features
    // List of features that require active subscription
    const lockedPaths = [
        '/invoices',
        '/quotations',
        '/opportunities',
        '/contacts',
        '/templates',
        '/ai-usage', // although this is admin now, good to keep in mind
        '/calculator',
        '/reminders',
        '/profile-library',
        '/analytics'
    ];

    const isLockedPath = lockedPaths.some(path => pathname.startsWith(path));

    if (isLockedPath) {
        // Fetch User Subscription
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', payload.userId)
            .maybeSingle();

        const now = new Date();
        let hasAccess = false;

        if (subscription) {
            if (['trialing', 'active'].includes(subscription.status)) {
                 hasAccess = true;
                 
                 // Double check dates
                 if (subscription.status === 'trialing' && subscription.trial_end && new Date(subscription.trial_end) < now) {
                     hasAccess = false;
                 }
                 if (subscription.status === 'active' && subscription.current_period_end && new Date(subscription.current_period_end) < now) {
                     hasAccess = false;
                 }
            }
        }

        if (!hasAccess) {
             // Redirect to billing or dashboard with error param
             const billingUrl = new URL('/settings/billing', request.url);
             billingUrl.searchParams.set('error', 'subscription_expired');
             return NextResponse.redirect(billingUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
