import { NextResponse } from "next/server";
import { isAdminAuthenticated, setAdminSession, clearAdminSession } from "@/lib/api-helper";
import nodemailer from "nodemailer";

async function sendLoginAlertEmail(username: string) {
  try {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.SMTP_TO_EMAIL;

    // Check if configuration exists
    if (!host || !port || !user || !pass || !to) {
      console.warn("SMTP credentials or recipient email is missing in environment variables. Skipped sending login alert.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: port === "465", // true for port 465, false for port 587 or others
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"SAP Gold Admin Alert" <${user}>`,
      to,
      subject: "⚠️ Admin Login Alert - SAP Gold Ornaments",
      text: `Hello,\n\nA new login attempt succeeded for the admin account "${username}" on ${new Date().toLocaleString()}.\n\nIf this was not you, please change your credentials immediately.\n\nRegards,\nSAP Gold Security`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0c0c0c; color: #ece0c8; padding: 30px; border: 1px solid #c8992e; max-width: 500px; border-radius: 8px;">
          <h2 style="color: #c8992e; border-bottom: 1px solid rgba(200, 153, 46, 0.28); padding-bottom: 10px; margin-top: 0;">⚠️ Admin Login Notification</h2>
          <p style="font-size: 15px; line-height: 1.6;">A successful login was registered for the administrator account.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: rgba(236, 224, 200, 0.62); width: 100px;">Username:</td>
              <td style="padding: 6px 0; color: #f0e2c4;">${username}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: rgba(236, 224, 200, 0.62);">Time:</td>
              <td style="padding: 6px 0; color: #f0e2c4;">${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} IST</td>
            </tr>
          </table>
          <p style="font-size: 13px; color: #ff8080; margin-top: 20px; line-height: 1.5; border-top: 1px dashed rgba(200, 153, 46, 0.15); padding-top: 15px;">If this login was unauthorized, please change your administrator credentials in your environment configuration immediately.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Login notification email sent to", to);
  } catch (error) {
    console.error("Error sending login alert email:", error);
  }
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      await setAdminSession();
      // Send login notification email asynchronously
      sendLoginAlertEmail(username);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return NextResponse.json(
    { success: false, error: "Admin credentials are managed via environment variables and cannot be updated at runtime." },
    { status: 400 }
  );
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
