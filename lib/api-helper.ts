import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");
const BOOKINGS_FILE = path.join(process.cwd(), "data", "bookings.json");
const CATEGORIES_FILE = path.join(process.cwd(), "data", "categories.json");
const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

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

// Product DB Operations
export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products database:", error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing products database:", error);
    return false;
  }
}

// Category DB Operations
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fs.readFile(CATEGORIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading categories database:", error);
    return [];
  }
}

export async function saveCategories(categories: Category[]): Promise<boolean> {
  try {
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing categories database:", error);
    return false;
  }
}

// Settings DB Operations
export async function getSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading settings database, falling back to default:", error);
    return {
      whatsappNumber: "919876543210",
      whatsappMessagePrefix: "Hi, I'm interested in the",
    };
  }
}

export async function saveSettings(settings: Settings): Promise<boolean> {
  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing settings database:", error);
    return false;
  }
}

// Booking DB Operations
export async function getBookings(): Promise<Booking[]> {
  try {
    const data = await fs.readFile(BOOKINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading bookings database:", error);
    return [];
  }
}

export async function saveBookings(bookings: Booking[]): Promise<boolean> {
  try {
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing bookings database:", error);
    return false;
  }
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
