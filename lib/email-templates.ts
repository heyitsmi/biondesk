export type ReminderEmailType = 'invoice' | 'proposal' | 'quote';

interface EmailData {
  recipientName: string;
  documentType: string;
  documentNumber: string;
  documentTitle?: string;
  amount?: string; // Formatted amount e.g. "$1,200.00"
  dueDate?: string; // Formatted date e.g. "Oct 24, 2024"
  sentDate?: string; // Formatted date
  validUntil?: string; // Formatted date
  actionUrl: string;
  senderName: string;
  senderEmail: string;
}

export function generateReminderEmail(type: ReminderEmailType, data: EmailData): string {
  const {
    recipientName,
    documentNumber,
    documentTitle,
    amount,
    dueDate,
    sentDate,
    validUntil,
    actionUrl,
    senderName,
    senderEmail
  } = data;

  // Common Styles
  const styleBlock = `
    <style>
        /* Base Reset */
        body { margin: 0; padding: 0; min-width: 100%; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; }
        table { border-spacing: 0; border-collapse: collapse; }
        td { padding: 0; }
        img { border: 0; }
        
        /* Container */
        .wrapper { width: 100%; table-layout: fixed; background-color: #F8FAFC; padding-bottom: 40px; }
        .main-table { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #E2E8F0; }
        
        /* Content */
        .header { padding: 32px 40px; text-align: center; border-bottom: 1px solid #F1F5F9; }
        .body { padding: 40px; }
        .footer { padding: 24px; text-align: center; color: #64748B; font-size: 12px; }
        
        /* Typography */
        h1 { margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px; }
        p { margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #475569; }
        
        /* Box Styles */
        .info-box { background-color: #F8FAFC; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #E2E8F0; }
        .amount { font-size: 32px; font-weight: 700; color: #0F172A; margin: 8px 0; }
        .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 600; }
        .project-title { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 8px 0; }
        
        /* Button */
        .btn { display: inline-block; background-color: #0F172A; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
        .btn:hover { background-color: #1E293B; }
        
        /* Utilities */
        .divider { height: 1px; background-color: #E2E8F0; margin: 24px 0; }
        
        /* Mobile */
        @media screen and (max-width: 600px) {
            .body { padding: 24px; }
            .header { padding: 24px; }
            h1 { font-size: 20px; }
        }
    </style>
  `;

  let title = '';
  let bodyContent = '';
  let boxContent = '';
  let ctaText = '';
  let footerNote = '';

  // Template Specific Content
  switch (type) {
    case 'invoice':
      title = 'Just a friendly nudge.';
      bodyContent = `
        <p>Hi ${recipientName},</p>
        <p>Hope you’re having a great week. Just sending a quick reminder that Invoice <strong>#${documentNumber}</strong> ${dueDate ? `was due on ${dueDate}` : 'is due'}.</p>
      `;
      boxContent = `
        <div class="label">Amount Due</div>
        <div class="amount">${amount || '$0.00'}</div>
        <div style="font-size: 14px; color: #64748B; margin-top: 4px;">Due Date: ${dueDate || 'N/A'}</div>
      `;
      ctaText = 'View & Pay Invoice';
      footerNote = "If you’ve already sent payment, please disregard this email. Thank you!";
      break;

    case 'proposal': // Also covers 'proposal-reminder' logic
      title = 'Thoughts on the proposal?';
      bodyContent = `
        <p>Hi ${recipientName},</p>
        <p>I wanted to follow up on the proposal I sent regarding <strong>${documentTitle || 'your project'}</strong>. I'm excited about the direction we discussed.</p>
      `;
      boxContent = `
        <div class="label" style="margin-bottom: 8px;">Project Scope</div>
        <div class="project-title">${documentTitle || 'Project Proposal'}</div>
        <div style="font-size: 14px; color: #64748B; margin-top: 4px;">Sent on: ${sentDate || 'Recently'}</div>
      `;
      ctaText = 'View Proposal';
      footerNote = "Link expires in 7 days for security purposes.";
      break;

    case 'quote':
      title = 'Ready to get started?';
      bodyContent = `
        <p>Hi ${recipientName},</p>
        <p>Just checking in on the quote I sent over for <strong>${documentTitle || `Quote #${documentNumber}`}</strong>. It's still valid until the end of the week.</p>
      `;
      boxContent = `
        <div class="label">Total Estimate</div>
        <div class="amount">${amount || '$0.00'}</div>
        <div style="font-size: 14px; color: #64748B; margin-top: 4px;">Valid until: ${validUntil || 'N/A'}</div>
      `;
      ctaText = 'Review & Approve Quote';
      footerNote = "Have questions or need adjustments? Just reply to this email.";
      break;
  }

  // Full Template Assembly
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${styleBlock}
</head>
<body>
    <div class="wrapper">
        <table class="wrapper" role="presentation">
            <tr>
                <td>
                    <table role="presentation" width="100%" style="height: 40px;"><tr><td></td></tr></table>
                    <table class="main-table" role="presentation" align="center">
                        <!-- HEADER -->
                        <tr>
                            <td class="header">
                                <div style="font-family: 'Google Sans Flex', sans-serif; font-weight: 800; font-size: 20px; color: #0F172A; display: inline-flex; align-items: center; gap: 8px;">
                                    <span style="display:inline-block; width:20px; height:20px; background-color:#0F172A; border-radius:4px; vertical-align:middle; margin-right:8px;"></span>
                                    Biondesk
                                </div>
                            </td>
                        </tr>

                        <!-- BODY -->
                        <tr>
                            <td class="body">
                                <h1>${title}</h1>
                                ${bodyContent}
                                
                                <!-- DETAILS BOX -->
                                <table width="100%" role="presentation">
                                    <tr>
                                        <td class="info-box" align="center">
                                            ${boxContent}
                                        </td>
                                    </tr>
                                </table>

                                <!-- CTA -->
                                <p>You can proceed by clicking the button below:</p>
                                <table width="100%" role="presentation">
                                    <tr>
                                        <td align="center" style="padding-bottom: 24px;">
                                            <a href="${actionUrl}" class="btn" target="_blank">${ctaText}</a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="font-size: 14px; color: #94A3B8; margin-bottom: 0;">
                                    ${footerNote}
                                </p>
                            </td>
                        </tr>

                        <!-- SENDER FOOTER -->
                        <tr>
                            <td style="padding: 0 40px 40px 40px; text-align: center;">
                                <div class="divider"></div>
                                <p style="margin: 0; font-weight: 600; color: #0F172A;">${senderName}</p>
                                <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748B;">${senderEmail}</p>
                            </td>
                        </tr>
                    </table>

                    <!-- SYSTEM FOOTER -->
                    <table role="presentation" align="center" width="100%" style="max-width: 600px;">
                        <tr>
                            <td class="footer">
                                <p style="margin-bottom: 8px;">Sent via <strong>Biondesk</strong></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
  `;
}
