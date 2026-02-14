import TapToneClient from './TapToneClient';
import { Suspense } from 'react';

export const metadata = {
  title: 'TapTone - Biondesk',
  description: 'Say the right thing, at the right time, in the right tone.',
};

export default function TapTonePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TapToneClient />
    </Suspense>
  );
}
