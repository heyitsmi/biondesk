import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect('/login');
    }

    const supabase = createServerClient();

    // Parallel Data Fetching
    const [workspace, plansResult, subscriptionResult, transactionsResult] = await Promise.all([
        getUserWorkspace(user.id),
        supabase.from('plans').select('*').eq('is_active', true).order('price'),
        supabase.from('subscriptions').select('*, plans(*)').eq('user_id', user.id).maybeSingle(),
        supabase.from('transactions').select('*, plans(name)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
    ]);

    const plans = plansResult.data || [];
    const subscription = subscriptionResult.data || null;
    const transactions = transactionsResult.data || [];

    return (
        <SettingsClient 
            initialWorkspace={workspace} 
            user={user} 
            plans={plans}
            subscription={subscription}
            transactions={transactions}
        />
    );
}
