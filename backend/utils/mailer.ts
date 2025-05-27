import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL;

/**
 * Sends a password reset email using Resend.
 * @param to The recipient's email address.
 * @param resetLink The password reset link to be included in the email.
 */
export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  // Ensure FROM_EMAIL is defined and valid
  if (!FROM_EMAIL || typeof FROM_EMAIL !== 'string' || FROM_EMAIL.trim() === '') {
    console.error('FROM_EMAIL environment variable is not set or is invalid.');
    return {
      success: false,
      error: 'Server configuration error: FROM_EMAIL is not set.',
    };
  }

  // Email payload matches Resend's expected format
  const emailData = {
    from: FROM_EMAIL,
    to,
    subject: 'Reset Your Password for WhatCanIGetFor',
    text: `
You requested a password reset for your WhatCanIGetFor account.

Reset your password by visiting the following link:
${resetLink}

If you didn’t request this, please ignore this message.

This link will expire in 1 hour.
    `,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You recently requested to reset your password for your WhatCanIGetFor account. Click the link below to proceed:</p>
        <p style="margin: 20px 0;">
          <a 
            href="${resetLink}" 
            style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
          >
            Reset Your Password
          </a>
        </p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 0.9em; color: #555;">
          Thank you,<br />
          The WhatCanIGetFor Team
        </p>
      </div>
    `,
  };

  try {
    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    console.log('Password reset email sent successfully:', data);
    return { success: true, data };
  } catch (exception) {
    console.error('Exception during password reset email sending:', exception);
    return { success: false, error: exception };
  }
};
