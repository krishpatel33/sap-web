"use client";

import { useEffect } from "react";

export function ScrollAnimation() {
  useEffect(() => {
    // Intersection Observer for Scroll Reveals
    const selectors = [
      ".reveal",
      ".reveal-up",
      ".reveal-scale",
      ".reveal-left",
      ".reveal-right",
      ".stagger-children",
      ".section-head",
      ".section-head h2",
      ".eyebrow",
      ".purity-item",
      ".testi-card",
      ".feat-card",
      ".heritage-copy",
      ".appointment",
      ".catalog-head",
      ".luxury-filter-console",
      ".gold-divider",
    ];

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.12,
    });

    const observeElements = () => {
      const elements = document.querySelectorAll(selectors.join(", "));
      elements.forEach((el) => {
        if (
          !el.classList.contains("reveal") &&
          !el.classList.contains("reveal-up") &&
          !el.classList.contains("reveal-scale") &&
          !el.classList.contains("reveal-left") &&
          !el.classList.contains("reveal-right")
        ) {
          el.classList.add("reveal-up");
        }
        observer.observe(el);
      });
    };

    const mutationObserver = new MutationObserver(() => observeElements());

    // Defer execution to let React complete hydration before direct DOM manipulation
    const timer = setTimeout(() => {
      observeElements();
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }, 0);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
