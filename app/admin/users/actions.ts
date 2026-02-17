"use server";

import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function updateUserRole(userId: string, newRole: string) {
  try {
    // 1. Verify current user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error("Unauthorized: Only admins can perform this action.");
    }

    if (!['user', 'admin'].includes(newRole)) {
        throw new Error("Invalid role.");
    }

    const supabase = createServerClient();

    // 2. Update role
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      console.error("Failed to update user role:", error);
      throw new Error("Failed to update user role.");
    }

    // 3. Revalidate
    revalidatePath('/admin/users');
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function impersonateUser(userId: string) {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
        return { success: false, error: "Unauthorized" };
    }

    const cookieStore = await cookies();
    cookieStore.set('impersonate_id', userId, { path: '/' });
    
    return { success: true };
}

export async function stopImpersonating() {
    const cookieStore = await cookies();
    cookieStore.delete('impersonate_id');
    redirect('/admin/dashboard');
}
