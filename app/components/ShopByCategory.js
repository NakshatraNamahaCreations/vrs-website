"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import { resolveImg } from "../lib/cart";
import { slugify } from "../products/data";
import styles from "../page.module.css";

/**
 * Homepage "Shop by category" grid.
 * Renders the admin-managed category list from /api/categories.
 */
export default function ShopByCategory() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api("/api/categories")
      .then((res) => {
        if (cancelled) return;
        setItems(
          (res.items || [])
            .filter((c) => c?.name)
            .map((c) => ({ name: c.name, image: c.image, slug: c.slug }))
        );
      })
      .catch(() => {
        if (cancelled) return;
        setItems([]);
      });
    return () => { cancelled = true; };
  }, []);

  // Hide the whole section until we know what the admin has configured.
  if (items === null || items.length === 0) return null;

  return (
    <section className={`section ${styles.shopSection}`}>
      <div className="container">
        <div className={styles.shopHead}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>Browse Range</span>
          <h2>
            Shop by <span className="gradient-text">Category</span>
          </h2>
          <p>
            Find the right purifier for your kitchen, workspace or business —
            handpicked across every leading technology and format.
          </p>
        </div>

        <div className={styles.shopGrid}>
          {items.map((c) => (
            <Link
              key={c.name}
              href={`/categories/${c.slug || slugify(c.name)}`}
              className={styles.shopCard}
            >
              <div className={styles.shopImg}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImg(c.image)} alt={c.name} loading="lazy" />
                <span className={styles.shopOverlay} aria-hidden />
              </div>
              <span className={styles.shopLabel}>{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
