import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import BillingClient from "./BillingClient";

export const metadata = {
    title: 'Billing | Settings',
};

export default async function BillingPage() {
    const user = await getCurrentUser();
    const supabase = createServerClient();

    const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

    return <BillingClient plans={plans || []} subscription={subscription} />;
}
