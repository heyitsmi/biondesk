import { createServerClient } from "@/lib/supabase";
import SettingsClient from "./SettingsClient";

export const metadata = {
    title: 'Settings | Admin',
};

export default async function SettingsPage() {
    const supabase = createServerClient();
    const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'trial_settings')
        .single();
        
    const settings = data?.value || { days: 7 };

    return <SettingsClient settings={settings} />;
}
