"use client";

import React, { useState } from "react";
import Link from "next/link";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* TOP ANNOUNCEMENT RIBBON */}
      <div className="announce">
        <span>✦</span> BIS 916 HALLMARKED GOLD &bull; MANEK CHOWK WHOLESALE HUB &bull; 26+ YEARS OF TRUST <span>✦</span>
      </div>

      {/* LUXURY HEADER */}
      <header suppressHydrationWarning>
        <div className="nav-wrap">
          <Link href="/" className="logo">
            <span className="logo-main">SAP GOLD</span>
            <span className="logo-sub">ORNAMENTS • SINCE 2000</span>
          </Link>

          <nav>
            <ul className={mobileMenuOpen ? "nav-mobile-open" : ""}>
              <li>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#collections" onClick={() => setMobileMenuOpen(false)}>
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/#heritage" onClick={() => setMobileMenuOpen(false)}>
                  Our Craft
                </Link>
              </li>
              <li>
                <Link href="/catalog" onClick={() => setMobileMenuOpen(false)}>
                  Catalog
                </Link>
              </li>
            </ul>
          </nav>

          <div className="nav-icons">
            <Link
              href="/catalog"
              style={{
                border: "1px solid rgba(200, 153, 46, 0.6)",
                background: "linear-gradient(135deg, rgba(20,18,14,0.9), rgba(8,7,5,0.95))",
                padding: "8px 18px",
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRadius: "20px",
                color: "#ffe699",
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(0,0,0,0.5), inset 0 0 10px rgba(200,153,46,0.15)",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Explore Catalog →
            </Link>
          </div>

          <button className="menu-toggle" aria-label="Menu" onClick={toggleMobileMenu}>
            ☰
          </button>
        </div>
      </header>
    </>
  );
};
