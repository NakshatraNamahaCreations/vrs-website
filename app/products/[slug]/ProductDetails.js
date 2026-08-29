"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  HiArrowLeft,
  HiOutlineWrenchScrewdriver,
  HiOutlineShieldCheck,
  HiOutlineTag,
  HiOutlineCheckBadge,
  HiCheck,
  HiPlus,
  HiMinus,
  HiOutlineShoppingBag,
  HiChevronRight,
} from "react-icons/hi2";
import { addToCart, resolveImg } from "../../lib/cart";
import { products, slugify } from "../data";
import styles from "./details.module.css";

function normalizeProduct(raw) {
  if (!raw) return null;
  // Build the gallery so the main `image` is always the first thumbnail
  // (backend admins can upload the main image + extra thumbnails separately;
  // dedupe in case a URL appears in both).
  const gallery = Array.from(
    new Set([raw.image, ...(raw.images || [])].filter(Boolean))
  );
  return {
    id: raw._id || raw.id,
    name: raw.name,
    category: raw.category,
    brand: raw.brand || "",
    description: raw.description || "",
    price: raw.price,
    original: raw.originalPrice || raw.original || 0,
    image: raw.image,
    images: gallery,
    tag: raw.tag || "",
    features: raw.features || [],
    rating: raw.rating || 0,
    reviewCount: raw.reviewCount || 0,
    stock: raw.stock ?? 0,
  };
}

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setActiveImg(0);
    setQty(1);
    setAdded(false);
  }, [slug]);

  const product = useMemo(() => {
    if (!slug) return null;
    const raw = products.find((p) => slugify(p.name) === String(slug));
    return normalizeProduct(raw);
  }, [slug]);

  const related = useMemo(() => {
    if (!product?.category) return [];
    return products
      .filter((p) => p.category === product.category && slugify(p.name) !== slug)
      .slice(0, 4)
      .map(normalizeProduct);
  }, [product, slug]);

  const discount = useMemo(() => {
    if (!product || !product.original || product.original <= product.price) return 0;
    return Math.round(((product.original - product.price) / product.original) * 100);
  }, [product]);

  const savings = useMemo(() => {
    if (!product || !product.original || product.original <= product.price) return 0;
    return (product.original - product.price) * qty;
  }, [product, qty]);

  const onAdd = async () => {
    if (!product) return;
    setAdded(true);
    await addToCart({ ...product, qty });
    setTimeout(() => setAdded(false), 1400);
  };

  if (!product) {
    return (
      <section className={styles.errorSection}>
        <div className={`container ${styles.errorInner}`}>
          <h2>We couldn&apos;t find that product.</h2>
          <p>It might have been removed or is temporarily unavailable.</p>
          <button type="button" onClick={() => router.push("/products")} className={styles.errorBtn}>
            <HiArrowLeft /> Back to all products
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* BREADCRUMB */}
      <section className={styles.breadcrumbSection}>
        <div className={`container ${styles.breadcrumb}`}>
          <Link href="/">Home</Link>
          <HiChevronRight />
          <Link href="/products">Products</Link>
          <HiChevronRight />
          <span className={styles.crumbCategory}>{product.category}</span>
          <HiChevronRight />
          <span className={styles.crumbCurrent}>{product.name}</span>
        </div>
      </section>

      {/* MAIN */}
      <section className={styles.main}>
        <div className={`container ${styles.grid}`}>
          {/* LEFT — gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImgWrap}>
              {product.tag && <span className={styles.badge}>{product.tag}</span>}
              {discount > 0 && <span className={styles.discountPill}>-{discount}%</span>}
              <img
                src={resolveImg(product.images[activeImg] || product.image)}
                alt={product.name}
              />
            </div>

            {product.images.length > 0 && (
              <div className={styles.thumbRail}>
                {product.images.map((img, i) => (
                  <button
                    type="button"
                    key={`${img}-${i}`}
                    onClick={() => setActiveImg(i)}
                    className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ""}`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={resolveImg(img)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — details */}
          <div className={styles.info}>
            <div className={styles.infoHead}>
              <span className={styles.category}>{product.category}</span>
              <h1>{product.name}</h1>
              {product.brand && (
                <span className={styles.brandLine}>
                  By <b>{product.brand}</b>
                </span>
              )}
            </div>

            <div className={styles.priceCard}>
              <div className={styles.priceRow}>
                <b className={styles.price}>₹{(product.price * qty).toLocaleString("en-IN")}</b>
                {product.original > product.price && (
                  <>
                    <span className={styles.original}>₹{(product.original * qty).toLocaleString("en-IN")}</span>
                    <span className={styles.off}>{discount}% off</span>
                  </>
                )}
              </div>
              {savings > 0 && (
                <span className={styles.savings}>You save ₹{savings.toLocaleString("en-IN")}</span>
              )}

              <div className={styles.actionsRow}>
                <div className={styles.qty}>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <HiMinus />
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <HiPlus />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onAdd}
                  className={styles.addBtn}
                  disabled={added}
                >
                  {added ? (
                    <><HiCheck /> Added to bag</>
                  ) : (
                    <><HiOutlineShoppingBag /> Add to bag</>
                  )}
                </button>
              </div>

              <Link href="/cart" className={styles.viewCartLink}>
                View cart →
              </Link>
            </div>

            {product.description && (
              <div className={styles.section}>
                <h3>Product description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className={styles.section}>
                <h3>Key features</h3>
                <ul className={styles.features}>
                  {product.features.map((f, i) => (
                    <li key={i}>
                      <HiOutlineCheckBadge /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* trust strip */}
        <div className={`container ${styles.trustStrip}`}>
          <div>
            <span><HiOutlineWrenchScrewdriver /></span>
            <div>
              <b>Expert installation</b>
              <em>By certified VRS technicians</em>
            </div>
          </div>
          <div>
            <span><HiOutlineShieldCheck /></span>
            <div>
              <b>Genuine spares</b>
              <em>OEM parts, warrantied</em>
            </div>
          </div>
          <div>
            <span><HiOutlineTag /></span>
            <div>
              <b>Best price</b>
              <em>Or we&apos;ll match it</em>
            </div>
          </div>
        </div>
      </section>

      {/* YOU MAY ALSO LIKE */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={`container ${styles.relatedInner}`}>
            <header className={styles.relatedHead}>
              <div>
                <span className={styles.relatedEyebrow}>Discover more</span>
                <h2>You may also like</h2>
              </div>
              <Link href="/products" className={styles.relatedViewAll}>
                View all {product.category} →
              </Link>
            </header>

            <div className={styles.relatedGrid}>
              {related.map((r) => {
                const rDiscount = r.original && r.original > r.price
                  ? Math.round(((r.original - r.price) / r.original) * 100)
                  : 0;
                return (
                  <Link key={r.id} href={`/products/${slugify(r.name)}`} className={styles.relCard}>
                    <div className={styles.relImg}>
                      <img src={resolveImg(r.image)} alt={r.name} loading="lazy" />
                      {rDiscount > 0 && <span className={styles.relDiscount}>-{rDiscount}%</span>}
                    </div>
                    <div className={styles.relBody}>
                      <span className={styles.relCategory}>{r.category}</span>
                      <h4>{r.name}</h4>
                      <div className={styles.relFoot}>
                        <b>₹{r.price.toLocaleString("en-IN")}</b>
                        {r.original > r.price && (
                          <span>₹{r.original.toLocaleString("en-IN")}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
