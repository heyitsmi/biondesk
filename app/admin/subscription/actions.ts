"use server";

import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// --- Plans ---

export async function createPlan(data: any) {
    const user = await getCurrentUser();
    if (user?.role !== 'admin') throw new Error("Unauthorized");

    const supabase = createServerClient();
    const { error } = await supabase.from('plans').insert(data);
    
    if (error) throw new Error(error.message);
    revalidatePath('/admin/pricing');
    return { success: true };
}

export async function togglePlanStatus(planId: string, isActive: boolean) {
    const user = await getCurrentUser();
    if (user?.role !== 'admin') throw new Error("Unauthorized");

    const supabase = createServerClient();
    const { error } = await supabase.from('plans').update({ is_active: isActive }).eq('id', planId);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/pricing');
    return { success: true };
}

export async function updatePlanPrice(planId: string, newPrice: number) {
    const user = await getCurrentUser();
    if (user?.role !== 'admin') throw new Error("Unauthorized");

    const supabase = createServerClient();
    const { error } = await supabase
        .from('plans')
        .update({ price: newPrice })
        .eq('id', planId);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/pricing');
    revalidatePath('/settings/billing'); // Revalidate user page too
    return { success: true };
}

// --- Settings ---

export async function updateTrialSettings(days: number) {
    const user = await getCurrentUser();
    if (user?.role !== 'admin') throw new Error("Unauthorized");

    const supabase = createServerClient();
    const { error } = await supabase.from('app_settings').upsert({
        key: 'trial_settings',
        value: { days },
        updated_by: user.id,
        updated_at: new Date().toISOString()
    });

    if (error) throw new Error(error.message);
    revalidatePath('/admin/settings');
    return { success: true };
}
