"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HiCheck } from "react-icons/hi2";
import styles from "./thankyou.module.css";

/**
 * Turn the URL id parameter into a customer-facing order code.
 *   - Sequential codes (VRS0001) pass through unchanged.
 *   - Legacy ObjectId orders get shortened to VRS-XXXXXX for readability.
 */
function displayId(raw) {
  if (!raw) return `VRS-${Math.floor(100000 + Math.random() * 900000)}`;
  const s = String(raw);
  if (/^VRS\d+$/i.test(s)) return s.toUpperCase();
  return `VRS-${s.slice(-6).toUpperCase()}`;
}

// The inner component reads the URL — under `output: "export"` this must live
// inside a Suspense boundary, otherwise Next fails to prerender the page.
function ThankYouContent() {
  const params = useSearchParams();
  const rawId = params?.get("id");
  const orderId = useMemo(() => displayId(rawId), [rawId]);
  const [today, setToday] = useState("");

  useEffect(() => {
    const d = new Date();
    setToday(
      d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.decor} aria-hidden />
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.badgeWrap} aria-hidden>
          <span className={styles.ring} />
          <span className={styles.ring2} />
          <span className={styles.badge}>
            <HiCheck />
          </span>
        </div>

        <span className={styles.eyebrow}>Order confirmed</span>
        <h1>Thank you for your order</h1>
        <p>
          Your payment was successful. A confirmation with delivery
          details has been sent to your registered email and phone.
        </p>

        <div className={styles.orderCard}>
          <div>
            <span>Order ID</span>
            <b>{orderId}</b>
          </div>
          <div>
            <span>Placed on</span>
            <b>{today || "—"}</b>
          </div>
          <div>
            <span>Status</span>
            <b className={styles.statusPill}>
              <span className={styles.dot} /> Confirmed
            </b>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Static fallback rendered while Suspense is resolving (prerender-safe). */
function ThankYouFallback() {
  return (
    <section className={styles.hero}>
      <div className={styles.decor} aria-hidden />
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.badgeWrap} aria-hidden>
          <span className={styles.ring} />
          <span className={styles.ring2} />
          <span className={styles.badge}>
            <HiCheck />
          </span>
        </div>
        <span className={styles.eyebrow}>Order confirmed</span>
        <h1>Thank you for your order</h1>
      </div>
    </section>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouFallback />}>
      <ThankYouContent />
    </Suspense>
  );
}
