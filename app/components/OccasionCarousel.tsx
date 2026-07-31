"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Category } from "@/lib/api-helper";

interface OccasionCarouselProps {
  categories: Category[];
  productCounts: Record<string, number>;
}

export function OccasionCarousel({ categories, productCounts }: OccasionCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const userPausedRef = useRef(false);

  // Duplicate categories array for continuous infinite scroll
  const displayCategories = [...categories, ...categories];

  const handlePause = () => {
    // Only pause on mouse enter if device supports fine hover (desktop mouse)
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      isPausedRef.current = true;
    }
  };

  const handleResume = () => {
    if (!userPausedRef.current) {
      isPausedRef.current = false;
    }
  };

  const handleTouchStart = () => {
    isPausedRef.current = true;
  };

  const handleTouchEnd = () => {
    // Resume auto-scroll smoothly on touch screens 600ms after finger release
    setTimeout(() => {
      if (!userPausedRef.current) {
        isPausedRef.current = false;
      }
    }, 600);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const animate = (currentTimestamp: number) => {
      const delta = currentTimestamp - lastTimestamp;
      lastTimestamp = currentTimestamp;

      if (!isPausedRef.current && !userPausedRef.current && container) {
        const pixelsToMove = (0.75 * delta) / 16.6;
        container.scrollLeft += pixelsToMove;

        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0 && container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += halfWidth;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollLeft = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    isPausedRef.current = true;

    const cardEl = container.querySelector(".carousel-card-item");
    const step = cardEl ? cardEl.clientWidth + 24 : 284;

    const halfWidth = container.scrollWidth / 2;
    if (container.scrollLeft <= 10 && halfWidth > 0) {
      container.scrollLeft += halfWidth;
    }

    container.scrollBy({ left: -step, behavior: "smooth" });

    setTimeout(() => {
      if (!userPausedRef.current) {
        isPausedRef.current = false;
      }
    }, 1500);
  };

  const scrollRight = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    isPausedRef.current = true;

    const cardEl = container.querySelector(".carousel-card-item");
    const step = cardEl ? cardEl.clientWidth + 24 : 284;

    const halfWidth = container.scrollWidth / 2;
    if (halfWidth > 0 && container.scrollLeft >= halfWidth - step) {
      container.scrollLeft -= halfWidth;
    }

    container.scrollBy({ left: step, behavior: "smooth" });

    setTimeout(() => {
      if (!userPausedRef.current) {
        isPausedRef.current = false;
      }
    }, 1500);
  };

  return (
    <div
      className="occasion-carousel-wrapper"
      suppressHydrationWarning
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Carousel Navigation Bar */}
      <div className="container">
        <div className="carousel-controls-top">
          <div className="carousel-nav-btns">
            <button
              onClick={scrollLeft}
              className="carousel-btn prev-btn"
              aria-label="Scroll left"
              title="Previous"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="carousel-btn next-btn"
              aria-label="Scroll right"
              title="Next"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Continuous Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="carousel-scroll-container continuous-scroll"
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div
          className="carousel-scroll-track"
          onMouseEnter={handlePause}
          onMouseLeave={handleResume}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {displayCategories.map((category, index) => {
            const count = productCounts[category.slug.toLowerCase()] || 0;

            return (
              <div
                key={`${category.id}-${index}`}
                className="carousel-card-item"
              >
                <Link
                  href={`/catalog?category=${encodeURIComponent(category.slug)}`}
                  className="coll-card"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="coll-card-bg"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: category.image
                        ? `url(${category.image})`
                        : "linear-gradient(160deg, #2a2a2a, #0a0a0a)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      zIndex: 1,
                    }}
                  />
                  <div className="label" style={{ zIndex: 2 }}>
                    <small>{category.description || `${count} Designs`}</small>
                    <h3>{category.name}</h3>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
