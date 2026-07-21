import { NextResponse } from "next/server";
import { getProducts, saveProducts, isAdminAuthenticated, Product } from "@/lib/api-helper";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load products" },
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
    const { name, price, description, category, metal, details, weight, purity, image } = body;

    // Validation: Require only name and category
    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: "Please fill in required fields (Name, Category)" },
        { status: 400 }
      );
    }

    const products = await getProducts();

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name,
      price: price ? Number(price) : 0,
      description: description || "",
      category,
      metal: metal || "22K Gold (BIS 916)",
      details: details || "",
      weight: weight || "N/A",
      purity: purity || "BIS 916 Hallmark",
      image: image || "/images/placeholder.webp", // Default fallback
    };

    products.push(newProduct);
    const saved = await saveProducts(products);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to write database file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
