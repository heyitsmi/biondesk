"use server";

import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ============================================
// Insight Category Actions
// ============================================
export async function createInsightCategory(data: { name: string; slug: string }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    const supabase = createServerClient();
    const { data: category, error } = await supabase
      .from("insight_categories")
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/admin/insights");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error creating insight category:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteInsightCategory(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    const supabase = createServerClient();
    const { error } = await supabase.from("insight_categories").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/insights");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ============================================
// Insight Actions
// ============================================
export async function createInsight(data: any) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    const payload = {
      ...data,
      author_id: user.id,
      published_at: data.status === "published" && !data.published_at ? new Date().toISOString() : data.published_at,
    };

    const supabase = createServerClient();
    const { data: insight, error } = await supabase
      .from("insights")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/insights");
    revalidatePath("/insights");
    
    return { success: true, data: insight };
  } catch (error) {
    console.error("Error creating insight:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateInsight(id: string, data: any) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    const payload = {
      ...data,
      published_at: data.status === "published" && !data.published_at ? new Date().toISOString() : data.published_at,
    };

    const supabase = createServerClient();
    const { data: insight, error } = await supabase
      .from("insights")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/insights");
    revalidatePath("/insights");
    revalidatePath(`/insights/${insight.slug}`);
    
    return { success: true, data: insight };
  } catch (error) {
    console.error("Error updating insight:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteInsight(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    const supabase = createServerClient();
    const { error } = await supabase.from("insights").delete().eq("id", id);
    if (error) throw error;
    
    revalidatePath("/admin/insights");
    revalidatePath("/insights");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting insight:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
