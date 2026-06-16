import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

// Using a type or enum ensures you only pass valid action types
export type OtpType = 'REGISTER' | 'FORGOT_PASSWORD';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendOtp(email: string, otp: string, type: OtpType) {
    const fromEmail = process.env.EMAIL_FROM;

    if (!fromEmail) {
      throw new Error('EMAIL_FROM not configured');
    }

    console.log('Sending email to:', email);
    console.log('From:', fromEmail);

    const title =
      type === 'REGISTER' ? 'Verify Your Email' : 'Reset Your Password';
    const subtitle =
      type === 'REGISTER' ? 'Welcome to HireForFree' : 'Password Reset Request';
    const bodyText =
      type === 'REGISTER'
        ? 'Use the verification code below to verify your email address.'
        : 'Use the verification code below to reset your password.';

    const result = await this.resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `HireForFree - ${title}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background:#111827; color:white; padding:24px; text-align:center;">
            <h1 style="margin:0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">HireForFree</h1>
          </div>

          <div style="padding:32px; background: #ffffff; color: #1f2937;">
            <h2 style="margin-top: 0; font-size: 20px; color: #111827;">${subtitle}</h2>
            <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">${bodyText}</p>

            <div style="text-align:center; margin:32px 0;">
              <span style="
                display:inline-block;
                padding:16px 32px;
                font-size:32px;
                font-weight:bold;
                letter-spacing:8px;
                background:#f3f4f6;
                color:#111827; /* Explicit dark text for visibility */
                border-radius:10px;
              ">
                ${otp}
              </span>
            </div>

            <p style="font-size: 14px; color: #4b5563;">
              This code will expire in <strong>10 minutes</strong>.
            </p>
            <p style="font-size: 14px; color: #9ca3af; margin-bottom: 0;">
              If you did not request this, you can safely ignore this email.
            </p>
          </div>

          <div style="background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#6b7280; border-top: 1px solid #e5e7eb;">
            © 2026 HireForFree
          </div>
        </div>
      `,
    });

    console.log('RESEND RESPONSE:', result);
    return result;
  }
}
