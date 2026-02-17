import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// This route should be protected, e.g., by a secret key header
// CRON_SECRET=...
export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // For development allow without secret or use a dev secret
        if (process.env.NODE_ENV === 'production') {
             return new NextResponse('Unauthorized', { status: 401 });
        }
    }

    const supabase = createServerClient();
    const now = new Date().toISOString();

    // 1. Expire trials
    // Find subscriptions where status='trialing' AND trial_end < NOW
    const { data: expiredTrials, error: trialError } = await supabase
        .from('subscriptions')
        .update({ status: 'expired' }) // Or 'past_due' if we want to prompt payment
        .eq('status', 'trialing')
        .lt('trial_end', now)
        .select('id, user_id');

    if (trialError) {
        console.error("Error expiring trials:", trialError);
    }

    // 2. Expire active subscriptions (manual ones without auto-renew)
    // For now we assume manual payments or no recurring logic yet.
    // If status='active' AND current_period_end < NOW
    const { data: expiredSubs, error: subError } = await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('status', 'active')
        .lt('current_period_end', now)
        .select('id, user_id');

     if (subError) {
        console.error("Error expiring subscriptions:", subError);
    }

    return NextResponse.json({
        success: true,
        expiredTrials: expiredTrials?.length || 0,
        expiredSubscriptions: expiredSubs?.length || 0
    });
}
