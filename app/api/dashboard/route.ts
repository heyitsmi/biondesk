import { NextResponse } from 'next/server';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { getDashboardStats, getRecentEvents } from '@/lib/db';

// GET /api/dashboard - Get dashboard statistics
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const [stats, recentActivity] = await Promise.all([
      getDashboardStats(workspace.id),
      getRecentEvents(workspace.id, 10),
    ]);
    
    return NextResponse.json({
      ...stats,
      recentActivity,
      workspace: {
        id: workspace.id,
        name: workspace.name,
        currency: workspace.currency,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
