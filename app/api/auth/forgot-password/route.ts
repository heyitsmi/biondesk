import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { generatePasswordResetToken } from "@/lib/auth";
import { sendEmail } from "@/lib/brevo";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Find user by email
    const { data: user } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("email", email.toLowerCase())
      .single();

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Generate password reset token
    const token = await generatePasswordResetToken(user.id);
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    // Send email using Brevo
    await sendEmail({
      to: [{ email: user.email, name: user.name }],
      subject: "Reset your Biondesk password",
      htmlContent: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset Your Password</h2>
                    <p>Hi ${user.name || "there"},</p>
                    <p>You requested to reset your password for Biondesk. Click the button below to proceed.</p>
                    <br/>
                    <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Reset Password
                    </a>
                    <br/><br/>
                    <p>Or copy this link: <br/> ${resetUrl}</p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <hr/>
                    <p style="color: #666; font-size: 12px;">Powered by Biondesk</p>
                </div>
            `,
      sender: { email: "noreply@notification.biondesk.com", name: "Biondesk" },
    });

    return NextResponse.json({
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
