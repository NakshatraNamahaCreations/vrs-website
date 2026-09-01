"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { HiOutlineShoppingBag, HiCheck } from "react-icons/hi2";
import { api } from "../lib/api";
import { addToCart, resolveImg } from "../lib/cart";
import { slugify } from "./data";
import Toast from "../components/Toast";
import styles from "./products.module.css";

function normalize(raw) {
  return {
    id: raw._id || raw.id,
    name: raw.name,
    category: raw.category,
    price: raw.price,
    original: raw.originalPrice || raw.original || 0,
    image: raw.image,
    tag: raw.tag || "",
    description: raw.description || "",
  };
}

export default function ProductsPage() {
  // Selected category is set once the first fetch resolves (see the effect
  // that syncs `active` to the first derived category below).
  const [active, setActive] = useState("");
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "" });
  const contentRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api("/api/products?limit=200")
      .then((res) => {
        if (cancelled) return;
        setSource((res.items || []).map(normalize));
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Couldn't load products.");
        setSource([]);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const onPickCategory = (c) => {
    setActive(c);
    // Scroll the product column back into view so the user always lands on
    // the top of the fresh category's list — handy on mobile and when the
    // page has been scrolled far down.
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Normalize a category string so casing/whitespace variants collapse into
  // one bucket (e.g. "RO + UV Water Purifier" and "RO+UV WATER PURIFIER" hash
  // to the same key). This is a display-time patch — the DB still has both
  // variants and should be de-duplicated properly via the admin.
  const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, "").trim();

  // Derive sidebar categories by normalized key. First occurrence wins for
  // the display label, and counts sum across all variants.
  const categories = useMemo(() => {
    const map = new Map(); // normKey → { label, count }
    (source || []).forEach((p) => {
      if (!p.category) return;
      const key = norm(p.category);
      const bucket = map.get(key);
      if (bucket) bucket.count += 1;
      else map.set(key, { label: p.category, count: 1 });
    });
    return Array.from(map.entries())
      .map(([key, v]) => ({ key, label: v.label, count: v.count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [source]);

  // Once categories are known, default the active tab to the first one so the
  // right-hand column has something to render on first paint.
  useEffect(() => {
    if (!active && categories.length > 0) setActive(categories[0].key);
  }, [active, categories]);

  const items = useMemo(
    () => (source || []).filter((p) => norm(p.category) === active),
    [active, source]
  );

  const activeLabel = useMemo(
    () => categories.find((c) => c.key === active)?.label || "",
    [categories, active]
  );

  const onAddToCart = async (product) => {
    setJustAdded(product.id);
    await addToCart(product);
    setToast({ open: true, message: product.name });
    setTimeout(() => setJustAdded((id) => (id === product.id ? null : id)), 1200);
  };

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroDecor} aria-hidden />
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.heroEyebrow}>
             Our Complete Range
          </span>
          <h1>
            Every water purifier and spare<br />
            you&apos;ll ever need, <span className={styles.hilite}>curated.</span>
          </h1>
          <p>
            Genuine parts and premium purifiers from every leading brand
            handpicked, warrantied, and delivered by VRS.
          </p>
        </div>
      </section>

      {/* MAIN — sidebar + grid */}
      <section className={styles.main}>
        <div className={`container ${styles.mainInner}`}>
          {/* LEFT — categories */}
          <aside className={styles.sidebar}>
            <span className={styles.sidebarLabel}>Categories</span>
            <ul className={styles.categoryList}>
              {categories.map((c) => {
                const isActive = c.key === active;
                return (
                  <li key={c.key}>
                    <button
                      onClick={() => onPickCategory(c.key)}
                      className={`${styles.categoryBtn} ${isActive ? styles.categoryBtnActive : ""}`}
                    >
                      <span className={styles.categoryIndicator} aria-hidden />
                      <span className={styles.categoryName}>{c.label}</span>
                      <span className={styles.categoryCount}>{c.count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className={styles.sidebarCta}>
              <span>Can&apos;t find what you need?</span>
              <Link href="/contact" className={styles.sidebarLink}>Ask us →</Link>
            </div>
          </aside>

          {/* RIGHT — products */}
          <div ref={contentRef} className={styles.content}>
            <header className={styles.contentHead}>
              <div>
                <span className={styles.contentEyebrow}>Showing</span>
                <h2>{activeLabel}</h2>
              </div>
              <span className={styles.resultCount}>
                <b>{items.length}</b> {items.length === 1 ? "product" : "products"}
              </span>
            </header>

            {loading ? (
              <div className={styles.empty}>
                <p>Loading products…</p>
              </div>
            ) : items.length === 0 ? (
              <div className={styles.empty}>
                <p>
                  {error
                    ? `Couldn't load products (${error}).`
                    : "No products in this category yet."}
                </p>
                <Link href="/contact" className={styles.emptyLink}>
                  Enquire about custom orders →
                </Link>
              </div>
            ) : (
              <div className={styles.grid}>
                {items.map((p, i) => {
                  const original = p.original || p.price;
                  const discount = original > p.price
                    ? Math.round(((original - p.price) / original) * 100)
                    : 0;
                  const added = justAdded === p.id;
                  return (
                    <article key={p.id} className={styles.card} style={{ animationDelay: `${i * 60}ms` }}>
                      <Link href={`/products/${slugify(p.name)}`} className={styles.imgBox}>
                        <img src={resolveImg(p.image)} alt={p.name} loading="lazy" />
                        {discount > 0 && <span className={styles.discount}>-{discount}%</span>}
                      </Link>
                      <div className={styles.body}>
                        <span className={styles.cardCategory}>{p.category}</span>
                        <Link href={`/products/${slugify(p.name)}`} className={styles.cardTitleLink}>
                          <h3>{p.name}</h3>
                        </Link>
                        <div className={styles.foot}>
                          <div className={styles.price}>
                            <b>₹{p.price.toLocaleString("en-IN")}</b>
                            {original > p.price && (
                              <span>₹{original.toLocaleString("en-IN")}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => onAddToCart(p)}
                            className={styles.cta}
                            disabled={added}
                            aria-label="Add to bag"
                          >
                            {added ? (
                              <>
                                <HiCheck className={styles.ctaIcon} /> Added
                              </>
                            ) : (
                              <>
                                <HiOutlineShoppingBag className={styles.ctaIcon} /> Add to bag
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </>
  );
}
