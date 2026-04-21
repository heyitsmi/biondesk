import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin Dashboard | Biondesk',
  description: 'Administrative overview',
};

export default async function AdminDashboardPage() {
    // Auth check
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
        redirect('/dashboard');
    }

    const supabase = createServerClient();

    // Get today's UTC start time
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Fetch dynamic stats
    const [
        { count: totalUsers },
        { count: aiActivityToday }
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('ai_usage').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString())
    ]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Welcome back, {user.name}
                </h1>
                <p className="text-slate-500">
                    Here's what's happening across the platform today.
                </p>
            </div>

            {/* Quick Stats Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <i className="ph ph-users text-xl"></i>
                        </div>
                        <h3 className="font-semibold text-slate-900">Total Users</h3>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{totalUsers || 0}</div>
                    <p className="text-xs text-slate-500 mt-2">Active accounts</p>
                </div>
                
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <i className="ph ph-robot text-xl"></i>
                        </div>
                        <h3 className="font-semibold text-slate-900">AI Activity</h3>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{aiActivityToday || 0}</div>
                    <p className="text-xs text-slate-500 mt-2">Requests today</p>
                </div>

                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <i className="ph ph-warning-circle text-xl"></i>
                        </div>
                        <h3 className="font-semibold text-slate-900">System Status</h3>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 text-emerald-600">Operational</div>
                    <p className="text-xs text-slate-500 mt-2">All systems normal</p>
                </div>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                 <h3 className="font-semibold text-indigo-900 mb-2">Admin Notice</h3>
                 <p className="text-indigo-700 text-sm">
                     You are viewing the administrative dashboard. Changes made here may affect all users.
                 </p>
            </div>
        </div>
    );
}
