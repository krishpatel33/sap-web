import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=23.021482,72.589798";

  return (
    <footer id="contact" suppressHydrationWarning>
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">SAP Gold Ornaments</div>
            <p style={{ marginTop: "14px", lineHeight: "1.7", fontSize: "14px" }}>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="foot-address-link"
              >
                405, Aabhusan Complex, Manek Chowk, Ahmedabad, Gujarat
              </a>
            </p>
          </div>

          <div className="foot-col">
            <h4>Collections</h4>
            <ul>
              <li>
                <Link href="/catalog?category=Earrings">Earrings & Jhumkas</Link>
              </li>
              <li>
                <Link href="/catalog?category=Women%20Ring">Rings (Women & Gents)</Link>
              </li>
              <li>
                <Link href="/catalog?category=Chain">Chains & Pendants</Link>
              </li>
              <li>
                <Link href="/catalog?category=Mangalsutra">Mangalsutra Series</Link>
              </li>
              <li>
                <Link href="/catalog?category=Bangles">Bangles & Bracelets</Link>
              </li>
              <li>
                <Link href="/catalog?category=Wedding%20Set">Wedding Sets</Link>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link href="/#collections">Browse Collections</Link>
              </li>
              <li>
                <Link href="/#heritage">Our Story & Karigari</Link>
              </li>
              <li>
                <Link href="/catalog">All Showroom Catalog</Link>
              </li>
              <li>
                <Link href="/#contact">Book Showroom Visit</Link>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Manek Chowk Hub</h4>
            <ul>
              <li><strong>Owner:</strong> Shaileshbhai Patel</li>
              <li><strong>Phone 1:</strong> +91 98254 70262</li>
              <li><strong>Phone 2:</strong> +91 90238 41249</li>
              <li>
                <strong>Address:</strong>{" "}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="foot-address-link"
                  style={{ textDecoration: "underline" }}
                >
                  405, Aabhusan Complex, Manek Chowk, Ahmedabad, Gujarat
                </a>
              </li>
              <li><strong>Hours:</strong> Mon – Sat, 10:00 AM – 7:30 PM</li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 SAP Gold Ornaments. All rights reserved.</span>
          <span>100% BIS 916 Certified · Wholesale Only · GST Compliant</span>
        </div>
      </div>
    </footer>
  );
};
