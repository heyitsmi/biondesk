import { headers } from 'next/headers';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const VERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    console.warn('TURNSTILE_SECRET_KEY is not set. Skipping verification.');
    return true; // Allow if not configured in dev, but strictly should be false in prod
  }

  try {
    const formData = new FormData();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    
    // Optional: Add remote IP
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
        formData.append('remoteip', forwardedFor.split(',')[0]);
    }

    const response = await fetch(VERIFY_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const data: TurnstileVerifyResponse = await response.json();

    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes']);
    }

    return data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}
