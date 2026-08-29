"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiCheck, HiXMark, HiOutlineShoppingBag } from "react-icons/hi2";
import styles from "./Toast.module.css";

/**
 * Non-blocking, auto-dismissing toast. Renders into `document.body` via a
 * portal so it isn't clipped by parent overflow/transform contexts.
 *
 * Props:
 *  open       - boolean, controlled from the parent
 *  onClose    - callback fired when the toast auto-dismisses or is closed
 *  message    - primary text (e.g. product name)
 *  subtext    - optional secondary line (e.g. "Added to your bag")
 *  duration   - ms before auto-dismiss (default 2400)
 */
export default function Toast({
  open,
  onClose,
  message,
  subtext = "Added to your bag",
  duration = 2400,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`${styles.wrap} ${open ? styles.show : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.toast}>
        <span className={styles.iconBadge}>
          <HiCheck />
        </span>
        <div className={styles.body}>
          <b className={styles.title}>{message}</b>
          <span className={styles.sub}>
            <HiOutlineShoppingBag /> {subtext}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className={styles.close}
        >
          <HiXMark />
        </button>
        <span className={styles.progress} style={{ animationDuration: `${duration}ms` }} />
      </div>
    </div>,
    document.body
  );
}
