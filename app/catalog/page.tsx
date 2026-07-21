"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Product, Category, Settings } from "@/lib/api-helper";

function CatalogContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: "919876543210",
    whatsappMessagePrefix: "Hi, I'm interested in the",
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [metalFilter, setMetalFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load category from query params if present
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategoryFilter(cat);
    }

    const openId = searchParams.get("open");
    if (openId && products.length > 0) {
      const prod = products.find((p) => p.id === openId);
      if (prod) {
        setSelectedProduct(prod);
      }
    }
  }, [searchParams, products]);

  // Fetch initial data (products, categories, settings)
  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes, setRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/settings"),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const setData = await setRes.json();

        if (prodData.success) {
          setProducts(prodData.products);
        }
        if (catData.success) {
          setCategories(catData.categories);
        }
        if (setData.success) {
          setSettings(setData.settings);
        }
      } catch (err) {
        console.error("Error fetching catalog data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.details.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const searchCat = categoryFilter.toLowerCase().replace(/-/g, " ");
    const prodCat = product.category.toLowerCase();
    const prodName = product.name.toLowerCase();

    const matchesCategory =
      categoryFilter === "All" ||
      prodCat === categoryFilter.toLowerCase() ||
      prodCat.includes(searchCat) ||
      searchCat.includes(prodCat) ||
      (searchCat.includes("earring") && (prodCat.includes("earring") || prodCat.includes("stud") || prodName.includes("earring"))) ||
      (searchCat.includes("ring") && (prodCat.includes("ring") || prodName.includes("ring"))) ||
      (searchCat.includes("bracelet") && (prodCat.includes("bracelet") || prodCat.includes("bangle") || prodName.includes("bracelet")));

    // Metal filter
    const matchesMetal =
      metalFilter === "All" || product.metal.toLowerCase().includes(metalFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesMetal;
  });

  const openProductDetails = (product: Product) => {
    router.push(`/catalog/${product.id}`);
  };

  const getWhatsAppLink = (product: Product) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const imageUrl = product.image
      ? product.image.startsWith("http")
        ? product.image
        : `${origin}${product.image}`
      : "";

    let text = `Hi, I'm interested in this jewelry design:\n\n*Design Name:* ${product.name}\n*Category:* ${product.category}`;

    if (imageUrl) {
      text += `\n*Design Photo:* ${imageUrl}`;
    }

    text += `\n\nPlease share wholesale rates and availability for this piece.`;

    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <Header />

      <main className="catalog-section">
        <div className="container">
          <div className="catalog-head">
            <span className="eyebrow">Discover Masterpieces</span>
            <h1 style={{ fontSize: "38px", color: "var(--gold-light)", marginBottom: "12px" }}>The Showroom Catalog</h1>
            <p style={{ color: "var(--text-muted)", maxWidth: "580px", margin: "0 auto" }}>
              Explore our current stock of certified gold and diamond designs. Visit one of our showrooms for customization and purchasing options.
            </p>
          </div>

          {/* Premium Luxury Filter Console */}
          <div className="luxury-filter-console">
            {/* Category Pills Bar */}
            <div className="category-pills-bar">
              <button
                onClick={() => setCategoryFilter("All")}
                className={`category-pill ${categoryFilter === "All" ? "active" : ""}`}
              >
                <span>All Ornaments</span>
                <small>({products.length})</small>
              </button>

              {categories.map((c) => {
                const count = products.filter(
                  (p) => p.category.toLowerCase() === c.slug.toLowerCase()
                ).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategoryFilter(c.slug)}
                    className={`category-pill ${categoryFilter.toLowerCase() === c.slug.toLowerCase() ? "active" : ""}`}
                  >
                    <span>{c.name}</span>
                    <small>({count})</small>
                  </button>
                );
              })}
            </div>

            {/* Filter Controls Row */}
            <div className="filter-controls-row">
              {/* Search Box with Label */}
              <div className="custom-input-wrapper">
                <label htmlFor="search-input">Search Catalog</label>
                <div className="filter-search-box">
                  <svg className="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, Polki, Kundan, Jhumka..."
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={() => setSearchQuery("")} title="Clear search">
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="custom-select-wrapper">
                <label htmlFor="category">Category</label>
                <select id="category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Metal Dropdown */}
              <div className="custom-select-wrapper">
                <label htmlFor="metal">Metal & Purity</label>
                <select id="metal" value={metalFilter} onChange={(e) => setMetalFilter(e.target.value)}>
                  <option value="All">All Metals</option>
                  <option value="Gold">22K Gold (BIS 916)</option>
                  <option value="White Gold">White Gold</option>
                  <option value="Rose Gold">Rose Gold</option>
                </select>
              </div>
            </div>

            {/* Active Filter Badges & Reset Bar */}
            {(categoryFilter !== "All" || metalFilter !== "All" || searchQuery) && (
              <div className="active-filters-bar">
                <div className="active-tags">
                  <span className="active-tags-label">Active Filters:</span>
                  {categoryFilter !== "All" && (
                    <span className="filter-tag" onClick={() => setCategoryFilter("All")}>
                      Category: {categoryFilter} ✕
                    </span>
                  )}
                  {metalFilter !== "All" && (
                    <span className="filter-tag" onClick={() => setMetalFilter("All")}>
                      Metal: {metalFilter} ✕
                    </span>
                  )}
                  {searchQuery && (
                    <span className="filter-tag" onClick={() => setSearchQuery("")}>
                      Search: "{searchQuery}" ✕
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setCategoryFilter("All");
                    setMetalFilter("All");
                    setSearchQuery("");
                  }}
                  className="reset-filters-btn"
                >
                  Reset All Filters ↺
                </button>
              </div>
            )}
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gold)" }}>
              <p style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}>Loading Masterpieces...</p>
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="feat-card" onClick={() => openProductDetails(product)} style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                    <div>
                      <div className="feat-image">
                        {product.image && !product.image.includes("placeholder") ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #171717, #0c0c0c)", color: "var(--gold)" }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                              <path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" fill="currentColor" opacity="0.1" />
                              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                            </svg>
                            <span style={{ fontSize: "10px", marginTop: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                              {product.metal}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="product-card-title" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {product.name}
                      </h3>
                      <p className="product-card-subtitle">
                        {product.metal || "22K Gold"}{product.purity ? ` · ${product.purity}` : ""}
                      </p>
                    </div>
                    
                    {/* Direct WhatsApp Inquiry Button */}
                    <div className="product-card-btn-wrap">
                      <a
                        href={getWhatsAppLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-gold"
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          fontSize: "11px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          fontWeight: 500,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: "middle" }}>
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.437.002 9.861-4.417 9.864-9.855.002-2.63-1.02-5.101-2.881-6.964C16.495 1.921 14.032.893 11.416.892 5.979.892 1.557 5.311 1.554 10.75c-.001 1.636.438 3.236 1.272 4.633L1.879 21.05l5.807-1.521c.005.003-.008-.005.361-.375z" />
                        </svg>
                        WhatsApp Inquiry
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <h3>No Designs Found</h3>
                  <p style={{ marginTop: "10px" }}>Try broadening your search terms or relaxing filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "var(--gold)" }}>
        <p style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}>Loading Catalog Context...</p>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
