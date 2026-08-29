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
import {
  categories,
  products as fallbackProducts,
  slugify,
} from "../../products/data";
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

  const category = useMemo(() => {
    if (!slug) return null;
    return categories.find((c) => slugify(c) === String(slug)) || null;
  }, [slug]);

  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "" });

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
        setSource(fallbackProducts.map(normalize));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const items = useMemo(() => {
    if (!category || !source) return [];
    return source.filter((p) => p.category === category);
  }, [category, source]);

  const onAddToCart = async (product) => {
    setJustAdded(product.id);
    await addToCart(product);
    setToast({ open: true, message: product.name });
    setTimeout(() => setJustAdded((id) => (id === product.id ? null : id)), 1200);
  };

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
                const original = p.original || p.price;
                const discount = original > p.price
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
                          <b>₹{p.price.toLocaleString("en-IN")}</b>
                          {original > p.price && (
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
