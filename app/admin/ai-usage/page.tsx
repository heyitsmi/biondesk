
import { createServerClient } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'AI Usage | Biondesk',
  description: 'Monitor AI usage and costs',
};

export default async function AIUsagePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const supabase = createServerClient();
  
  // Fetch usage data
  const { data: usageData, error } = await supabase
    .from('ai_usage')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching AI usage:', error);
  }

  // Calculate totals
  const totalCost = usageData?.reduce((sum, item) => sum + (item.estimated_cost || 0), 0) || 0;
  const totalTokens = usageData?.reduce((sum, item) => sum + (item.total_tokens || 0), 0) || 0;
  const totalRequests = usageData?.length || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Usage & Costs</h1>
        <p className="text-slate-500 mt-1">Monitor your AI consumption and estimated costs.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <i className="ph ph-currency-dollar text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Estimated Cost</p>
              <h3 className="text-2xl font-bold text-slate-900">${totalCost.toFixed(4)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <i className="ph ph-cpu text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Tokens</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalTokens.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <i className="ph ph-lightning text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Requests</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalRequests.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Usage History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Usage History</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                Sorted by newest
            </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold whitespace-nowrap">Date</th>
                <th className="px-6 py-3 font-semibold whitespace-nowrap">Feature</th>
                <th className="px-6 py-3 font-semibold whitespace-nowrap">Model</th>
                <th className="px-6 py-3 font-semibold whitespace-nowrap text-right">Tokens</th>
                <th className="px-6 py-3 font-semibold whitespace-nowrap text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usageData && usageData.length > 0 ? (
                usageData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-slate-900 font-medium capitalize whitespace-nowrap">
                      {(item.feature || 'Unknown').replace(/-/g, ' ')}
                    </td>
                    <td className="px-6 py-3 text-slate-600 font-mono text-xs whitespace-nowrap">
                      {item.model}
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-right font-mono text-xs">
                       <span className="text-slate-400 mr-1">In:</span>{item.input_tokens} <span className="text-slate-300 mx-1">|</span> <span className="text-slate-400 mr-1">Out:</span>{item.output_tokens}
                       <div className="text-slate-900 font-semibold">{item.total_tokens}</div>
                    </td>
                    <td className="px-6 py-3 text-slate-900 font-semibold text-right whitespace-nowrap">
                      ${Number(item.estimated_cost).toFixed(5)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No usage data recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
