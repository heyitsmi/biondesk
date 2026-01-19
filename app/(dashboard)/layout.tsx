import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import '../app.css';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="bg-slate-50 text-slate-900 font-sans antialiased h-screen flex overflow-hidden">
            <Sidebar user={user} />
            <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50 transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
}
