import * as brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();

// Set API Key
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

interface SendEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  sender?: { email: string; name: string };
}

export const sendEmail = async ({
  to,
  subject,
  htmlContent,
  sender = { 
    email: process.env.MAIL_FROM_ADDRESS || "noreply@notification.biondesk.com", 
    name: process.env.MAIL_FROM_NAME || "Biondesk" 
  },
}: SendEmailParams) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = sender;
  sendSmtpEmail.to = to;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    return { success: false, error };
  }
};
