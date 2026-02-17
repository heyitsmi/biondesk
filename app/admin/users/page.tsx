import { createServerClient } from "@/lib/supabase";
import UserTable from "./UserTable";

export const metadata = {
  title: 'User Management | Admin',
};

export default async function UsersPage() {
  const supabase = createServerClient();
  
  // RLS policies should allow admin to see this
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return <div className="p-8 text-red-500">Error loading users. Please check your permissions.</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">
            Manage user accounts and roles.
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            Total Users: <span className="font-bold text-slate-900">{users?.length || 0}</span>
        </div>
      </div>

      <UserTable users={users || []} />
    </div>
  );
}
