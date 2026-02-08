# Biondesk Reminder System

The Biondesk Reminder System is an automated email notification engine designed to help users get paid faster and close deals more effectively. It consists of two main parts: the **Scheduler** (which plans when emails should be sent) and the **Processor** (which actually sends them).

## 1. How It Works

### The Architecture

1.  **Rule Configuration**: Users enable/disable rules in the "Auto-Reminder Rules" section (e.g., "Approaching Due Date").
2.  **Automatic Scheduling**: When a user creates, updates, or sends a document (Invoice/Quote), the system checks active rules and inserts a "pending" job into the `reminder_jobs` database table.
    - _Example:_ If an Invoice is due on Friday, and the "3 days before" rule is active, a job is scheduled for Tuesday.
3.  **Cron Trigger**: A Cloudflare Worker (or any cron service) pings the secure API endpoint `https://biondesk.com/api/cron/reminders` every 15 minutes.
4.  **Processing**: The API checks for any "pending" jobs whose `scheduled_at` time has passed.
5.  **Email Delivery**: The system sends the email via Brevo and updates the job status to `sent`.

## 2. Reminder Rules

The system currently supports three types of automated rules:

### 🟡 Approaching Due Date (`pre_due`)

- **Target**: Invoices
- **Trigger**: 3 days _before_ the Due Date.
- **Condition**: Status is NOT `paid`, `draft`, or `accepted`.
- **Goal**: Gentle nudge to ensure payment is prepared.

### 🔴 On Overdue (`overdue`)

- **Target**: Invoices
- **Trigger**: 1 day _after_ the Due Date.
- **Condition**: Status is NOT `paid`, `draft`, or `accepted`.
- **Goal**: Urgent reminder for missed payment.

### 🔄 Quote Follow-up (`quote_followup`)

- **Target**: Quotes / Proposals
- **Trigger**: 2 days _after_ the Sent Date.
- **Condition**: Status is `sent` or `viewed` (has not been accepted yet).
- **Goal**: Check in with the client to close the deal.

## 3. Server-Side Setup

To ensure reminders are sent, a Cron Job must be running.

- **Endpoint**: `POST /api/cron/reminders`
- **Security**: Requires `Authorization: Bearer <CRON_SECRET>` header.
- **Infrastructure**: We recommend using **Cloudflare Workers** (Free Tier) to trigger this endpoint securely and reliably.
  - _See `setup-cron.md` for detailed setup instructions._

## 4. Development & Debugging

- **Database Table**: `reminder_jobs` contains the queue.
- **Logs**: Check the `reminder_jobs` table for `status` (`pending`, `sent`, `failed`) and `error` messages.
- **Manual Trigger**: You can manually trigger the cron endpoint using Postman or Curl with your secret key to force-process due reminders immediately.
