import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month'; // week, month, year

    const supabase = createServerClient();
    
    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'month':
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    // Get revenue over time (paid documents)
    const { data: revenueData } = await supabase
      .from('documents')
      .select('amount, paid_at')
      .eq('workspace_id', workspace.id)
      .eq('status', 'paid')
      .gte('paid_at', startDate.toISOString())
      .order('paid_at', { ascending: true });

    // Get documents created over time
    const { data: documentsData } = await supabase
      .from('documents')
      .select('type, created_at')
      .eq('workspace_id', workspace.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Get opportunities by stage with values
    const { data: opportunitiesData } = await supabase
      .from('opportunities')
      .select('stage, value')
      .eq('workspace_id', workspace.id);

    // Aggregate revenue by date
    const revenueByDate: Record<string, number> = {};
    (revenueData || []).forEach((doc) => {
      if (doc.paid_at) {
        const date = doc.paid_at.split('T')[0];
        revenueByDate[date] = (revenueByDate[date] || 0) + (doc.amount || 0);
      }
    });

    // Aggregate documents by date and type
    const documentsByDate: Record<string, { count: number; type: string }[]> = {};
    (documentsData || []).forEach((doc) => {
      const date = doc.created_at.split('T')[0];
      if (!documentsByDate[date]) {
        documentsByDate[date] = [];
      }
      const existing = documentsByDate[date].find((d) => d.type === doc.type);
      if (existing) {
        existing.count++;
      } else {
        documentsByDate[date].push({ type: doc.type, count: 1 });
      }
    });

    // Aggregate opportunities by stage
    const opportunitiesByStage: Record<string, { count: number; value: number }> = {};
    (opportunitiesData || []).forEach((opp) => {
      if (!opportunitiesByStage[opp.stage]) {
        opportunitiesByStage[opp.stage] = { count: 0, value: 0 };
      }
      opportunitiesByStage[opp.stage].count++;
      opportunitiesByStage[opp.stage].value += opp.value || 0;
    });

    return NextResponse.json({
      period,
      revenue: Object.entries(revenueByDate).map(([date, amount]) => ({
        date,
        amount,
      })),
      documents: Object.entries(documentsByDate).flatMap(([date, items]) =>
        items.map((item) => ({
          date,
          count: item.count,
          type: item.type,
        }))
      ),
      opportunities: Object.entries(opportunitiesByStage).map(([stage, data]) => ({
        stage,
        count: data.count,
        value: data.value,
      })),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
