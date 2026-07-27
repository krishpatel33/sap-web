import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const tmpFilePath = path.join("/tmp", "uploads", filename);

    try {
      const fileBuffer = await fs.readFile(tmpFilePath);

      // Determine content type based on extension
      const ext = path.extname(filename).toLowerCase();
      let contentType = "application/octet-stream";
      if (ext === ".jpg" || ext === ".jpeg") {
        contentType = "image/jpeg";
      } else if (ext === ".png") {
        contentType = "image/png";
      } else if (ext === ".gif") {
        contentType = "image/gif";
      } else if (ext === ".svg") {
        contentType = "image/svg+xml";
      } else if (ext === ".webp") {
        contentType = "image/webp";
      }

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return new NextResponse("File not found in /tmp storage", { status: 404 });
    }
  } catch (error) {
    console.error("Error serving temp upload:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
