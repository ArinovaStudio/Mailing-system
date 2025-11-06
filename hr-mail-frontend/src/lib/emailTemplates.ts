import { EmailData } from "@/pages/Index";

interface Template {
  subject: string;
  plaintext: string;
  html: string;
}

const templates: Record<string, Template> = {
  SHORTLISTED: {
    subject: "Congratulations {{NAME}} — You've Been Shortlisted!",
    plaintext: `Dear {{NAME}},

We are pleased to inform you that you have been shortlisted for the next stage of our selection process. Your application impressed our recruitment panel.

We will contact you shortly with further interview details.

Best regards,
HR Team
{{COMPANY}}`,
    html: `<div style='font-family:Segoe UI,Arial,sans-serif;max-width:650px'><h2 style='color:#1a73e8'>Dear {{NAME}},</h2><p>We are pleased to inform you that you have been <strong style='color:#1a73e8'>shortlisted</strong> for the next stage of our selection process. Your application impressed our recruitment panel.</p><p>We will contact you shortly with further interview details.</p><p>Best regards,<br><strong>HR Team</strong><br>{{COMPANY}}</p><p style='font-size:12px;color:#777'>This is an automated email sent to {{EMAIL}}.</p></div>`,
  },
  "INTERVIEW TIMING": {
    subject: "Interview Schedule — {{POSITION}} — {{NAME}}",
    plaintext: `Dear {{NAME}},

Your interview for the position of {{POSITION}} has been scheduled as follows:

Date: {{DATE}}
Time: {{TIME}}
Mode: {{MODE}}

Please confirm your availability by replying to this email.

Regards,
HR Team
{{COMPANY}}`,
    html: `<div style='font-family:Segoe UI,Arial,sans-serif;max-width:650px'><h2 style='color:#1a73e8'>Interview Schedule</h2><p>Candidate: <strong>{{NAME}}</strong></p><p>Position: <strong>{{POSITION}}</strong></p><ul><li><strong>Date:</strong> {{DATE}}</li><li><strong>Time:</strong> {{TIME}}</li><li><strong>Mode:</strong> {{MODE}}</li></ul><p>Please confirm your availability by replying to this email.</p><p>Regards,<br><strong>HR Team</strong><br>{{COMPANY}}</p></div>`,
  },
  "ASK DETAILS": {
    subject: "Request for Additional Details — {{NAME}}",
    plaintext: `Hello {{NAME}},

To proceed with your application, please provide the following:
- Full Name (as per ID proof)
- Contact Number
- Updated Resume
- Any other relevant documents

Reply with the requested items at your earliest convenience.

Thank you,
HR Department
{{COMPANY}}`,
    html: `<div style='font-family:Segoe UI,Arial,sans-serif;max-width:650px'><h2 style='color:#1a73e8'>Request for Additional Details</h2><p>Hello <strong>{{NAME}}</strong>,</p><p>To proceed with your application, please provide the following:</p><ul><li>Full Name (as per ID proof)</li><li>Contact Number</li><li>Updated Resume</li><li>Any other relevant documents</li></ul><p>Reply with the requested items at your earliest convenience.</p><p>Thank you,<br><strong>HR Department</strong><br>{{COMPANY}}</p></div>`,
  },
  PROVIDE: {
    subject: "Required Documents — Action Needed — {{NAME}}",
    plaintext: `Dear {{NAME}},

Please find attached the required documents/forms to be filled and returned by {{DEADLINE}}.

If you have any questions, reply to this email.

Warm regards,
HR Department
{{COMPANY}}`,
    html: `<div style='font-family:Segoe UI,Arial,sans-serif;max-width:650px'><h2 style='color:#1a73e8'>Documents to Provide</h2><p>Dear <strong>{{NAME}}</strong>,</p><p>Please find attached the required documents/forms. Kindly complete and return them by <strong>{{DEADLINE}}</strong>.</p><p>If you have questions, reply to this email.</p><p>Warm regards,<br><strong>HR Department</strong><br>{{COMPANY}}</p></div>`,
  },
  LETTERS: {
    subject: "Offer / Joining Letter — {{COMPANY}} — {{NAME}}",
    plaintext: `Dear {{NAME}},

Congratulations! We are delighted to offer you the position of {{POSITION}} at {{COMPANY}}.

Your offer/joining letter is attached. Please review and acknowledge by replying with your acceptance.

We look forward to having you onboard.

Sincerely,
HR Team
{{COMPANY}}`,
    html: `<div style='font-family:Segoe UI,Arial,sans-serif;max-width:650px'><h2 style='color:#1a73e8'>Offer Letter</h2><p>Dear <strong>{{NAME}}</strong>,</p><p>Congratulations! We are delighted to offer you the position of <strong>{{POSITION}}</strong> at <strong>{{COMPANY}}</strong>.</p><p>Your offer/joining letter is attached. Please review and acknowledge by replying with your acceptance.</p><p>Sincerely,<br><strong>HR Team</strong><br>{{COMPANY}}</p></div>`,
  },
};

const fallbackTemplate: Template = {
  subject: "Message from {{COMPANY}} — {{NAME}}",
  plaintext: `Hello {{NAME}},

This is an automated message from {{COMPANY}} regarding your application. Please contact HR for more details.

Regards,
HR Team`,
  html: `<div style='font-family:Segoe UI,Arial,sans-serif;max-width:650px'><p>Hello {{NAME}},</p><p>This is an automated message from {{COMPANY}} regarding your application. Please contact HR for more details.</p><p>Regards,<br><strong>HR Team</strong></p></div>`,
};

function replacePlaceholders(template: string, data: EmailData): string {
  let result = template;
  
  // Replace all placeholders
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, "g"), value || "");
  });
  
  return result;
}

export function renderEmail(data: EmailData) {
  const template = templates[data.TYPE] || fallbackTemplate;
  
  return {
    to: data.to,
    subject: replacePlaceholders(template.subject, data),
    plaintext: replacePlaceholders(template.plaintext, data),
    html: replacePlaceholders(template.html, data),
  };
}
