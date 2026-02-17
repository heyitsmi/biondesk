import { createServerClient } from "@/lib/supabase";
import Link from "next/link";

export default async function SubscriptionBanner({ userId }: { userId: string }) {
    const supabase = createServerClient();
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (!subscription) return null; // Or show "Activate Trial" if no sub?

    const now = new Date();
    const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null;
    const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null;

    // Case 1: Expired (Trial or Active)
    const isExpired = subscription.status === 'expired' || 
                      (subscription.status === 'trialing' && trialEnd && trialEnd < now) ||
                      (subscription.status === 'active' && periodEnd && periodEnd < now);

    if (isExpired) {
        return (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between text-rose-900 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                        <i className="ph-fill ph-warning-circle text-xl"></i>
                    </div>
                    <div>
                        <h4 className="font-[650] text-sm">Subscription Expired</h4>
                        <p className="text-xs text-rose-700">
                            Your access to premium features is restricted. Please upgrade to continue.
                        </p>
                    </div>
                </div>
                <Link href="/settings/billing" className="px-4 py-2 bg-rose-600 text-white text-xs font-[600] rounded-lg hover:bg-rose-700 transition-colors shadow-sm">
                    Upgrade Now
                </Link>
            </div>
        );
    }

    // Case 2: Trialing (Show days left)
    if (subscription.status === 'trialing' && trialEnd) {
        const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 3600 * 24));
        
        return (
            <div className="bg-indigo-900/5 border border-indigo-100 rounded-xl p-4 flex items-center justify-between text-indigo-900 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <i className="ph-fill ph-clock-countdown text-xl"></i>
                    </div>
                    <div>
                        <h4 className="font-[650] text-sm">Free Trial Active</h4>
                        <p className="text-xs text-indigo-700">
                            You have <span className="font-bold">{daysLeft} days</span> left in your trial. Enjoy full access!
                        </p>
                    </div>
                </div>
                <Link href="/settings/billing" className="px-4 py-2 bg-indigo-600 text-white text-xs font-[600] rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                    Upgrade Plan
                </Link>
            </div>
        );
    }

    return null;
}
