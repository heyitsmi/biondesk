import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      invoiceId,
      invoiceNumber,
      recipientEmail,
      recipientName,
      publicUrl,
      workspaceName,
    } = body;

    // Basic validation
    if (!invoiceId || !recipientEmail || !publicUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const subject = `Invoice ${invoiceNumber} from ${workspaceName}`;
    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Invoice from ${workspaceName}</h2>
            <p>Hi ${recipientName || "there"},</p>
            <p>Here is invoice <strong>${invoiceNumber}</strong> for your review and payment.</p>
            <br/>
            <a href="${publicUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Invoice
            </a>
            <br/><br/>
            <p>Or copy this link: <br/> ${publicUrl}</p>
            <hr/>
            <p style="color: #666; font-size: 12px;">Powered by Biondesk</p>
        </div>
    `;

    const result = await sendEmail({
      to: [{ email: recipientEmail, name: recipientName }],
      subject: subject,
      htmlContent: htmlContent,

    });

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
