# Cloudflare Cron Trigger Setup for Biondesk

To enable automatic scheduled reminders without relying on Vercel's free tier limits, we use a **Cloudflare Worker** as a "Cron Trigger". This worker simply pings our API endpoint securely.

## 1. Create a Secret Key

First, generate a strong random secret key. This secures your API so only Cloudflare can trigger it.

1.  Run `openssl rand -hex 32` in your terminal (or use a password generator).
2.  Add this key to your `.env.local` file:
    ```env
    CRON_SECRET=your_generated_secret_here
    ```
3.  **Important:** Add this same environment variable to your Vercel Project Settings (Environment Variables).

## 2. Create the Cloudflare Worker

1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Go to **Workers & Pages** > **Overview**.
3.  Click **Create Application** > **Create Worker**.
4.  Name it `biondesk-cron` (or similar) and click **Deploy**.
5.  Click **Edit Code**.
6.  Replace the default code with the following script:

    ```javascript
    export default {
      async scheduled(event, env, ctx) {
        console.log("Triggering Biondesk Cron...");

        // Replace with your actual domain
        const response = await fetch(
          "https://biondesk.com/api/cron/reminders",
          {
            headers: {
              Authorization: `Bearer ${env.CRON_SECRET}`,
            },
          },
        );

        console.log(`Response status: ${response.status}`);
        const text = await response.text();
        console.log(`Response body: ${text}`);
      },
    };
    ```

7.  Click **Save and deploy**.

## 3. Configure Worker Variables

1.  Go to the Worker's **Settings** tab.
2.  Select **Variables and Secrets**.
3.  Click **Add variable**.
    - **Variable name**: `CRON_SECRET`
    - **Value**: (The same secret key from Step 1)
    - **Type**: Select **Secret** (Encrypt).
4.  Click **Save and deploy**.

## 4. Set the Cron Schedule

1.  Go to the Worker's **Triggers** tab.
2.  Scroll down to **Cron Triggers**.
3.  Click **Add Cron Trigger**.
4.  Choose **Cron expression**.
5.  Enter `*/15 * * * *` (Runs every 15 minutes).
6.  Click **Add Trigger**.

## Verification

Wait for the next 15-minute interval (e.g., :00, :15, :30, :45). You can check the **Logs** tab in the Cloudflare Worker to see if it successfully triggered the API (Status 200).
