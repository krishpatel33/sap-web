import { NextResponse } from "next/server";
import { isAdminAuthenticated, setAdminSession, clearAdminSession } from "@/lib/api-helper";

// Credentials definition
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      await setAdminSession();
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

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
