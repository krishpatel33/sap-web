"use client";

import React, { useState } from "react";

export const NewsletterForm: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <form className="nl-form" onSubmit={handleSubmit} suppressHydrationWarning>
      <input type="email" placeholder="Your email address" required disabled={subscribed} suppressHydrationWarning />
      <button type="submit" disabled={subscribed}>
        {subscribed ? "Subscribed ✓" : "Subscribe"}
      </button>
    </form>
  );
};
