import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import ProductDetailClient from "./ProductDetailClient";
import { getProducts, getCategories, getSettings } from "@/lib/api-helper";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Ornament Not Found — SAP Gold Ornaments",
      description: "The requested gold ornament design was not found in our showroom catalog.",
    };
  }

  // Determine host dynamically for Open Graph absolute image URLs
  const headersList = await headers();
  const host = headersList.get("host") || "sap-web.vercel.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${baseUrl}${product.image}`
    : `${baseUrl}/logo.jpg`;

  const descriptionText = product.description || 
    `Exquisitely handcrafted gold ornament. Purity: ${product.purity || 'HUID'}, Metal: ${product.metal || 'Yellow Gold'}, Weight: ${product.weight || 'Standard'}.`;

  return {
    title: `${product.name} — SAP Gold Ornaments`,
    description: descriptionText,
    openGraph: {
      title: `${product.name} — SAP Gold Ornaments`,
      description: descriptionText,
      url: `${baseUrl}/catalog/${product.id}`,
      siteName: "SAP Gold Ornaments",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — SAP Gold Ornaments`,
      description: descriptionText,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  // Fetch databases directly on the server
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
  ]);

  const product = products.find((p) => p.id === id);

  // Get absolute base URL dynamically for WhatsApp image URL sharing
  const headersList = await headers();
  const host = headersList.get("host") || "sap-web.vercel.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "65vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#ece0c8", textAlign: "center", padding: "40px 20px" }}>
          <h2 style={{ fontSize: "32px", color: "var(--gold-light)", marginBottom: "14px" }}>Ornament Not Found</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px", maxWidth: "450px" }}>
            The requested gold ornament design may have been updated or moved to our Manek Chowk archives.
          </p>
          <Link href="/catalog" className="btn btn-gold" style={{ padding: "12px 24px" }}>
            ← Back To Showroom Catalog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <ProductDetailClient
      product={product}
      allProducts={products}
      categories={categories}
      settings={settings}
      baseUrl={baseUrl}
    />
  );
}
