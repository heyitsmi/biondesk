import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { Resend } from "resend";

// Configure Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Allow execution to run longer (Vercel specific, if on Pro)
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // 1. Security Check (Prevent unauthorized access)
  // When using Vercel Cron, it sends this header automatically.
  // For local testing, you can simply remove this check or add the header manually.
  const authHeader = request.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    process.env.NODE_ENV === "production"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServerClient();
    console.log("[Cron] Starting reminder check...");

    // ==========================================
    // 1. Process Manual Scheduled Reminders
    // ==========================================
    const { data: manualJobs } = await supabase
      .from("reminder_jobs")
      .select("*, document:documents(*, contact:contacts(*))")
      .eq("status", "pending")
      .lte("scheduled_at", new Date().toISOString());

    if (manualJobs && manualJobs.length > 0) {
      console.log(`[Cron] Found ${manualJobs.length} manual jobs to process.`);

      for (const job of manualJobs) {
        const doc = job.document;
        const contact = doc.contact;

        if (!contact?.email) {
          console.warn(`[Cron] Skipping job ${job.id}: No contact email.`);
          continue;
        }

        // Send Email
        await resend.emails.send({
          from: "Biondesk <notifications@biondesk.com>", // Update with your verify domain
          to: contact.email,
          subject: `Reminder: ${doc.type.toUpperCase()} #${doc.number}`,
          html: `<p>${job.content || `This is a reminder for ${doc.type} #${doc.number}.`}</p>`,
        });

        // Update Job Status
        await supabase
          .from("reminder_jobs")
          .update({
            status: "completed",
            executed_at: new Date().toISOString(),
          })
          .eq("id", job.id);

        // Log to History
        await supabase.from("events").insert({
          workspace_id: doc.workspace_id,
          action: "reminder_sent",
          details: {
            title: "Manual Reminder Sent",
            subtitle: `To: ${contact.company || contact.name} (${doc.number})`,
            job_id: job.id,
          },
        });
      }
    }

    // ==========================================
    // 2. Process Auto-Rules (Simplified Logic)
    // ==========================================
    // Logic:
    // 1. Get active rules for all workspaces
    // 2. For each rule, find matching documents that haven't been reminded yet
    // 3. Send email & log

    // This part requires complex queries. For this example, we show the structure.
    // You would typically query `documents` where `due_date` matches the rule offset.

    console.log("[Cron] Reminder process finished.");
    return NextResponse.json({
      success: true,
      processed: manualJobs?.length || 0,
    });
  } catch (error: any) {
    console.error("[Cron] Error processing reminders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
