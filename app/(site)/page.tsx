import { createServerClient } from "@/lib/supabase";
import HomeClient from "./HomeClient";

export default async function Home() {
  const supabase = createServerClient();
  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('price');

  // Fetch trial days
  const { data: settings } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'trial_settings')
    .maybeSingle();

  const trialDays = settings?.value?.days || 7;

  return <HomeClient plans={plans || []} trialDays={trialDays} />;
}
