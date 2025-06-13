import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;
const SUPPORT_EMAIL = 'benji.hoffenberg@gmail.com'; // Target email for support requests

const resend = new Resend(RESEND_API_KEY);

interface EmailResponse {
  success: boolean;
  error?: string;
  data?: any; // Can be more specific based on Resend's success response type
}

export const sendSupportEmail = async (
  name: string | undefined,
  email: string,
  subject: string,
  message: string
): Promise<EmailResponse> => {
  if (!RESEND_API_KEY) {
    console.error('Resend API key is not configured.');
    return { success: false, error: 'Resend API key is not configured.' };
  }

  if (!FROM_EMAIL) {
    console.error('FROM_EMAIL environment variable is not set.');
    return { success: false, error: 'FROM_EMAIL environment variable is not set.' };
  }

  // Basic validation for FROM_EMAIL format
  if (!/\S+@\S+\.\S+/.test(FROM_EMAIL)) {
    console.error('FROM_EMAIL environment variable is not a valid email address.');
    return { success: false, error: 'FROM_EMAIL environment variable is invalid.' };
  }
  
  const emailSubject = `[Support Request] ${subject}`;

  // Plain text version of the email
  let textContent = `New Support Request:\n\n`;
  if (name) {
    textContent += `Name: ${name}\n`;
  }
  textContent += `Email: ${email}\n`;
  textContent += `Subject: ${subject}\n`;
  textContent += `Message:\n${message}\n`;

  // HTML version of the email
  let htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">New Support Request</h2>
      <p>You have received a new support request with the following details:</p>
      <hr style="border: none; border-top: 1px solid #eee;" />
  `;
  if (name) {
    htmlContent += `<p><strong>Name:</strong> ${name}</p>`;
  }
  htmlContent += `
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <div style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; border-radius: 4px;">
        <p style="white-space: pre-wrap; margin: 0;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
      <p style="font-size: 0.9em; color: #777;">
        This email was sent from the contact form on WhatCanIGetFor.
      </p>
    </div>
  `;

  const emailData = {
    from: FROM_EMAIL,
    to: SUPPORT_EMAIL,
    reply_to: email, // User's email
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
  };

  try {
    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Failed to send support email:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    console.log('Support email sent successfully:', data);
    return { success: true, data };
  } catch (exception) {
    console.error('An unexpected error occurred while sending the support email:', exception);
    // Ensure exception is an Error instance to access message property
    const errorMessage = exception instanceof Error ? exception.message : 'An unknown error occurred.';
    return { success: false, error: `An unexpected error occurred while sending the email: ${errorMessage}` };
  }
};
