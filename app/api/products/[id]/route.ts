import { NextResponse } from "next/server";
import { getProducts, saveProducts, isAdminAuthenticated, Product } from "@/lib/api-helper";

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
    const { name, price, description, category, metal, details, weight, purity, image } = body;

    const products = await getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Update product
    products[index] = {
      ...products[index],
      name: name ?? products[index].name,
      price: price !== undefined ? Number(price) : products[index].price,
      description: description ?? products[index].description,
      category: category ?? products[index].category,
      metal: metal ?? products[index].metal,
      details: details ?? products[index].details,
      weight: weight ?? products[index].weight,
      purity: purity ?? products[index].purity,
      image: image ?? products[index].image,
    };

    const saved = await saveProducts(products);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to write database file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product: products[index] });
  } catch (error) {
    console.error("Products PUT error:", error);
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
    const products = await getProducts();
    const updatedProducts = products.filter((p) => p.id !== id);

    if (products.length === updatedProducts.length) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const saved = await saveProducts(updatedProducts);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to write database file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
