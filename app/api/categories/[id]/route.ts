import { NextResponse } from "next/server";
import { getCategories, saveCategories, getProducts, isAdminAuthenticated, Category } from "@/lib/api-helper";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, image, description } = body;

    const categories = await getCategories();
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // If changing slug, check if new slug is already taken by another category
    if (slug && slug !== categories[index].slug) {
      if (categories.some((c) => c.id !== id && c.slug.toLowerCase() === slug.toLowerCase())) {
        return NextResponse.json(
          { success: false, error: `Category with slug "${slug}" already exists.` },
          { status: 400 }
        );
      }
    }

    // Update category
    categories[index] = {
      ...categories[index],
      name: name ?? categories[index].name,
      slug: slug ?? categories[index].slug,
      image: image ?? categories[index].image,
      description: description ?? categories[index].description,
    };

    const saved = await saveCategories(categories);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to write database file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, category: categories[index] });
  } catch (error) {
    console.error("Categories PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const categories = await getCategories();
    const categoryToDelete = categories.find((c) => c.id === id);

    if (!categoryToDelete) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if there are products belonging to this category
    const products = await getProducts();
    const hasProducts = products.some(
      (p) => p.category.toLowerCase() === categoryToDelete.slug.toLowerCase()
    );

    if (hasProducts) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category "${categoryToDelete.name}" because it contains active products. Please reassign or delete the products first.`,
        },
        { status: 400 }
      );
    }

    const updatedCategories = categories.filter((c) => c.id !== id);
    const saved = await saveCategories(updatedCategories);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to write database file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Categories DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
