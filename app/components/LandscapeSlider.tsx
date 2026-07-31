"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Slide {
  id: number;
  image: string;
  alt: string;
  href: string;
}

const slides: Slide[] = [
  { id: 1, image: "/slides/slide1.png", alt: "SAP Gold Women Rings Collection", href: "/catalog" },
  { id: 2, image: "/slides/slide2.png", alt: "SAP Gold Earrings Collection", href: "/catalog?category=Women Ring" },
  { id: 3, image: "/slides/slide3.png", alt: "SAP Gold Chains Collection", href: "/catalog?category=Earring" },
  { id: 4, image: "/slides/slide4.png", alt: "SAP Gold Pendants Collection", href: "/catalog?category=Gents Ring" },
  { id: 5, image: "/slides/slide5.png", alt: "SAP Gold Showcase - All Ornaments", href: "/catalog?category=Bracelets" },
];

export const LandscapeSlider: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!mounted || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [mounted, currentIndex, isPaused]);

  return (
    <section
      className="landscape-showcase-section"
      suppressHydrationWarning
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        position: "relative",
        width: "100%",
        margin: 0,
        padding: 0,
        background: "#050505",
        overflow: "hidden",
      }}
    >
      {/* 100% Full Width Edge-to-Edge Horizontal Sliding Showcase Container */}
      <div
        suppressHydrationWarning
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          maxHeight: "680px",
          overflow: "hidden",
          borderTop: "1px solid rgba(200, 153, 46, 0.25)",
          borderBottom: "1px solid rgba(200, 153, 46, 0.25)",
          background: "#000000",
        }}
      >
        {/* Horizontal Sliding Track (Left-to-Right Transition) */}
        <div
          suppressHydrationWarning
          style={{
            display: "flex",
            width: `${slides.length * 100}%`,
            height: "100%",
            transform: `translateX(-${(currentIndex * 100) / slides.length}%)`,
            transition: mounted ? "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
            willChange: "transform",
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              suppressHydrationWarning
              style={{
                width: `${100 / slides.length}%`,
                height: "100%",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <Link
                href={slide.href}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
