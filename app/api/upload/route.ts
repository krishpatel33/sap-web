import { NextResponse } from "next/server";
import { isAdminAuthenticated, commitToGithub } from "@/lib/api-helper";
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

    // Generate unique file name
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${timestamp}_${cleanFileName}`;

    const isProd = process.env.NODE_ENV === "production";

    if (isProd) {
      // On Vercel, write to /tmp/uploads so we can serve it immediately before GitHub redeploy
      const tmpDir = path.join("/tmp", "uploads");
      await fs.mkdir(tmpDir, { recursive: true });
      const tmpFilePath = path.join(tmpDir, filename);
      await fs.writeFile(tmpFilePath, buffer);
      console.log(`Uploaded file saved to temporary path ${tmpFilePath}`);
    } else {
      // Local development
      const uploadDir = "./public/uploads";
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      console.log(`Uploaded file saved to local public path ${filePath}`);
    }

    // Push the file to GitHub repository
    const githubPath = `public/uploads/${filename}`;
    await commitToGithub(githubPath, buffer, `Upload image: ${filename}`);

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
