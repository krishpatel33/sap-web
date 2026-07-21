import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/api-helper";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    // Check authentication
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save folder path
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique file name
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${timestamp}_${cleanFileName}`;
    const filePath = path.join(uploadDir, filename);

    // Write file
    await fs.writeFile(filePath, buffer);
    console.log(`Uploaded file saved to ${filePath}`);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during file upload" },
      { status: 500 }
    );
  }
}
