import React from "react";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api-helper";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { CornerMotifs, DividerMotif } from "@/app/components/Ornaments";
import { BookingForm } from "@/app/components/BookingForm";
import { NewsletterForm } from "@/app/components/NewsletterForm";
import { OccasionCarousel } from "@/app/components/OccasionCarousel";
import { LandscapeSlider } from "@/app/components/LandscapeSlider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAP Gold Ornaments — Wholesale Gold Jewelry, Ahmedabad",
  description: "Ahmedabad's premium wholesale gold jewelry showroom in Manek Chowk since 2000. Exquisite HUID-certified antique gold chokers, temple necklaces, bracelets, and bridal sets.",
  openGraph: {
    title: "SAP Gold Ornaments — Wholesale Gold Jewelry, Ahmedabad",
    description: "Ahmedabad's premium wholesale gold jewelry showroom in Manek Chowk since 2000. Exquisite HUID-certified antique gold chokers, temple necklaces, bracelets, and bridal sets.",
    url: "https://sap-web-theta.vercel.app",
    siteName: "SAP Gold Ornaments",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "SAP Gold Ornaments Logo",
      },
    ],
    type: "website",
  },
};

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();

  // Calculate product counts per category slug
  const productCounts: Record<string, number> = {};
  products.forEach((p) => {
    if (p.category) {
      const key = p.category.toLowerCase();
      productCounts[key] = (productCounts[key] || 0) + 1;
    }
  });

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="hero reveal-up">
        <CornerMotifs />
        <span className="hero-eyebrow">Wholesale Gold Jewellery Hub — Ahmedabad</span>
        <h1>
          Purest Gold Ornaments for <em>your showroom</em>
          <br />
          supplied direct from Manek Chowk
        </h1>
        <p>Exquisite wholesale gold jewellery from SAP Gold Ornaments since 2000. 100% certified HUID ornaments.</p>
        <div className="btn-row">
          <Link
            href="/catalog"
            style={{
              color: "var(--gold-light)",
              fontSize: "15px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            Explore Catalog <span style={{ fontSize: "18px" }}>→</span>
          </Link>
        </div>

        <div className="purity-row stagger-children">
          <div className="purity-item reveal-up">
            <div className="purity-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M2 18h20v2H2zM3 14l3-8 6 5 6-5 3 8H3z" fill="currentColor" fillOpacity="0.25" />
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="4" cy="7" r="1.5" fill="currentColor" />
                <circle cx="20" cy="7" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span>HUID GOLD</span>
          </div>

          <div className="purity-item reveal-up">
            <div className="purity-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 3h12l4 6-10 12L2 9l4-6z" fill="currentColor" fillOpacity="0.25" />
                <path d="M12 3v18M2 9h20M7 3l5 6 5-6" />
              </svg>
            </div>
            <span>Wholesale Pricing</span>
          </div>

          <div className="purity-item reveal-up">
            <div className="purity-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.25" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>Lifetime Exchange</span>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=23.021482,72.589798"
            target="_blank"
            rel="noopener noreferrer"
            className="purity-item reveal-up"
            style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
            title="Open Manek Chowk Location on Google Maps"
          >
            <div className="purity-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" fill="currentColor" fillOpacity="0.25" />
                <circle cx="12" cy="10" r="3" fill="currentColor" />
              </svg>
            </div>
            <span>Manek Chowk, Ahmedabad</span>
          </a>
        </div>
      </section>

      {/* 5-PICTURE LANDSCAPE AUTOMATIC SLIDER (5 SECONDS) */}
      <div className="reveal-scale">
        <LandscapeSlider />
      </div>

      {/* COLLECTIONS SECTION */}
      <section className="collections" id="collections" style={{ width: "100%", padding: "70px 0 60px 0", overflow: "hidden" }}>
        <div className="container">
          <div className="section-head reveal-up">
            <span className="eyebrow">Curated For You</span>
            <h2>Every Occasion, Its Own Radiance</h2>
            <p>From everyday gold to once-in-a-lifetime bridal sets — browse collections built around how you actually wear jewellery.</p>
          </div>
        </div>

        <div className="reveal-up" style={{ width: "100%", margin: 0, padding: 0 }}>
          <OccasionCarousel categories={categories} productCounts={productCounts} />
        </div>
      </section>

      {/* HERITAGE SECTION */}
      <section
        className="heritage"
        id="heritage"
        style={{
          position: "relative",
          backgroundImage: "linear-gradient(90deg, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.88) 45%, rgba(5,5,5,0.2) 75%, transparent 100%), url('/craft_heritage_3d_gold.png')",
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
          padding: "110px 0",
          color: "#fff",
        }}
      >
        <div className="container">
          <div className="heritage-copy reveal-left" style={{ maxWidth: "620px", textAlign: "left" }}>
            <span className="eyebrow" style={{ color: "var(--gold-light)", letterSpacing: "0.15em" }}>Since 2000</span>
            <h2 style={{ color: "#fff", fontSize: "38px", marginTop: "12px", marginBottom: "22px", lineHeight: "1.25", textAlign: "left" }}>
              Master Karigari of Manek Chowk, One Standard of Purity
            </h2>
            <p style={{ color: "#e2e8f0", fontSize: "16px", lineHeight: "1.85", marginBottom: "18px" }}>
              Under the visionary leadership of Shaileshbhai Patel, SAP Gold Ornaments has grown to be a trusted name in wholesale gold jewelry. Every piece is handcrafted by master karigars in Manek Chowk, the historic gold hub of Ahmedabad.
            </p>
            <p style={{ color: "#cbd5e1", fontSize: "15.5px", lineHeight: "1.85", marginBottom: "36px" }}>
              We specialize strictly in gold ornaments, offering top-tier designs directly to retail showrooms and bulk buyers. We hallmark every gold piece to BIS 916 standard, ensuring absolute transparency and quality.
            </p>
            <div className="stat-row stagger-children" style={{ justifyContent: "flex-start", gap: "48px" }}>
              <div className="stat reveal-up">
                <h4 style={{ color: "var(--gold-light)", fontSize: "36px" }}>26+</h4>
                <span style={{ color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "12px" }}>Years of Trust</span>
              </div>
              <div className="stat reveal-up">
                <h4 style={{ color: "#ffffff", fontSize: "36px" }}>100%</h4>
                <span style={{ color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "12px" }}>Wholesale Only</span>
              </div>
              <div className="stat reveal-up">
                <h4 style={{ color: "var(--gold-light)", fontSize: "36px" }}>916</h4>
                <span style={{ color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "12px" }}>BIS Hallmarked</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-head reveal-up">
            <span className="eyebrow" style={{ color: "var(--gold-light)" }}>
              In Their Words
            </span>
            <h2>From Our Family To Yours</h2>
          </div>
          <div className="testi-grid stagger-children">
            <div className="testi-card reveal-up">
              <div className="stars">★★★★★</div>
              <p>
                &quot;We source our showroom&apos;s entire bridal gold inventory from SAP Gold Ornaments. Absolute purity, zero hassle, and timely delivery on every order.&quot;
              </p>
              <div className="testi-name">— Priya R., Retailer (Bengaluru)</div>
            </div>
            <div className="testi-card reveal-up">
              <div className="stars">★★★★★</div>
              <p>&quot;We have been buying bulk gold ornaments from Shaileshbhai for over 15 years. Their BIS 916 hallmarking is 100% reliable.&quot;</p>
              <div className="testi-name">— Suresh M., Showroom Owner (Pune)</div>
            </div>
            <div className="testi-card reveal-up">
              <div className="stars">★★★★★</div>
              <p>
                &quot;The antique temple gold collection from SAP Gold is highly detailed and sells out fast in our retail store. Master karigars work.&quot;
              </p>
              <div className="testi-name">— Lakshmi N., Boutique Owner (Chennai)</div>
            </div>
          </div>
        </div>
      </section>

      {/* APPOINTMENT BOOKING SECTION */}
      <section className="appointment" id="contact">
        <div className="container">
          <div className="section-head reveal-up" style={{ textAlign: "center" }}>
            <span className="eyebrow" style={{ display: "block", textAlign: "center" }}>Wholesale Office & Showroom</span>
            <h2 style={{ textAlign: "center" }}>Showroom & Office Visits</h2>
            <p style={{ textAlign: "center", margin: "16px auto 0 auto", maxWidth: "660px", color: "var(--gold-pale, #e9caa0)" }}>
              Schedule an exclusive consultation at our Manek Chowk office in Ahmedabad. Consult directly with Shaileshbhai Patel to explore HUID  gold collections and wholesale orders.
            </p>
          </div>

          <div className="reveal-scale" style={{ marginTop: "44px" }}>
            <BookingForm />
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter reveal-up">
        <div className="container">
          <span className="eyebrow">Stay Updated</span>
          <h2>Wholesale Catalog Releases</h2>
          <p>Get notified of new gold catalog releases and daily gold rates, straight to your inbox.</p>
          <NewsletterForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
