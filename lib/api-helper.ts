import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";

const PRODUCTS_FILE = "./data/products.json";
const BOOKINGS_FILE = "./data/bookings.json";
const CATEGORIES_FILE = "./data/categories.json";
const SETTINGS_FILE = "./data/settings.json";

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  metal: string;
  details: string;
  weight: string;
  purity: string;
  image: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  type: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface Settings {
  whatsappNumber: string;
  whatsappMessagePrefix: string;
}

const isProd = process.env.NODE_ENV === "production";

// GitHub commit helper using native fetch
export async function commitToGithub(
  pathInRepo: string,
  content: string | Buffer,
  commitMessage: string
): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g. "owner/repo"
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) {
    console.warn("GITHUB_TOKEN or GITHUB_REPO not configured. Skipping GitHub commit.");
    return false;
  }

  // Normalize path (GitHub expects forward slashes)
  const normalizedPath = pathInRepo.replace(/\\/g, "/");

  try {
    // 1. Fetch file's current SHA if it exists (required to update existing files in GitHub)
    const getUrl = `https://api.github.com/repos/${repo}/contents/${normalizedPath}?ref=${branch}`;
    const getRes = await fetch(getUrl, {
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "NextJS-App",
      },
    });

    let sha: string | undefined;
    if (getRes.ok) {
      const data = await getRes.json();
      if (data && typeof data === "object" && "sha" in data) {
        sha = data.sha as string;
      }
    }

    // 2. Base64 encode content
    let base64Content: string;
    if (Buffer.isBuffer(content)) {
      base64Content = content.toString("base64");
    } else {
      base64Content = Buffer.from(content, "utf-8").toString("base64");
    }

    // 3. Commit back to GitHub
    const putUrl = `https://api.github.com/repos/${repo}/contents/${normalizedPath}`;
    const putRes = await fetch(putUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "NextJS-App",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        branch,
        sha,
      }),
    });

    if (!putRes.ok) {
      const errorText = await putRes.text();
      console.error(`Failed to commit to GitHub: ${putRes.status} ${putRes.statusText}`, errorText);
      return false;
    }

    console.log(`Successfully committed ${normalizedPath} to GitHub`);
    return true;
  } catch (error) {
    console.error(`Error in commitToGithub for ${normalizedPath}:`, error);
    return false;
  }
}

// Helpers for read/write paths in production (/tmp)
async function getReadPath(originalPath: string): Promise<string> {
  if (isProd) {
    const filename = path.basename(originalPath);
    const tmpPath = path.join("/tmp", "data", filename);
    try {
      await fs.access(tmpPath);
      return tmpPath;
    } catch {
      return originalPath;
    }
  }
  return originalPath;
}

async function getWritePath(originalPath: string): Promise<string> {
  if (isProd) {
    const filename = path.basename(originalPath);
    const tmpDir = path.join("/tmp", "data");
    await fs.mkdir(tmpDir, { recursive: true });
    return path.join(tmpDir, filename);
  }
  return originalPath;
}

async function readDataFile<T>(originalPath: string, fallback: T): Promise<T> {
  try {
    const readPath = await getReadPath(originalPath);
    const data = await fs.readFile(readPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading database file ${originalPath}:`, error);
    return fallback;
  }
}

async function saveDataFile(originalPath: string, data: unknown, commitMessage: string): Promise<boolean> {
  try {
    const content = JSON.stringify(data, null, 2);
    
    // Write locally (or to /tmp if in prod)
    if (isProd) {
      const writePath = await getWritePath(originalPath);
      await fs.writeFile(writePath, content, "utf-8");
    } else {
      await fs.writeFile(originalPath, content, "utf-8");
    }

    // Push to GitHub if GITHUB_TOKEN is configured
    const repoPath = originalPath.replace(/^\.\//, "").replace(/\\/g, "/");
    await commitToGithub(repoPath, content, commitMessage);

    return true;
  } catch (error) {
    console.error(`Error writing database file ${originalPath}:`, error);
    return false;
  }
}

// Product DB Operations
export async function getProducts(): Promise<Product[]> {
  return readDataFile<Product[]>(PRODUCTS_FILE, []);
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  return saveDataFile(PRODUCTS_FILE, products, "Update products database");
}

// Category DB Operations
export async function getCategories(): Promise<Category[]> {
  return readDataFile<Category[]>(CATEGORIES_FILE, []);
}

export async function saveCategories(categories: Category[]): Promise<boolean> {
  return saveDataFile(CATEGORIES_FILE, categories, "Update categories database");
}

// Settings DB Operations
export async function getSettings(): Promise<Settings> {
  const defaultSettings: Settings = {
    whatsappNumber: "919876543210",
    whatsappMessagePrefix: "Hi, I'm interested in the",
  };
  return readDataFile<Settings>(SETTINGS_FILE, defaultSettings);
}

export async function saveSettings(settings: Settings): Promise<boolean> {
  return saveDataFile(SETTINGS_FILE, settings, "Update settings database");
}

// Booking DB Operations
export async function getBookings(): Promise<Booking[]> {
  return readDataFile<Booking[]>(BOOKINGS_FILE, []);
}

export async function saveBookings(bookings: Booking[]): Promise<boolean> {
  return saveDataFile(BOOKINGS_FILE, bookings, "Update bookings database");
}

// Simple Admin Authentication Helpers
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("suvarna_session");
  // Simple validation: the session is checked against a static token
  return sessionCookie?.value === "suvarna_authorized_admin_token";
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "suvarna_session",
    value: "suvarna_authorized_admin_token",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("suvarna_session");
}


