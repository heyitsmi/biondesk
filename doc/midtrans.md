# Midtrans Integration Documentation

This project uses [Midtrans](https://midtrans.com) as the payment gateway for handling subscription payments.

## 1. Prerequisites

- A Midtrans Account (Sandbox for testing, Production for live).
- Access Keys (Server Key & Client Key) from the Midtrans Dashboard.

## 2. Environment Variables

Configure the following variables in your `.env` or `.env.local` file:

```env
# Midtrans Keys (Get these from Dashboard > Settings > Access Keys)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxx  # Server Key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx  # Client Key

# Environment Switcher
# Set to 'false' for Sandbox (Testing)
# Set to 'true' for Production (Real Payments)
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

**Important**:

- If `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true`, you **MUST** use Production keys or transactions will fail.
- You must **redeploy** your application after changing any `NEXT_PUBLIC_` variable.

### Frontend Integration (Snap.js)

The Snap.js script is loaded in two main components:

1.  `app/(dashboard)/settings/SettingsClient.tsx`
2.  `app/(dashboard)/settings/billing/BillingClient.tsx`

**Important:** Both components must use `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION` to determine whether to load the Production or Sandbox script.

```javascript
const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const snapScript = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";
```

## 3. Project Structure

### Backend (`lib/midtrans.ts`)

- Handles server-side logic like creating transactions and verifying signatures.
- Automatically selects the API URL (Sandbox vs Production) based on `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION`.

### API Routes

- **Create Transaction**: `POST /api/payment/create-transaction`
  - Generates a Snap Token for the frontend.
- **Webhook**: `POST /api/payment/webhook`
  - Receives payment status updates from Midtrans.
  - Updates the `transactions` table and `subscriptions` table in Supabase.

### Frontend (`SettingsClient.tsx`)

- Loads the Snap.js script dynamically based on the environment.
- Triggers the popup payment window using `window.snap.pay()`.

## 4. Midtrans Dashboard Setup

Log in to [Midtrans Dashboard](https://dashboard.midtrans.com/) and configure:

### A. Access Keys

Go to **Settings > Access Keys**. Copy the Server and Client keys to your `.env` file.

### B. Snap Preferences (Redirect URLs)

Go to **Settings > Snap Preferences > System Settings**.
Set the Redirect URLs to handle user navigation after payment:

- **Finish URL**: `https://[YOUR_DOMAIN]/payment/finish`
- **Unfinish Payment URL**: `https://[YOUR_DOMAIN]/payment/error`
- **Error Payment URL**: `https://[YOUR_DOMAIN]/payment/error`

### C. Notification URL (Webhook)

Go to **Settings > Configuration** (or create via API, but usually set in Dashboard).
Set the **Payment Notification URL** to:

```
https://[YOUR_DOMAIN]/api/payment/webhook
```

**Note**:

- For **Local Development**, use [Ngrok](https://ngrok.com) to expose your localhost (e.g., `https://xxxx.ngrok-free.app/api/payment/webhook`).
- For **Production**, use your actual domain (e.g., `https://biondesk.com/api/payment/webhook`).
- You can click "Test Notification" in the dashboard. Ensure your server returns `200 OK`.

## 5. Troubleshooting

- **Transaction Not Found**: Ensure you are not mixing Sandbox keys with Production mode (or vice versa).
- **Webhook Error**: Check Vercel logs. Ensure all environment variables (Supabase, etc.) are present in the Production deployment.
- **CORS Issues**: Usually not an issue with Snap, but ensure your allowed domains are configured in Midtrans if strictly enforced.
