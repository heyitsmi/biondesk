import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProposalsClient from './ProposalsClient';

export default async function ProposalsPage() {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect('/login');
    }

    return <ProposalsClient />;
}
