import { createServerClient } from "@/lib/supabase";
import PricingClient from "./PricingClient";

export const metadata = {
    title: 'Pricing Management | Admin',
};

export default async function PricingPage() {
    const supabase = createServerClient();
    const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

    return <PricingClient plans={plans || []} />;
}
