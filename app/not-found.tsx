"use client";

import { usePathname } from 'next/navigation';
import PublicNotFound from '@/components/public/PublicNotFound';
import AppNotFound from '@/components/app/AppNotFound';

export default function NotFound() {
    const pathname = usePathname();

    // Check if the current path belongs to the app/dashboard routes
    const isAppRoute = pathname?.startsWith('/dashboard') || 
                      pathname?.startsWith('/app') || 
                      pathname?.startsWith('/admin') ||
                      pathname?.startsWith('/seller');

    // Render the appropriate 404 page
    if (isAppRoute) {
        return <AppNotFound />;
    }

    return <PublicNotFound />;
}
