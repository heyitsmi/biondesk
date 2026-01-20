export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback`;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Google Client ID or Secret is missing in environment variables');
}

export function getGoogleAuthURL() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: GOOGLE_REDIRECT_URI,
        client_id: GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
}

interface GoogleTokensResult {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
    error?: string;
}

export async function getGoogleTokens(code: string): Promise<GoogleTokensResult> {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(values).toString(),
        });
        
        return await res.json();
    } catch (error: any) {
        console.error("Failed to fetch Google tokens", error);
        throw new Error(error.message);
    }
}

interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

export async function getGoogleUser(accessToken: string, idToken: string): Promise<GoogleUserResult> {
    try {
        const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return await res.json();
    } catch (error: any) {
        console.error("Error fetching Google user", error);
        throw new Error(error.message);
    }
}
