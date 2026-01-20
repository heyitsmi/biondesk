import { redirect } from 'next/navigation';
import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { getAnalyticsData } from '@/lib/db';
import AnalyticsView from '@/components/analytics/AnalyticsView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics',
};

export default async function AnalyticsPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    const workspace = await getUserWorkspace(user.id);
    if (!workspace) return <div className="p-8">No workspace found.</div>;

    const data = await getAnalyticsData(workspace.id);

    if (!data) return <div className="p-8">Failed to load analytics data.</div>;

    return <AnalyticsView data={data} />;
}
