import nodemailer from 'nodemailer';

export interface EmailConfig {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

// Create a transporter using Gmail or your email service
// You'll need to set up environment variables for email credentials
export function createEmailTransporter() {
  return nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
  });
}

export async function sendEmail(config: EmailConfig): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Event Manager'}" <${process.env.EMAIL_USER}>`,
      to: config.to,
      subject: config.subject,
      text: config.text,
      html: config.html,
      attachments: config.attachments,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateCertificateEmailHTML(data: {
  memberName: string;
  clubName: string;
  eventName: string;
  collegeName: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #70001A, #C89446);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #C89446;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Congratulations!</h1>
      </div>
      <div class="content">
        <p>Dear <strong>${data.memberName}</strong>,</p>
        
        <p>Congratulations on your participation in <strong>${data.eventName}</strong>!</p>
        
        <p>We are pleased to attach your certificate of appreciation for your valuable contribution to this event organized by <strong>${data.clubName}</strong> at <strong>${data.collegeName}</strong>.</p>
        
        <p>Please find your certificate attached to this email. You can download and print it for your records.</p>
        
        <p>Thank you for being an active member of our community. We look forward to your continued participation in future events!</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>${data.clubName}</strong><br>
          ${data.collegeName}
        </p>
      </div>
      <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </body>
    </html>
  `;
}
