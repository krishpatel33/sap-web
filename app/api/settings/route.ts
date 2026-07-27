import { NextResponse } from "next/server";
import { getSettings, saveSettings, isAdminAuthenticated } from "@/lib/api-helper";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      whatsappNumber, 
      whatsappMessagePrefix,
      enableEmailAlerts,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      smtpToEmail
    } = body;

    if (!whatsappNumber) {
      return NextResponse.json(
        { success: false, error: "WhatsApp Number is required." },
        { status: 400 }
      );
    }

    if (enableEmailAlerts) {
      if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpToEmail) {
        return NextResponse.json(
          { success: false, error: "All SMTP settings are required when email alerts are enabled." },
          { status: 400 }
        );
      }
    }

    const updatedSettings = {
      whatsappNumber,
      whatsappMessagePrefix: whatsappMessagePrefix || "",
      enableEmailAlerts: !!enableEmailAlerts,
      smtpHost: smtpHost || "",
      smtpPort: smtpPort || "",
      smtpUser: smtpUser || "",
      smtpPass: smtpPass || "",
      smtpToEmail: smtpToEmail || "",
    };

    const saved = await saveSettings(updatedSettings);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to write settings file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
