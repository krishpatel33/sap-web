"use client";

import React, { useState } from "react";

export const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    type: "In-Store Viewing",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <h3>Private Viewing Scheduled</h3>
        <p style={{ margin: "14px 0", color: "var(--text-muted)", fontSize: "14.5px", lineHeight: "1.7" }}>
          Thank you, <strong>{formData.name}</strong>. We have received your request for a{" "}
          <strong>{formData.type}</strong> on <strong>{formData.date}</strong> at <strong>{formData.time}</strong>.
        </p>
        <p style={{ color: "var(--gold-light)", fontSize: "13px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          A private relationship manager will contact you shortly to confirm your slot.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              date: "",
              time: "",
              type: "In-Store Viewing",
              notes: "",
            });
          }}
          className="btn btn-gold"
          style={{ marginTop: "24px" }}
        >
          Book Another Session
        </button>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} suppressHydrationWarning>
      <div className="booking-form-header" suppressHydrationWarning>
        <h3>Request Private Consultation</h3>
        <p>Book a dedicated session with Shaileshbhai Patel at Manek Chowk</p>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(220, 53, 69, 0.15)", border: "1px solid var(--danger)", color: "#ff8080", borderRadius: "6px", marginBottom: "24px", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <div className="form-grid" suppressHydrationWarning>
        <div className="form-group" suppressHydrationWarning>
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Patel"
            suppressHydrationWarning
          />
        </div>

        <div className="form-group" suppressHydrationWarning>
          <label htmlFor="phone">Contact Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            suppressHydrationWarning
          />
        </div>

        <div className="form-group" suppressHydrationWarning>
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. rahul@jewellers.com"
            suppressHydrationWarning
          />
        </div>

        <div className="form-group" suppressHydrationWarning>
          <label htmlFor="type">Consultation Type *</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} suppressHydrationWarning>
            <option value="In-Store Viewing">Private Showroom Viewing</option>
            <option value="Virtual Consultation">Virtual Video Consultation</option>
          </select>
        </div>

        <div className="form-group" suppressHydrationWarning>
          <label htmlFor="date">Preferred Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            suppressHydrationWarning
          />
        </div>

        <div className="form-group" suppressHydrationWarning>
          <label htmlFor="time">Preferred Time *</label>
          <input
            type="time"
            id="time"
            name="time"
            required
            value={formData.time}
            onChange={handleChange}
            suppressHydrationWarning
          />
        </div>

        <div className="form-group form-group-full" suppressHydrationWarning>
          <label htmlFor="notes">Special Requirements / Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Specify preferred items (e.g. 22K Gold Chains, Temple Jhumkas, Bridal Sets)..."
            suppressHydrationWarning
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: "100%", padding: "14px", marginTop: "8px", fontSize: "12px", letterSpacing: "0.15em" }}>
        {loading ? "Scheduling Session..." : "Submit Appointment Request"}
      </button>
    </form>
  );
};
