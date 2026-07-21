"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid username or password.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <Link href="/" style={{ display: "block", textAlign: "center", marginBottom: "20px" }}>
          <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", color: "var(--gold)", fontWeight: "bold", letterSpacing: "0.05em" }}>
            SAP GOLD
          </span>
          <span style={{ display: "block", fontSize: "8px", letterSpacing: "0.25em", color: "var(--gold-light)", marginTop: "2px" }}>
            ORNAMENTS ESTD. 2000
          </span>
        </Link>
        <h1>Admin Portal</h1>
        <p>Private Administrative Access</p>

        {error && (
          <div style={{ padding: "10px", background: "rgba(220, 53, 69, 0.1)", border: "1px solid var(--danger)", color: "var(--danger)", marginBottom: "20px", fontSize: "13px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="username" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-light)" }}>
              Admin Username
            </label>
            <input
              type="text"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
            />
          </div>

          <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "14px" }}>
            <label htmlFor="password" style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-light)" }}>
              Access Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: "100%", marginTop: "24px" }}>
            {loading ? "Authenticating..." : "Authorize Access"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            ← Return to Showroom Home
          </Link>
        </div>
      </div>
    </div>
  );
}
