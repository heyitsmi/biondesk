import { getCurrentUser, getUserWorkspace } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect('/login');
    }

    const workspace = await getUserWorkspace(user.id);

    return <SettingsClient initialWorkspace={workspace} user={user} />;
}
