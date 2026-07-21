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
    metal: "22K Gold",
    details: "",
    weight: "",
    purity: "BIS 916 Hallmark",
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
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
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
      category: categories[0]?.slug || "Bridal",
      metal: "22K Gold",
      details: "",
      weight: "",
      purity: "BIS 916 Hallmark",
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
        setSettingsSuccessMessage("WhatsApp Settings saved successfully!");
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
            WhatsApp Settings
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
            <div className="admin-panel-header">
              <h2>Product Catalog ({products.length})</h2>
              <button onClick={handleOpenAddModal} className="btn btn-gold">
                + Add New Design
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Purity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          {product.image && !product.image.includes("placeholder") ? (
                            <img src={product.image} alt="" style={{ width: "45px", height: "45px", objectFit: "cover", border: "1px solid var(--line)" }} />
                          ) : (
                            <div style={{ width: "45px", height: "45px", background: "#171717", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: "10px" }}>
                              Mock
                            </div>
                          )}
                        </td>
                        <td style={{ fontWeight: 500 }}>{product.name}</td>
                        <td style={{ textTransform: "capitalize" }}>
                          {categories.find((c) => c.slug.toLowerCase() === product.category.toLowerCase())?.name || product.category}
                        </td>
                        <td style={{ fontSize: "12px", color: "var(--gold-light)" }}>
                          {product.purity || "BIS 916 Hallmark"}
                        </td>
                        <td>
                          <div className="action-btn-group">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="icon-btn"
                              title="Edit product"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="icon-btn btn-delete"
                              title="Delete product"
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                        No products inside showroom databases.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                          <td style={{ fontWeight: 500 }}>{category.name}</td>
                          <td><code>{category.slug}</code></td>
                          <td>{category.description || "—"}</td>
                          <td style={{ fontWeight: "bold", color: "var(--gold-light)" }}>{count} items</td>
                          <td>
                            <div className="action-btn-group">
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
              Global WhatsApp Settings
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

              <button type="submit" className="btn btn-gold" style={{ width: "100%", marginTop: "10px" }}>
                Save WhatsApp Settings
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

              <div className="form-group">
                <label htmlFor="purity">Purity Standard *</label>
                <input
                  type="text"
                  id="purity"
                  name="purity"
                  required
                  value={productForm.purity}
                  onChange={handleFormChange}
                  placeholder="e.g. BIS 916 Hallmarked"
                />
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
