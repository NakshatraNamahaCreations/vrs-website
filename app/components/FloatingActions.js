"use client";

import { useEffect, useState } from "react";
import styles from "./FloatingActions.module.css";

const PHONE = "+919999999999";
const WHATSAPP = "919999999999";
const WHATSAPP_MSG = "Hi VRS! I'd like to know more about your water purifiers.";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.stack} aria-label="Quick actions">
      <button
        type="button"
        onClick={scrollToTop}
        className={`${styles.btn} ${styles.top} ${showTop ? styles.topVisible : ""}`}
        aria-label="Back to top"
      >
        <span className={styles.tooltip}>Back to top</span>
        <Icon name="arrow-up" />
      </button>

      <a
        href={`tel:${PHONE}`}
        className={`${styles.btn} ${styles.call}`}
        aria-label="Call us"
      >
        <span className={styles.tooltip}>Call us</span>
        <Icon name="phone" />
        <span className={styles.pulse} aria-hidden />
      </a>

      <a
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.btn} ${styles.whatsapp}`}
        aria-label="Chat on WhatsApp"
      >
        <span className={styles.tooltip}>WhatsApp us</span>
        <Icon name="whatsapp" />
      </a>
    </div>
  );
}

function Icon({ name }) {
  if (name === "phone") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 20 20 0 0 1-8.6-3.1 20 20 0 0 1-6-6 20 20 0 0 1-3.1-8.6A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2Z" />
      </svg>
    );
  }
  if (name === "whatsapp") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.17h-.01a8.25 8.25 0 0 1-4.2-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.24 8.24 0 0 1-1.26-4.4c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.12-.56.12s-.64.8-.79.97c-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.42.06-.64.31s-.85.83-.85 2.03.87 2.36 1 2.52c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
    );
  }
  if (name === "arrow-up") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    );
  }
  return null;
}
