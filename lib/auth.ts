import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "number",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      try {
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@naim.com>',
          to: user.email,
          subject: "Verify your email address",
          text: `
Hello ${user.name ?? "there"},

Thanks for signing up for Prisma Blog!

Please verify your email address by clicking the link below:
${verifyUrl}

If you didn’t create an account, you can safely ignore this email.

— Prisma Blog Team
      `,
          html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f7fb; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#111827; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0;">Prisma Blog</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333;">
                <h2 style="margin-top:0;">Verify your email address</h2>
                <p>Hi ${user.name ?? "there"},</p>
                <p>
                  Thanks for signing up for <strong>Prisma Blog</strong>.
                  Please confirm your email address by clicking the button below.
                </p>

                <div style="text-align:center; margin:30px 0;">
                  <a
                    href="${verifyUrl}"
                    style="
                      background:#4f46e5;
                      color:#ffffff;
                      padding:12px 24px;
                      text-decoration:none;
                      border-radius:6px;
                      display:inline-block;
                      font-weight:bold;
                    "
                  >
                    Verify Email
                  </a>
                </div>

                <p>
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>
                <p style="word-break:break-all; color:#4f46e5;">
                  ${verifyUrl}
                </p>

                <p style="margin-top:30px;">
                  If you didn’t create an account, you can safely ignore this email.
                </p>

                <p>
                  Thanks,<br />
                  <strong>Prisma Blog Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#666;">
                © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
        });
        console.log("Verification email sent:", info.messageId);
      } catch (err) {
        console.log(err);
      }
    },
  },
});

export default auth;
