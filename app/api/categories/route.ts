import { NextResponse } from "next/server";
import { getCategories, saveCategories, isAdminAuthenticated, Category } from "@/lib/api-helper";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, slug, image, description } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Slug)" },
        { status: 400 }
      );
    }

    const categories = await getCategories();

    // Check if slug already exists
    if (categories.some((c) => c.slug.toLowerCase() === slug.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: `Category with slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      image: image || "/images/placeholder.webp",
      description: description || "",
    };

    categories.push(newCategory);
    const saved = await saveCategories(categories);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to write database file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
