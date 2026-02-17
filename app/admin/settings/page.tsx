import { createServerClient } from "@/lib/supabase";
import SettingsClient from "./SettingsClient";

export const metadata = {
    title: 'Settings | Admin',
};

export default async function SettingsPage() {
    const supabase = createServerClient();
    const { data: trialData } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'trial_settings')
        .single();
        
    const { data: exchangeData } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'exchange_rate')
        .single();

    const settings = {
        trial: trialData?.value || { days: 7 },
        exchange: exchangeData?.value || { rate: 16000 }
    };

    return <SettingsClient settings={settings} />;
}
