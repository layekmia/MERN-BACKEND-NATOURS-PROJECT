const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

console.log(process.env.RESEND_API_KEY)

exports.sendEmail = async ({ email, subject, message }) => {
  try {
    const response = await resend.emails.send({
      from: "Natours <contact@nexotechit.com>",
      to: email,
      subject,
      html: `
  <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
    
    <!-- Container -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;margin:40px 0;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td style="background:#0f172a;padding:20px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:24px;">
                  🌍 Natours
                </h1>
                <p style="color:#cbd5f5;margin:5px 0 0;font-size:14px;">
                  Explore the world with unforgettable experiences
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                <h2 style="margin:0 0 15px;color:#111827;">
                  Reset Your Password
                </h2>

                <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                  We received a request to reset your password. Click the button below to set a new password.
                </p>

                <!-- Button -->
                <div style="text-align:center;margin:30px 0;">
                  <a href="${message}" 
                     style="background:#16a34a;color:#ffffff;padding:12px 25px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">
                     Reset Password
                  </a>
                </div>

                <p style="color:#6b7280;font-size:13px;">
                  This link will expire in <strong>10 minutes</strong>. If you didn’t request this, you can safely ignore this email.
                </p>

                <hr style="border:none;border-top:1px solid #e5e7eb;margin:25px 0;" />

                <p style="color:#9ca3af;font-size:12px;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all;color:#2563eb;font-size:12px;">
                  ${message}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:20px;text-align:center;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">
                  © ${new Date().getFullYear()} Natours. All rights reserved.
                </p>
                <p style="margin:5px 0 0;color:#9ca3af;font-size:12px;">
                  Made with ❤️ for travelers
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
`,
    });

    return response;
  } catch (error) {
    console.log(error)
  }
};
