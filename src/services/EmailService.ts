import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export interface InviteEmailData {
  recipientEmail: string;
  recipientName?: string;
  communityName: string;
  inviterName: string;
  role: string;
  plan: string;
  inviteLink: string;
}

export class EmailService {
  /**
   * Send a member invitation email
   */
  static async sendMemberInvite(data: InviteEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      if (!import.meta.env.VITE_RESEND_API_KEY) {
        console.warn('VITE_RESEND_API_KEY not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const { recipientEmail, communityName, inviterName, role, plan, inviteLink } = data;

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You're invited to join ${communityName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 40px 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 30px; }
            .invite-card { background-color: #f8fafc; border-radius: 12px; padding: 30px; margin: 30px 0; border-left: 4px solid #8b5cf6; }
            .role-badge { display: inline-block; background-color: #8b5cf6; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 10px 0; }
            .plan-badge { display: inline-block; background-color: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-left: 10px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 You're Invited!</h1>
            </div>
            
            <div class="content">
              <h2>Join ${communityName}</h2>
              <p>Hi there! 👋</p>
              <p><strong>${inviterName}</strong> has invited you to join <strong>${communityName}</strong> as a community member.</p>
              
              <div class="invite-card">
                <h3>Your Invitation Details</h3>
                <p><strong>Community:</strong> ${communityName}</p>
                <p><strong>Role:</strong> <span class="role-badge">${role}</span></p>
                <p><strong>Plan:</strong> <span class="plan-badge">${plan}</span></p>
                <p><strong>Invited by:</strong> ${inviterName}</p>
              </div>
              
              <p>Click the button below to accept your invitation and join the community:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteLink}" class="cta-button">Accept Invitation</a>
              </div>
              
              <p style="color: #64748b; font-size: 14px;">
                If the button doesn't work, you can copy and paste this link into your browser:<br>
                <a href="${inviteLink}" style="color: #8b5cf6;">${inviteLink}</a>
              </p>
              
              <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                This invitation was sent to ${recipientEmail}. If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${communityName}. All rights reserved.</p>
              <p>Powered by Nortech Community Hub</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const emailText = `
        You're invited to join ${communityName}!
        
        ${inviterName} has invited you to join ${communityName} as a ${role} with ${plan} plan.
        
        Click here to accept your invitation: ${inviteLink}
        
        If the link doesn't work, copy and paste it into your browser.
        
        This invitation was sent to ${recipientEmail}.
      `;

      const result = await resend.emails.send({
        from: `${communityName} <noreply@yourdomain.com>`, // You'll need to configure your domain
        to: [recipientEmail],
        subject: `You're invited to join ${communityName}`,
        html: emailHtml,
        text: emailText,
      });

      if (result.error) {
        console.error('Resend error:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log('Email sent successfully:', result.data);
      return { success: true };

    } catch (error) {
      console.error('Email service error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      };
    }
  }

  /**
   * Send a welcome email to new members
   */
  static async sendWelcomeEmail(data: {
    recipientEmail: string;
    recipientName: string;
    communityName: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      if (!import.meta.env.VITE_RESEND_API_KEY) {
        console.warn('VITE_RESEND_API_KEY not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const { recipientEmail, recipientName, communityName } = data;

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ${communityName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 40px 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 30px; }
            .welcome-card { background-color: #f8fafc; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to ${communityName}!</h1>
            </div>
            
            <div class="content">
              <h2>Hi ${recipientName}! 👋</h2>
              <p>Welcome to <strong>${communityName}</strong>! We're excited to have you as part of our community.</p>
              
              <div class="welcome-card">
                <h3>🚀 Get Started</h3>
                <p>Here are some things you can do to get the most out of your membership:</p>
                <ul style="text-align: left; display: inline-block;">
                  <li>Complete your profile</li>
                  <li>Explore the content library</li>
                  <li>Join discussions</li>
                  <li>Connect with other members</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${import.meta.env.VITE_APP_URL || window.location.origin}" class="cta-button">
                  Explore Community
                </a>
              </div>
              
              <p>If you have any questions, feel free to reach out to our community moderators.</p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${communityName}. All rights reserved.</p>
              <p>Powered by Nortech Community Hub</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await resend.emails.send({
        from: `${communityName} <noreply@yourdomain.com>`,
        to: [recipientEmail],
        subject: `Welcome to ${communityName}! 🎉`,
        html: emailHtml,
      });

      if (result.error) {
        console.error('Resend error:', result.error);
        return { success: false, error: result.error.message };
      }

      return { success: true };

    } catch (error) {
      console.error('Welcome email error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send welcome email' 
      };
    }
  }
} 