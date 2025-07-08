import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { Resend } from 'resend';

console.log('Resend API Key:', process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Test Sender <noreply@sender.eventique.co.za>',
      to: 'gugunnn@gmail.com',
      subject: 'Test Email from Resend API',
      html: '<h1>Hello 👋</h1><p>This is a test email sent using Resend and Node.js</p>',
    });

    if (error) {
      console.error('❌ Failed to send email:', error);
    } else {
      console.log('✅ Email sent successfully:', data);
    }
  } catch (err) {
    console.error('🔥 Unexpected error:', err);
  }
}

sendTestEmail();
