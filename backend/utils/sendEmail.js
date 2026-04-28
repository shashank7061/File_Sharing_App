const nodemailer = require('nodemailer');

/**
 * Send email using Brevo API (primary) → Resend API (secondary) → Gmail SMTP (fallback).
 * 
 * Brevo (formerly Sendinblue) free tier: 300 emails/day, can send to ANY recipient.
 * Resend free tier: can only send to your own email (limited).
 * Gmail SMTP: may be blocked by network firewalls.
 */
const sendEmail = async (options) => {

  // ========== METHOD 1: Brevo API (recommended - sends to ANY email) ==========
  if (process.env.BREVO_API_KEY) {
    try {
      console.log('📧 Trying Brevo API...');
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'File Share System',
            email: process.env.EMAIL_USER || 'imkumar7061@gmail.com'
          },
          to: [{ email: options.to }],
          subject: options.subject,
          htmlContent: options.html
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Brevo API error:', data);
        throw new Error(data.message || `Brevo API error (${response.status})`);
      }

      console.log('✅ Email sent successfully via Brevo to:', options.to);
      console.log('Brevo Message ID:', data.messageId);
      return data;
    } catch (brevoError) {
      console.error('❌ Brevo failed:', brevoError.message);
      // Fall through to next method
    }
  }

  // ========== METHOD 2: Resend API (only works for own email on free tier) ==========
  if (process.env.RESEND_API_KEY) {
    try {
      console.log('📧 Trying Resend API...');
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: 'File Share System <onboarding@resend.dev>',
        to: [options.to],
        subject: options.subject,
        html: options.html
      });

      if (error) {
        console.error('❌ Resend API error:', error);
        throw new Error(error.message || 'Resend API error');
      }

      console.log('✅ Email sent successfully via Resend to:', options.to);
      console.log('Resend ID:', data?.id);
      return data;
    } catch (resendError) {
      console.error('❌ Resend failed:', resendError.message);
      // Fall through to next method
    }
  }

  // ========== METHOD 3: Gmail SMTP (fallback - may be blocked by network) ==========
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('No email service configured. Set BREVO_API_KEY in .env (recommended).');
    }

    console.log('📧 Trying Gmail SMTP...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    const info = await transporter.sendMail({
      from: `File Share System <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    });

    console.log('✅ Email sent successfully via Gmail SMTP to:', options.to);
    console.log('Message ID:', info.messageId);
    return info;
  } catch (smtpError) {
    console.error('❌ Gmail SMTP also failed:', smtpError.message);

    if (smtpError.code === 'ESOCKET' || smtpError.code === 'ETIMEDOUT' || smtpError.code === 'ECONNREFUSED') {
      throw new Error(
        'Email failed: All methods exhausted. SMTP ports blocked by network. ' +
        'Please set BREVO_API_KEY in .env. Get a free key at https://app.brevo.com'
      );
    }

    throw new Error(`Failed to send email: ${smtpError.message}`);
  }
};

module.exports = sendEmail;
