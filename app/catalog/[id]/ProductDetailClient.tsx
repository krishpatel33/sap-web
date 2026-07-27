"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Product, Category, Settings } from "@/lib/api-helper";

interface ProductDetailClientProps {
  product: Product;
  allProducts: Product[];
  categories: Category[];
  settings: Settings;
  baseUrl: string;
}

export default function ProductDetailClient({
  product,
  allProducts,
  categories,
  settings,
  baseUrl,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [imageZoom, setImageZoom] = useState(false);

  // Get Category Details
  const categoryObj = categories.find(
    (c) => c.slug.toLowerCase() === product.category.toLowerCase()
  );
  const categoryName = categoryObj ? categoryObj.name : product.category;

  // Related products from same category
  const relatedProducts = allProducts
    .filter((p) => p.category.toLowerCase() === product.category.toLowerCase() && p.id !== product.id)
    .slice(0, 4);

  // Generate WhatsApp inquiry link with full specifications
  const getWhatsAppLink = () => {
    const imageUrl = product.image
      ? product.image.startsWith("http")
        ? product.image
        : `${baseUrl}${product.image}`
      : "";

    let text = `Hi, I'm interested in this gold ornament design from SAP Gold Ornaments:\n\n`;
    text += `*Design Name:* ${product.name}\n`;
    text += `*Category:* ${categoryName}\n`;
    text += `*Metal Purity:* ${product.purity || "Yellow Gold BIS 916"}\n`;
    text += `*Approx. Weight:* ${product.weight || "Standard Weight"}\n`;
    if (product.details) {
      text += `*Karigari Details:* ${product.details}\n`;
    }
    if (imageUrl) {
      text += `*Design Image:* ${imageUrl}\n`;
    }
    text += `\nPlease share current wholesale rates, availability, and ordering details.`;

    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <Header />

      <main className="product-detail-page" style={{ background: "var(--ivory, #0a0a0a)", minHeight: "100vh", padding: "40px 0 80px 0" }}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <nav className="product-breadcrumb" style={{ marginBottom: "32px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--gold-light)", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <Link href="/catalog" style={{ color: "var(--gold-light)", textDecoration: "none" }}>Catalog</Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <Link href={`/catalog?category=${encodeURIComponent(product.category)}`} style={{ color: "var(--gold-light)", textDecoration: "none" }}>{categoryName}</Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <span style={{ color: "#ece0c8", fontWeight: 500 }}>{product.name}</span>
          </nav>

          {/* Back Button Bar */}
          <div style={{ marginBottom: "28px" }}>
            <button
              onClick={() => router.back()}
              style={{
                background: "transparent",
                border: "1px solid rgba(200, 153, 46, 0.35)",
                color: "var(--gold-light)",
                padding: "8px 18px",
                borderRadius: "6px",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.25s ease",
              }}
            >
              ← Back to Results
            </button>
          </div>

          {/* Two-Column Product Showcase Section */}
          <div className="product-showcase-grid">
            {/* Left Column — Image Frame Showcase */}
            <div className="product-image-container" style={{ display: "flex", flexDirection: "column", gap: "16px", padding: 0 }}>
              <div
                className="product-image-frame"
                onClick={() => setImageZoom(!imageZoom)}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4/5",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(200, 153, 46, 0.4)",
                  background: "#0a0907",
                  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.7)",
                  margin: 0,
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                {product.image && !product.image.includes("placeholder") ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: imageZoom ? "contain" : "cover",
                      display: "block",
                      borderRadius: "12px",
                      margin: 0,
                      padding: 0,
                      transition: "all 0.3s ease",
                      transform: imageZoom ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" fill="currentColor" opacity="0.1" />
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                    </svg>
                    <span style={{ fontSize: "11px", marginTop: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                      {product.metal || "Yellow Gold"}
                    </span>
                  </div>
                )}

                {/* BIS 916 Hallmark Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    background: "rgba(10, 9, 7, 0.85)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(200, 153, 46, 0.5)",
                    color: "var(--gold-light)",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ color: "var(--gold)" }}>✦</span> HUID Certified
                </div>
              </div>

              <span className="zoom-tip-text" style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", letterSpacing: "0.08em" }}>
                🔍 Click image to toggle high-res detail zoom
              </span>
            </div>

            {/* Right Column — Product Details & Specifications */}
            <div className="product-details-content" style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              {/* Category Tag */}
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    fontWeight: 500,
                    display: "inline-block",
                    marginBottom: "6px",
                  }}
                >
                  {categoryName} Collection
                </span>
                <h1
                  style={{
                    fontSize: "36px",
                    color: "#ffffff",
                    fontFamily: "var(--font-cormorant), serif",
                    fontWeight: 600,
                    lineHeight: 1.15,
                  }}
                >
                  {product.name}
                </h1>
              </div>

              {/* Professional Luxury Specification Tags */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 16px",
                    background: "linear-gradient(135deg, rgba(200, 153, 46, 0.12) 0%, rgba(10, 9, 7, 0.9) 100%)",
                    border: "1px solid rgba(200, 153, 46, 0.38)",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <span style={{ color: "var(--gold, #c8992e)", fontSize: "10px" }}>◆</span>
                  <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-light, #e9caa0)", fontWeight: 600 }}>
                    PURITY: <span style={{ color: "#ffffff", fontWeight: 500 }}>{product.purity || "HUID"}</span>
                  </span>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 16px",
                    background: "linear-gradient(135deg, rgba(200, 153, 46, 0.12) 0%, rgba(10, 9, 7, 0.9) 100%)",
                    border: "1px solid rgba(200, 153, 46, 0.38)",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <span style={{ color: "var(--gold, #c8992e)", fontSize: "10px" }}>◆</span>
                  <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-light, #e9caa0)", fontWeight: 600 }}>
                    METAL: <span style={{ color: "#ffffff", fontWeight: 500 }}>{product.metal || "YELLOW GOLD"}</span>
                  </span>
                </div>

                {product.weight && product.weight !== "N/A" && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "7px 16px",
                      background: "linear-gradient(135deg, rgba(200, 153, 46, 0.12) 0%, rgba(10, 9, 7, 0.9) 100%)",
                      border: "1px solid rgba(200, 153, 46, 0.38)",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    <span style={{ color: "var(--gold, #c8992e)", fontSize: "10px" }}>◆</span>
                    <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-light, #e9caa0)", fontWeight: 600 }}>
                      WEIGHT: <span style={{ color: "#ffffff", fontWeight: 500 }}>{product.weight}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div style={{ borderTop: "1px solid rgba(200, 153, 46, 0.2)", paddingTop: "18px" }}>
                <h4 style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-light)", marginBottom: "8px" }}>
                  Design Craftsmanship & Story
                </h4>
                <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: "1.75" }}>
                  {product.description ||
                    `Exquisitely handcrafted by master karigars of Manek Chowk, Ahmedabad. This ${product.name} represents timeless Indian heritage blended with precision BIS 916 gold purity, curated specifically for wholesale showrooms and retail boutiques.`}
                </p>
              </div>

              {/* Wholesale Specifications Table */}
              <div className="product-specs-table">
                <div>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", display: "block" }}>
                    Item Reference Code
                  </span>
                  <strong style={{ fontSize: "14px", color: "var(--gold-light, #ffe699)", fontWeight: 600, letterSpacing: "0.05em" }}>
                    {`#SAP-${product.id.replace(/[^0-9]/g, "").slice(-4) || "101"}`}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", display: "block" }}>
                    Metal Type & Purity
                  </span>
                  <strong style={{ fontSize: "13.5px", color: "var(--gold-pale)", fontWeight: 500 }}>{product.metal} ({product.purity})</strong>
                </div>

                <div>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", display: "block" }}>
                    Approx. Weight
                  </span>
                  <strong style={{ fontSize: "13.5px", color: "var(--gold-pale)", fontWeight: 500 }}>{product.weight || "Available on request"}</strong>
                </div>

                <div>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", display: "block" }}>
                    Stone & Karigari Details
                  </span>
                  <strong style={{ fontSize: "13.5px", color: "var(--gold-pale)", fontWeight: 500 }}>{product.details || "Solid Gold Handcrafted Work"}</strong>
                </div>

                <div>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", display: "block" }}>
                    Category
                  </span>
                  <strong style={{ fontSize: "13.5px", color: "var(--gold-pale)", fontWeight: 500 }}>{categoryName}</strong>
                </div>

                <div>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", display: "block" }}>
                    Hub Stock Availability
                  </span>
                  <strong style={{ fontSize: "13.5px", color: "#28a745", fontWeight: 500 }}>Direct Manek Chowk Stock</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                  style={{
                    padding: "14px 24px",
                    fontSize: "13px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    fontWeight: 600,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.437.002 9.861-4.417 9.864-9.855.002-2.63-1.02-5.101-2.881-6.964C16.495 1.921 14.032.893 11.416.892 5.979.892 1.557 5.311 1.554 10.75c-.001 1.636.438 3.236 1.272 4.633L1.879 21.05l5.807-1.521c.005.003-.008-.005.361-.375z" />
                  </svg>
                  Inquire Wholesale Rates on WhatsApp
                </a>

                <Link
                  href="/#contact"
                  className="btn btn-outline"
                  style={{
                    padding: "14px 24px",
                    fontSize: "12.5px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  Book Private Showroom Viewing
                </Link>
              </div>

              {/* Wholesale Guarantees Banner */}
              <div className="product-guarantees-banner">
                <span>🛡️ 100% HUID Certified</span>
                <span>⚖️ Certified Net Weight</span>
                <span>📦 Direct Wholesale Rates</span>
              </div>
            </div>
          </div>

          {/* Related Ornaments Section */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: "70px" }}>
              <div style={{ marginBottom: "24px" }}>
                <span className="eyebrow">Curated Selection</span>
                <h3 style={{ fontSize: "28px", color: "var(--gold-light)" }}>More Ornaments in {categoryName}</h3>
              </div>

              <div className="catalog-grid">
                {relatedProducts.map((relProd) => (
                  <Link
                    key={relProd.id}
                    href={`/catalog/${relProd.id}`}
                    className="feat-card"
                    style={{ textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                  >
                    <div>
                      <div className="feat-image">
                        {relProd.image && !relProd.image.includes("placeholder") ? (
                          <img src={relProd.image} alt={relProd.name} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "var(--gold)" }}>
                            <span style={{ fontSize: "11px", letterSpacing: "0.1em" }}>{relProd.metal}</span>
                          </div>
                        )}
                      </div>
                      <h4 style={{ fontSize: "17px", color: "#fff", marginBottom: "6px" }}>{relProd.name}</h4>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                        {relProd.metal} · {relProd.purity}
                      </p>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
                      View Details →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
