"use client";

import Link from "next/link";
import {
  HiXMark,
  HiOutlineArrowPath,
  HiOutlineLifebuoy,
} from "react-icons/hi2";
import styles from "./failed.module.css";

export default function PaymentFailedPage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.decor} aria-hidden />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.badgeWrap} aria-hidden>
            <span className={styles.ring} />
            <span className={styles.badge}>
              <HiXMark />
            </span>
          </div>

          <span className={styles.eyebrow}>Payment failed</span>
          <h1>Your payment couldn&apos;t go through</h1>
          <p>
            Don&apos;t worry — no money has been deducted from your account. If
            anything was debited, it&apos;ll be reversed by your bank within
            5–7 working days.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/cart" className={styles.primaryCta}>
              <HiOutlineArrowPath /> Try payment again
            </Link>
            <Link href="/contact" className={styles.ghostCta}>
              <HiOutlineLifebuoy /> Contact support
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
