import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Opportunity',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
