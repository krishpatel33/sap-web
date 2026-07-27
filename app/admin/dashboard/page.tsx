"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product, Booking, Category, Settings } from "@/lib/api-helper";

export default function AdminDashboard() {
  const router = useRouter();
  
  // Auth and loading states
  const [authChecked, setAuthChecked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: "919876543210",
    whatsappMessagePrefix: "Hi, I'm interested in the",
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "bookings" | "settings">("products");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Product modal and form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    metal: "Yellow Gold",
    details: "",
    weight: "",
    purity: "HUID",
    image: "",
  });

  // Category modal and form states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState("");

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
  });

  // Settings form states
  const [settingsFormError, setSettingsFormError] = useState("");
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState("");



  // Check auth session
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth");
        const data = await response.json();
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setAuthChecked(true);
          // Fetch initial dashboard data
          fetchDashboardData();
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, bookRes, catRes, setRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/bookings"),
        fetch("/api/categories"),
        fetch("/api/settings"),
      ]);

      const prodData = await prodRes.json();
      const bookData = await bookRes.json();
      const catData = await catRes.json();
      const setData = await setRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (bookData.success) setBookings(bookData.bookings);
      if (catData.success) setCategories(catData.categories);
      if (setData.success) setSettings(setData.settings);
      
      // Initialize product category selection to first category if available
      if (catData.success && catData.categories.length > 0 && !productForm.category) {
        setProductForm(prev => ({ ...prev, category: catData.categories[0].slug }));
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Image Upload handler for Products
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setProductForm((prev) => ({ ...prev, image: data.url }));
      } else {
        setFormError(data.error || "File upload failed.");
      }
    } catch (err) {
      console.error("Image upload request error:", err);
      setFormError("Network error uploading file.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Image Upload handler for Categories
  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCategoryImage(true);
    setCategoryFormError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setCategoryForm((prev) => ({ ...prev, image: data.url }));
      } else {
        setCategoryFormError(data.error || "File upload failed.");
      }
    } catch (err) {
      console.error("Category image upload request error:", err);
      setCategoryFormError("Network error uploading file.");
    } finally {
      setUploadingCategoryImage(false);
    }
  };

  // Product Form Input Handler
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // Category Form Input Handler
  const handleCategoryFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Settings Form Input Handler
  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSettingsSuccessMessage("");
  };

  // Product CRUD Handlers
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId("");
    setProductForm({
      name: "",
      price: 0,
      description: "",
      category: productCategoryFilter !== "All" ? productCategoryFilter : (categories[0]?.slug || "Bridal"),
      metal: "Yellow Gold",
      details: "",
      weight: "",
      purity: "HUID",
      image: "",
    });
    setFormError("");
    setShowProductModal(true);
  };

  const handleOpenAddModalForCategory = (categorySlug: string) => {
    setIsEditing(false);
    setEditingId("");
    setProductForm({
      name: "",
      price: 0,
      description: "",
      category: categorySlug,
      metal: "Yellow Gold",
      details: "",
      weight: "",
      purity: "HUID",
      image: "",
    });
    setFormError("");
    setShowProductModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      category: product.category,
      metal: product.metal,
      details: product.details || "",
      weight: product.weight || "",
      purity: product.purity,
      image: product.image || "",
    });
    setFormError("");
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!productForm.name || !productForm.category) {
      setFormError("Please enter a valid Name and Category.");
      return;
    }

    const url = isEditing ? `/api/products/${editingId}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });

      const data = await response.json();
      if (data.success) {
        setShowProductModal(false);
        fetchDashboardData(); // Refresh list
      } else {
        setFormError(data.error || "Failed to save product.");
      }
    } catch (err) {
      console.error("Product submit error:", err);
      setFormError("Network error saving product.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        fetchDashboardData(); // Refresh list
      } else {
        alert(data.error || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete product error:", err);
      alert("Network error deleting product.");
    }
  };

  // Reordering Logic
  const startReordering = () => {
    setOriginalProducts([...products]);
    setIsReorderMode(true);
  };

  const cancelReordering = () => {
    setProducts(originalProducts);
    setIsReorderMode(false);
  };

  const saveReordering = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      const data = await response.json();
      if (data.success) {
        setIsReorderMode(false);
        fetchDashboardData();
      } else {
        alert(data.error || "Failed to save product ordering.");
      }
    } catch (err) {
      console.error("Save reordering request error:", err);
      alert("Network error saving product order.");
    } finally {
      setLoading(false);
    }
  };

  const moveProduct = (index: number, direction: "left" | "right" | "up" | "down") => {
    const visibleProducts = [...filteredProducts];
    let targetIndex = index;
    if (direction === "left") targetIndex = index - 1;
    else if (direction === "right") targetIndex = index + 1;
    else if (direction === "up") targetIndex = index - 3;
    else if (direction === "down") targetIndex = index + 3;

    if (targetIndex < 0 || targetIndex >= visibleProducts.length) return;

    // Swap in the visible array
    const temp = visibleProducts[index];
    visibleProducts[index] = visibleProducts[targetIndex];
    visibleProducts[targetIndex] = temp;

    // Reconstruct the main products list preserving order of other categories
    let visiblePointer = 0;
    const newProducts = products.map((p) => {
      const matchesFilter = productCategoryFilter === "All" || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
      if (matchesFilter) {
        return visibleProducts[visiblePointer++];
      }
      return p;
    });

    setProducts(newProducts);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isReorderMode) return;
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!isReorderMode) return;
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!isReorderMode) return;
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
      setDraggedItemIndex(null);
      setDragOverIndex(null);
      return;
    }

    const visibleProducts = [...filteredProducts];
    const [draggedProduct] = visibleProducts.splice(draggedItemIndex, 1);
    visibleProducts.splice(dropIndex, 0, draggedProduct);

    let visiblePointer = 0;
    const newProducts = products.map((p) => {
      const matchesFilter = productCategoryFilter === "All" || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
      if (matchesFilter) {
        return visibleProducts[visiblePointer++];
      }
      return p;
    });

    setProducts(newProducts);
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  // Category CRUD Handlers
  const handleOpenAddCategoryModal = () => {
    setIsEditingCategory(false);
    setEditingCategoryId("");
    setCategoryForm({
      name: "",
      slug: "",
      image: "",
      description: "",
    });
    setCategoryFormError("");
    setShowCategoryModal(true);
  };

  const handleOpenEditCategoryModal = (category: Category) => {
    setIsEditingCategory(true);
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      image: category.image || "",
      description: category.description || "",
    });
    setCategoryFormError("");
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryFormError("");

    if (!categoryForm.name || !categoryForm.slug) {
      setCategoryFormError("Please enter a valid Name and Slug.");
      return;
    }

    const url = isEditingCategory ? `/api/categories/${editingCategoryId}` : "/api/categories";
    const method = isEditingCategory ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      const data = await response.json();
      if (data.success) {
        setShowCategoryModal(false);
        fetchDashboardData(); // Refresh list
      } else {
        setCategoryFormError(data.error || "Failed to save category.");
      }
    } catch (err) {
      console.error("Category submit error:", err);
      setCategoryFormError("Network error saving category.");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? This action cannot be undone.`)) return;

    try {
      const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        fetchDashboardData(); // Refresh list
      } else {
        alert(data.error || "Failed to delete category.");
      }
    } catch (err) {
      console.error("Delete category error:", err);
      alert("Network error deleting category.");
    }
  };

  // Settings Save Handler
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsFormError("");
    setSettingsSuccessMessage("");

    if (!settings.whatsappNumber) {
      setSettingsFormError("WhatsApp Number is required.");
      return;
    }



    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (data.success) {
        setSettingsSuccessMessage("System Settings saved successfully!");
        setSettings(data.settings);
      } else {
        setSettingsFormError(data.error || "Failed to save settings.");
      }
    } catch (err) {
      console.error("Settings submit error:", err);
      setSettingsFormError("Network error saving settings.");
    }
  };



  // Booking CRUD Handlers
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        fetchDashboardData(); // Refresh list
      } else {
        alert(data.error || "Failed to update booking status.");
      }
    } catch (err) {
      console.error("Booking status update error:", err);
      alert("Network error updating status.");
    }
  };

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "var(--gold)" }}>
        <p style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}>Checking Authorization...</p>
      </div>
    );
  }

  // Stats logic
  const totalProducts = products.length;
  const totalBookings = bookings.length;
  const totalCategoriesCount = categories.length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;

  const filteredProducts = productCategoryFilter === "All"
    ? products
    : products.filter(p => p.category.toLowerCase() === productCategoryFilter.toLowerCase());

  return (
    <div className="admin-dashboard-container">
      {/* Admin header */}
      <div className="admin-header">
        <Link
          href="/"
          style={{
            display: "inline-flex",
            flexDirection: "column",
            textDecoration: "none",
            cursor: "pointer",
            transition: "opacity 0.2s ease",
          }}
          title="Go to Website Home"
        >
          <span
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--gold-pale, #e9caa0)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            SAP GOLD
          </span>
          <span
            style={{
              fontSize: "9.5px",
              fontWeight: 600,
              color: "var(--gold-light, #e9caa0)",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              marginTop: "5px",
              opacity: 0.9,
            }}
          >
            ORNAMENTS · SINCE 2000
          </span>
        </Link>

        <div className="admin-nav-actions">
          <Link href="/" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "11px" }}>
            View Site
          </Link>
          <button onClick={handleLogout} className="btn btn-gold" style={{ padding: "8px 16px", fontSize: "11px" }}>
            Log Out
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Metric widgets */}
        <div className="admin-overview-grid">
          <div className="metric-card">
            <label>Active Designs</label>
            <div className="value">{totalProducts}</div>
          </div>
          <div className="metric-card">
            <label>Product Collections</label>
            <div className="value">{totalCategoriesCount}</div>
          </div>
          <div className="metric-card">
            <label>Total Consultations</label>
            <div className="value">{totalBookings}</div>
          </div>
          <div className="metric-card">
            <label>Pending Slot Approvals</label>
            <div className="value" style={{ color: pendingBookings > 0 ? "var(--pending)" : "var(--gold)" }}>
              {pendingBookings}
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab("products")}
            className={`admin-tab ${activeTab === "products" ? "active" : ""}`}
          >
            Manage Products ({totalProducts})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`admin-tab ${activeTab === "categories" ? "active" : ""}`}
          >
            Manage Categories ({totalCategoriesCount})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`admin-tab ${activeTab === "bookings" ? "active" : ""}`}
          >
            Showroom Bookings ({totalBookings})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`admin-tab ${activeTab === "settings" ? "active" : ""}`}
          >
            System Settings
          </button>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--gold)" }}>
            <p style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>Synchronizing Dashboard Data...</p>
          </div>
        )}

        {/* PRODUCTS PANEL */}
        {!loading && activeTab === "products" && (
          <div>
            {/* Category Quick Selector cards */}
            <div style={{ marginBottom: "12px", fontSize: "14px", color: "var(--gold-light)", fontWeight: 500 }}>
              Categories Quick Filter & Direct Add:
            </div>
            <div className="admin-overview-grid" style={{ marginBottom: "28px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
              <div 
                className="metric-card" 
                style={{ 
                  cursor: "pointer", 
                  borderColor: productCategoryFilter === "All" ? "var(--gold)" : "var(--line)",
                  background: productCategoryFilter === "All" ? "rgba(200, 153, 46, 0.06)" : "var(--card-bg)",
                  transition: "all 0.25s ease"
                }}
                onClick={() => setProductCategoryFilter("All")}
              >
                <label style={{ cursor: "pointer" }}>All Categories</label>
                <div className="value" style={{ fontSize: "24px", marginTop: "4px" }}>
                  {products.length} <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 300 }}>Designs</span>
                </div>
              </div>

              {categories.map((c) => {
                const count = products.filter(
                  (p) => p.category.toLowerCase() === c.slug.toLowerCase()
                ).length;
                const isSelected = productCategoryFilter === c.slug;
                return (
                  <div 
                    key={c.id} 
                    className="metric-card" 
                    style={{ 
                      cursor: "pointer", 
                      borderColor: isSelected ? "var(--gold)" : "var(--line)",
                      background: isSelected ? "rgba(200, 153, 46, 0.06)" : "var(--card-bg)",
                      transition: "all 0.25s ease"
                    }}
                    onClick={() => setProductCategoryFilter(c.slug)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                      <label style={{ cursor: "pointer", margin: 0 }}>{c.name}</label>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAddModalForCategory(c.slug);
                        }}
                        className="btn btn-gold"
                        style={{
                          padding: "2px 8px",
                          fontSize: "10px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          minWidth: "auto",
                          height: "auto",
                          lineHeight: "normal",
                          marginTop: "-4px",
                          marginRight: "-4px"
                        }}
                        title={`Add product directly to ${c.name}`}
                      >
                        + Add
                      </button>
                    </div>
                    <div className="value" style={{ fontSize: "24px", marginTop: "4px" }}>
                      {count} <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 300 }}>Designs</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="admin-panel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h2>
                  Product Catalog
                  {productCategoryFilter !== "All" ? ` - ${categories.find(c => c.slug.toLowerCase() === productCategoryFilter.toLowerCase())?.name || productCategoryFilter}` : ""}
                  {" "}({filteredProducts.length})
                </h2>
                {isReorderMode && (
                  <p style={{ fontSize: "12px", color: "var(--gold)", marginTop: "4px" }}>
                    ⚠️ Reorder Mode Active: Click the ← and → arrows on the cards to shift photos.
                  </p>
                )}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {isReorderMode ? (
                  <>
                    <button onClick={saveReordering} className="btn btn-gold">
                      ✓ Save New Order
                    </button>
                    <button onClick={cancelReordering} className="btn btn-outline">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {filteredProducts.length > 1 && (
                      <button onClick={startReordering} className="btn btn-gold">
                        Toggle
                      </button>
                    )}
                    <button onClick={handleOpenAddModal} className="btn btn-gold">
                      + Add New {productCategoryFilter !== "All" ? `${categories.find(c => c.slug.toLowerCase() === productCategoryFilter.toLowerCase())?.name || productCategoryFilter} ` : ""}Design
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="catalog-grid" style={{ marginTop: "24px" }}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className={`feat-card ${isReorderMode ? 'draggable-card' : ''}`}
                    draggable={isReorderMode}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      height: "100%", 
                      justifyContent: "space-between",
                      cursor: isReorderMode ? (draggedItemIndex === index ? "grabbing" : "grab") : "default",
                      opacity: draggedItemIndex === index ? 0.3 : 1,
                      border: isReorderMode && dragOverIndex === index && draggedItemIndex !== index ? "2px dashed var(--gold)" : undefined,
                      transform: isReorderMode && dragOverIndex === index && draggedItemIndex !== index ? "scale(1.02)" : undefined,
                      transition: "transform 0.2s ease, border-color 0.2s ease, opacity 0.2s ease"
                    }}
                  >
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
                      <h3 className="product-card-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "12px", fontSize: "18px" }}>
                        {product.name}
                      </h3>
                      <p className="product-card-subtitle" style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", marginBottom: "16px" }}>
                        {categories.find((c) => c.slug.toLowerCase() === product.category.toLowerCase())?.name || product.category}
                        {` · `}
                        {product.metal || "Yellow Gold"}
                        {product.purity ? ` · ${product.purity}` : ""}
                      </p>
                    </div>

                    {/* Admin Actions Bar */}
                    {isReorderMode ? (
                      <div className="reorder-dpad">
                        {/* Row 1, Col 2: Up */}
                        <button
                          onClick={() => moveProduct(index, "up")}
                          disabled={index < 3}
                          className="reorder-arrow-btn"
                          style={{ gridColumn: "2", gridRow: "1" }}
                          title="Move Up"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                          </svg>
                        </button>

                        {/* Row 2, Col 1: Left */}
                        <button
                          onClick={() => moveProduct(index, "left")}
                          disabled={index === 0}
                          className="reorder-arrow-btn"
                          style={{ gridColumn: "1", gridRow: "2" }}
                          title="Move Left"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                          </svg>
                        </button>
                        
                        {/* Row 2, Col 2: Down */}
                        <button
                          onClick={() => moveProduct(index, "down")}
                          disabled={index >= filteredProducts.length - 3}
                          className="reorder-arrow-btn"
                          style={{ gridColumn: "2", gridRow: "2" }}
                          title="Move Down"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                          </svg>
                        </button>

                        {/* Row 2, Col 3: Right */}
                        <button
                          onClick={() => moveProduct(index, "right")}
                          disabled={index === filteredProducts.length - 1}
                          className="reorder-arrow-btn"
                          style={{ gridColumn: "3", gridRow: "2" }}
                          title="Move Right"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "10px", borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "10px" }}>
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="btn-edit-details"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                          Edit Details
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="btn-delete-product"
                          title="Delete product"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-results" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px 0" }}>
                  <h3 style={{ color: "var(--text-muted)" }}>No Designs Found</h3>
                  <p style={{ marginTop: "10px", fontSize: "14px", color: "var(--text-muted)" }}>This collection is currently empty.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CATEGORIES PANEL */}
        {!loading && activeTab === "categories" && (
          <div>
            <div className="admin-panel-header">
              <h2>Product Collections ({categories.length})</h2>
              <button onClick={handleOpenAddCategoryModal} className="btn btn-gold">
                + Add New Collection
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Bg Image</th>
                    <th>Collection Name</th>
                    <th>Identifier (Slug)</th>
                    <th>Sub-Label / Description</th>
                    <th>Product Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category) => {
                      const count = products.filter(
                        (p) => p.category.toLowerCase() === category.slug.toLowerCase()
                      ).length;
                      return (
                        <tr key={category.id}>
                          <td>
                            {category.image && !category.image.includes("placeholder") ? (
                              <img src={category.image} alt="" style={{ width: "80px", height: "45px", objectFit: "cover", border: "1px solid var(--line)" }} />
                            ) : (
                              <div style={{ width: "80px", height: "45px", background: "#171717", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: "10px" }}>
                                Gradient
                              </div>
                            )}
                          </td>
                           <td 
                            style={{ fontWeight: 500, cursor: "pointer" }}
                            onClick={() => {
                              setProductCategoryFilter(category.slug);
                              setActiveTab("products");
                            }}
                            title={`Click to view all products in ${category.name}`}
                          >
                            <span style={{ borderBottom: "1px dashed rgba(200, 153, 46, 0.45)" }}>{category.name}</span>
                          </td>
                          <td><code>{category.slug}</code></td>
                          <td>{category.description || "—"}</td>
                          <td 
                            style={{ fontWeight: "bold", color: "var(--gold-light)", cursor: "pointer" }}
                            onClick={() => {
                              setProductCategoryFilter(category.slug);
                              setActiveTab("products");
                            }}
                            title={`Click to view all products in ${category.name}`}
                          >
                            <span style={{ borderBottom: "1px dashed rgba(233, 202, 160, 0.45)" }}>{count} items</span>
                          </td>
                          <td>
                            <div className="action-btn-group" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <button
                                onClick={() => handleOpenAddModalForCategory(category.slug)}
                                className="btn btn-gold"
                                style={{
                                  padding: "4px 10px",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                  minWidth: "auto",
                                  height: "auto",
                                  lineHeight: "normal"
                                }}
                                title={`Add product directly to ${category.name}`}
                              >
                                + Add Design
                              </button>
                              <button
                                onClick={() => handleOpenEditCategoryModal(category)}
                                className="icon-btn"
                                title="Edit category"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id, category.name)}
                                className="icon-btn btn-delete"
                                title="Delete category"
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                        No categories inside showroom databases.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS PANEL */}
        {!loading && activeTab === "bookings" && (
          <div>
            <div className="admin-panel-header">
              <h2>Showroom Consultation Requests</h2>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Contact Info</th>
                    <th>Schedule</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td style={{ fontWeight: 500 }}>{booking.name}</td>
                        <td>
                          <div style={{ fontSize: "13px" }}>{booking.phone}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{booking.email}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{booking.date}</div>
                          <div style={{ fontSize: "12px", color: "var(--gold-light)" }}>{booking.time}</div>
                        </td>
                        <td style={{ fontSize: "13px" }}>{booking.type}</td>
                        <td>
                          <span className={`status-pill status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td style={{ fontSize: "12px", color: "var(--text-muted)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={booking.notes}>
                          {booking.notes || "—"}
                        </td>
                        <td>
                          <div className="action-btn-group">
                            {booking.status === "Pending" && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, "Confirmed")}
                                className="btn btn-gold"
                                style={{ padding: "4px 8px", fontSize: "10px", textTransform: "capitalize", letterSpacing: "normal" }}
                              >
                                Confirm
                              </button>
                            )}
                            {booking.status === "Confirmed" && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, "Completed")}
                                className="btn btn-outline"
                                style={{ padding: "4px 8px", fontSize: "10px", textTransform: "capitalize", letterSpacing: "normal" }}
                              >
                                Complete
                              </button>
                            )}
                            {booking.status !== "Completed" && booking.status !== "Cancelled" && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, "Cancelled")}
                                className="icon-btn btn-delete"
                                style={{ fontSize: "10px", width: "24px", height: "24px" }}
                                title="Cancel consultation"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                        No consultation bookings recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS PANEL */}
        {!loading && activeTab === "settings" && (
          <div style={{ maxWidth: "600px", margin: "0 auto", background: "var(--cream)", border: "1px solid var(--line)", padding: "30px" }}>
            <h2 style={{ fontSize: "24px", color: "var(--gold-pale)", marginBottom: "20px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
              Global System Settings
            </h2>
            
            {settingsFormError && (
              <div style={{ padding: "10px", background: "rgba(220, 53, 69, 0.1)", border: "1px solid var(--danger)", color: "var(--danger)", marginBottom: "15px", fontSize: "13px" }}>
                {settingsFormError}
              </div>
            )}
            {settingsSuccessMessage && (
              <div style={{ padding: "10px", background: "rgba(40, 167, 69, 0.1)", border: "1px solid var(--success)", color: "var(--success)", marginBottom: "15px", fontSize: "13px" }}>
                {settingsSuccessMessage}
              </div>
            )}

            <form onSubmit={handleSettingsSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label htmlFor="whatsappNumber">WhatsApp Phone Number (with Country Code) *</label>
                <input
                  type="text"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  required
                  value={settings.whatsappNumber}
                  onChange={handleSettingsChange}
                  placeholder="e.g. 919876543210 (No spaces or '+')"
                />
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Enter the country code first (e.g. 91 for India) followed by the phone number. Do not include leading zeros, + sign, or dashes.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="whatsappMessagePrefix">WhatsApp Message Prefix Text</label>
                <input
                  type="text"
                  id="whatsappMessagePrefix"
                  name="whatsappMessagePrefix"
                  value={settings.whatsappMessagePrefix}
                  onChange={handleSettingsChange}
                  placeholder="e.g. Hi, I'm interested in the"
                />
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  The message text sent to WhatsApp will automatically append the product name, ID, and price at the end.
                </span>
              </div>



              <button type="submit" className="btn btn-gold" style={{ width: "100%", marginTop: "16px" }}>
                Save System Settings
              </button>
            </form>


          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="admin-modal-content">
            <button className="modal-close" onClick={() => setShowProductModal(false)}>✕</button>
            <h3>{isEditing ? "Modify Masterpiece Details" : "Introduce New Design"}</h3>

            {formError && (
              <div style={{ padding: "10px", background: "rgba(220, 53, 69, 0.1)", border: "1px solid var(--danger)", color: "var(--danger)", marginBottom: "15px", fontSize: "13px" }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleProductSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className="form-group">
                  <label htmlFor="name">Design Title *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={productForm.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Mayura Gold Studs"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select id="category" name="category" value={productForm.category} onChange={handleFormChange}>
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="Bridal">Bridal Kalyani</option>
                        <option value="Temple">Temple Jewellery</option>
                        <option value="Everyday">Everyday Gold</option>
                        <option value="Diamond">Diamond Edit</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className="form-group">
                  <label htmlFor="metal">Metal Option *</label>
                  <select id="metal" name="metal" value={productForm.metal} onChange={handleFormChange}>
                    <option value="Yellow Gold">Yellow Gold</option>
                    <option value="White Gold">White Gold</option>
                    <option value="Rose Gold">Rose Gold</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="purity">Purity Standard *</label>
                  <input
                    type="text"
                    id="purity"
                    name="purity"
                    required
                    value={productForm.purity}
                    onChange={handleFormChange}
                    placeholder="e.g. HUID"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD GROUP */}
              <div className="form-group" style={{ border: "1px solid var(--line)", padding: "14px", background: "var(--maroon-dark)" }}>
                <label style={{ color: "var(--gold)" }}>Design Image Showcase</label>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "8px" }}>
                  <div className="image-upload-preview">
                    {productForm.image ? (
                      <img src={productForm.image} alt="Preview" />
                    ) : (
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>No Image</span>
                    )}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ fontSize: "12px", background: "transparent", border: "none", padding: 0 }}
                    />
                    {uploadingImage && <span style={{ fontSize: "11px", color: "var(--gold)" }}>Uploading file...</span>}
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Or manually paste image URL below:
                    </div>
                    <input
                      type="text"
                      name="image"
                      value={productForm.image}
                      onChange={handleFormChange}
                      placeholder="e.g. /images/products/custom.jpg"
                      style={{ padding: "6px 10px", fontSize: "12px" }}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={uploadingImage} className="btn btn-gold" style={{ width: "100%", marginTop: "10px" }}>
                {isEditing ? "Save Product Modifications" : "Record Design to Catalog"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="admin-modal-content">
            <button className="modal-close" onClick={() => setShowCategoryModal(false)}>✕</button>
            <h3>{isEditingCategory ? "Modify Collection Details" : "Introduce New Collection"}</h3>

            {categoryFormError && (
              <div style={{ padding: "10px", background: "rgba(220, 53, 69, 0.1)", border: "1px solid var(--danger)", color: "var(--danger)", marginBottom: "15px", fontSize: "13px" }}>
                {categoryFormError}
              </div>
            )}

            <form onSubmit={handleCategorySubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label htmlFor="cat_name">Collection Name *</label>
                <input
                  type="text"
                  id="cat_name"
                  name="name"
                  required
                  value={categoryForm.name}
                  onChange={handleCategoryFormChange}
                  placeholder="e.g. Silver Filigree"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cat_slug">Identifier Slug (matches product's category filter) *</label>
                <input
                  type="text"
                  id="cat_slug"
                  name="slug"
                  required
                  value={categoryForm.slug}
                  onChange={handleCategoryFormChange}
                  placeholder="e.g. Silver (case-sensitive mapping)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cat_description">Short Sub-Label / Description</label>
                <input
                  type="text"
                  id="cat_description"
                  name="description"
                  value={categoryForm.description}
                  onChange={handleCategoryFormChange}
                  placeholder="e.g. 18 Designs or Handcrafted Filigree"
                />
              </div>

              {/* CATEGORY IMAGE UPLOAD GROUP */}
              <div className="form-group" style={{ border: "1px solid var(--line)", padding: "14px", background: "var(--maroon-dark)" }}>
                <label style={{ color: "var(--gold)" }}>Collection Banner Image</label>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "8px" }}>
                  <div className="image-upload-preview" style={{ width: "120px", height: "70px" }}>
                    {categoryForm.image ? (
                      <img src={categoryForm.image} alt="Preview" />
                    ) : (
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>No Banner</span>
                    )}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageUpload}
                      style={{ fontSize: "12px", background: "transparent", border: "none", padding: 0 }}
                    />
                    {uploadingCategoryImage && <span style={{ fontSize: "11px", color: "var(--gold)" }}>Uploading banner...</span>}
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Or manually paste image URL below:
                    </div>
                    <input
                      type="text"
                      name="image"
                      value={categoryForm.image}
                      onChange={handleCategoryFormChange}
                      placeholder="e.g. /images/categories/silver.jpg"
                      style={{ padding: "6px 10px", fontSize: "12px" }}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={uploadingCategoryImage} className="btn btn-gold" style={{ width: "100%", marginTop: "10px" }}>
                {isEditingCategory ? "Save Collection Modifications" : "Record Collection"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
