"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  HiOutlineShoppingBag,
  HiCheck,
  HiChevronRight,
  HiArrowLeft,
} from "react-icons/hi2";
import { api } from "../../lib/api";
import { addToCart, resolveImg } from "../../lib/cart";
import { slugify } from "../../products/data";
import Toast from "../../components/Toast";
import styles from "./category.module.css";

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

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug;

  const [source, setSource] = useState(null);
  const [categoryDocs, setCategoryDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "" });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Fetch products + admin-managed categories in parallel so we can resolve
    // the slug even when zero products exist under it yet.
    Promise.all([
      api("/api/products?limit=200"),
      api("/api/categories").catch(() => ({ items: [] })),
    ])
      .then(([prodRes, catRes]) => {
        if (cancelled) return;
        setSource((prodRes.items || []).map(normalize));
        setCategoryDocs(catRes.items || []);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Couldn't load products.");
        setSource([]);
        setCategoryDocs([]);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  // Normalize for slug matching — collapses whitespace/case variants of the
  // same category (e.g. "RO + UV Water Purifier" and "RO+UV WATER PURIFIER").
  const norm = (s) => slugify(String(s || ""));

  // Resolve display name for the URL slug. Prefer the admin's Category
  // document (so a freshly-created category with no products yet still gets a
  // proper landing page), then fall back to deriving from any product.
  const category = useMemo(() => {
    if (!slug) return null;
    const target = String(slug);
    const catMatch = (categoryDocs || []).find(
      (c) => c?.slug === target || norm(c?.name) === target
    );
    if (catMatch) return catMatch.name;
    const prodMatch = (source || []).find(
      (p) => p.category && norm(p.category) === target
    );
    return prodMatch ? prodMatch.category : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, source, categoryDocs]);

  // Filter case-insensitively so variant spellings of the same category all
  // land in the same product list.
  const items = useMemo(() => {
    if (!category || !source) return [];
    const key = norm(category);
    return source.filter((p) => norm(p.category) === key);
  }, [category, source]);

  const onAddToCart = async (product) => {
    setJustAdded(product.id);
    await addToCart(product);
    setToast({ open: true, message: product.name });
    setTimeout(() => setJustAdded((id) => (id === product.id ? null : id)), 1200);
  };

  // Both fetches must resolve before we can decide whether the slug is real,
  // otherwise we'd flash "not found" during the round-trip.
  if (loading || source === null || categoryDocs === null) {
    return (
      <section className={styles.notFound}>
        <div className={`container ${styles.notFoundInner}`}>
          <p>Loading…</p>
        </div>
      </section>
    );
  }

  if (!category) {
    return (
      <section className={styles.notFound}>
        <div className={`container ${styles.notFoundInner}`}>
          <h2>Category not found</h2>
          <p>The category you&apos;re looking for doesn&apos;t exist or has been renamed.</p>
          <Link href="/products" className={styles.notFoundBtn}>
            <HiArrowLeft /> Back to all products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* TOP BAR — breadcrumb + title */}
      <section className={styles.topBar}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <HiChevronRight />
            <Link href="/products">Products</Link>
            <HiChevronRight />
            <span>{category}</span>
          </nav>

          <div className={styles.titleRow}>
            <div className={styles.titleGroup}>
              <h1>{category}</h1>
              <span className={styles.itemCount}>
                <b>{items.length}</b> {items.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT LIST */}
      <section className={styles.main}>
        <div className="container">
          <div className={styles.list}>
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
                <Link href="/contact" className={styles.emptyCta}>
                  Enquire about custom orders →
                </Link>
              </div>
            ) : (
              items.map((p) => {
                const hasPrice = p.price != null;
                const original = p.original || p.price;
                const discount = hasPrice && original > p.price
                  ? Math.round(((original - p.price) / original) * 100)
                  : 0;
                const added = justAdded === p.id;
                return (
                  <article key={p.id} className={styles.card}>
                    <Link href={`/products/${slugify(p.name)}`} className={styles.cardImg}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveImg(p.image)} alt={p.name} loading="lazy" />
                      {discount > 0 && (
                        <span className={styles.discountPill}>{discount}% OFF</span>
                      )}
                    </Link>
                    <div className={styles.cardBody}>
                      <span className={styles.cardCategory}>{p.category}</span>
                      <Link
                        href={`/products/${slugify(p.name)}`}
                        className={styles.cardTitleLink}
                      >
                        <h3>{p.name}</h3>
                      </Link>
                      {p.description && (
                        <p className={styles.cardDesc}>{p.description}</p>
                      )}
                      <div className={styles.cardFoot}>
                        <div className={styles.priceBlock}>
                          <b>{hasPrice ? `₹${p.price.toLocaleString("en-IN")}` : "On request"}</b>
                          {hasPrice && original > p.price && (
                            <s>₹{original.toLocaleString("en-IN")}</s>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onAddToCart(p)}
                          className={styles.addBtn}
                          disabled={added}
                          aria-label="Add to bag"
                        >
                          {added ? (
                            <><HiCheck /> Added</>
                          ) : (
                            <><HiOutlineShoppingBag /> Add to bag</>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
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
