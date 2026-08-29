"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Bestsellers.module.css";
import { api } from "../lib/api";
import { resolveImg } from "../lib/cart";
import { slugify } from "../products/data";

function normalize(raw) {
  return {
    id: raw._id || raw.id,
    name: raw.name,
    category: raw.category,
    tag: raw.tag || "",
    price: Number(raw.price || 0),
    original: Number(raw.originalPrice || raw.original || 0),
    rating: typeof raw.rating === "number" ? raw.rating : 0,
    reviews: raw.reviewCount ?? raw.reviews ?? 0,
    image: raw.image,
  };
}

const fallbackBestsellers = [
  {
    id: 1,
    name: "Aquaguard Astor RO UV Kit",
    category: "Aquaguard Spare Parts",
    tag: "Bestseller",
    price: 3999,
    original: 5070,
    rating: 4.9,
    reviews: 234,
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "Aquaguard PF Candle Sleek ARP",
    category: "Aquaguard Spare Parts",
    tag: "Popular",
    price: 375,
    original: 475,
    rating: 4.7,
    reviews: 189,
    image: "/images/product2.png",
  },
  {
    id: 3,
    name: "AquaGuard Enance RO Kit",
    category: "Aquaguard Spare Parts",
    tag: "Popular",
    price: 3600,
    original: 4890,
    rating: 4.9,
    reviews: 312,
    image: "/images/product3.png",
  },
  {
    id: 4,
    name: "Aquaguard Prefilter Asembly",
    category: "Aquaguard Spare Parts",
    tag: "New",
    price: 4499,
    original: 5999,
    rating: 4.6,
    reviews: 87,
    image: "/images/product4.png",
  },
  {
    id: 5,
    name: "Aquaguard Magna ro Kit PL4",
    category: "Aquaguard Spare Parts",
    tag: "Bestseller",
    price: 3800,
    original: 5070,
    rating: 4.9,
    reviews: 156,
    image: "/images/product5.png",
  },
  {
    id: 6,
    name: "Aquaguard Universal RO Filter Kits",
    category: "Aquaguard Spare Parts",
    tag: "Bestseller",
    price: 4500,
    original: 7445  ,
    rating: 4.7,
    reviews: 201,
    image: "/images/product6.png",
  },
  {
    id: 7,
    name: "50 LPH RO with inbuilt Stainless Steel Tank",
    category: "Commercial RO",
    tag: "Popular",
    price: 48900,
    original: 64000,
    rating: 4.8,
    reviews: 41,
    image: "/images/product7.png",
  },
  {
    id: 8,
    name: "30LPH RO With Mega Sediment Filter Copper+ Alkaline",
    category: "Commercial Water Purifier",
    tag: "New",
    price: 15500,
    original: 25000,
    rating: 4.6,
    reviews: 68,
    image: "/images/product8.png",
  },
  {
    id: 9,
    name: "Aquaguard Aspire Blaze Insta WS RO+UV Stainless Steel Hot & Ambient Copper Water Purifier",
    category: "Hot & Ambient",
    tag: "Popular",
    price: 23500,
    original: 37000,
    rating: 4.3,
    reviews: 62,
    image: "/images/product9.png"
  },
  {
    id: 10,
    name: "Aquaguard Aspire Blaze 2X RO+UV Stainless Steel Water Purifier | 2 Year Filter Life | With Mega Sediment Filter",
    category: "Hot & Ambient",
    tag: "Popular",
    price: 23500,
    original: 37000,
    rating: 4.3,
    reviews: 62,
    image: "/images/product10.png"
  },
  {
    id: 11,
    name: "KENT Elegant RO UV UF TDS controlr",
    category: "RO UV UF MTDS",
     tag: "Popular",
    price: 16500,
    original: 23500,
    rating: 4.3,
    reviews: 62,
    image: "/images/product11.png"
  },
  {
    id: 12,
    name: "KENT Grand Plus RO Water Purifier | RO+UV+UF+TDS Control+UV in Tank | .0001 Micron RO Membrane | ISI Marked | Auto Flush Feature | 9L Tank | 20 LPH | Ideal For Borewell/Tanker/Municipal Water | Black",
    category: "RO UV UF MTDS",
     tag: "Popular",
    price: 23500,
    original: 37000,
    rating: 4.3,
    reviews: 62,
    image: "/images/product12.png"
  },
  {
    id: 13,
    name: "Aquaguard Aspire Nova Ro + UV Copper + Alkaline SS 2x",
    category: "RO + UV Water Purifier",
     tag: "Popular",
    price: 24000,
    original: 36000,
    rating: 4.3,
    reviews: 62,
    image: "/images/product13.png"
  },
  {
    id: 14,
    name: "Kent Sapphire",
    category: "RO + UV Water Purifier",
     tag: "Popular",
    price: 18000,
    original: 25000,
    rating: 4.3,
    reviews: 62,
    image: "/images/product14.png"
  },
  {
    id: 15,
    name: "Aquaguard Designo UTC RO+UV 2X Water Purifier | 2 Year Filter Life | With Mega Sediment Filter",
    category: "Under Sink Models",
     tag: "Popular",
    price: 25900,
    original: 39500,
    rating: 4.3,
    reviews: 62,
    image: "/images/product15.png"
  },
  {
    id: 16,
    name: "Aquaguard Nova UV+UF 2X Copper Water Purifier | 2 Year Filter Life | With Mega Sediment Filter",
    category: "UV + UF Water Purifier",
     tag: "Popular",
    price: 14490,
    original: 17000,
    rating: 4.3,
    reviews: 62,
    image: "/images/product16.png"
  },
   {
    id: 17,
    name: "Water Purifier 1/4 Connector",
    category: "Water Purifier Accessories",
     tag: "Popular",
    price: 20,
    original: 35,
    rating: 4.3,
    reviews: 62,
    image: "/images/product17.png"
  },
  {
    id: 18,
    name: "KENT Bathroom Water Softener",
    category: "Water Softeners",
    tag: "Popular",
    price: 14400,
    original: 18000,
    rating: 4.3,
    reviews: 62,
    image: "/images/product-18.png"
  }
];

export default function Bestsellers() {
  const [active, setActive] = useState("All");
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const tabStripRef = useRef(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: 0 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api("/api/products?limit=200&sort=-createdAt")
      .then((res) => {
        if (cancelled) return;
        setSource((res.items || []).map(normalize));
      })
      .catch(() => {
        if (cancelled) return;
        setSource(fallbackBestsellers.map(normalize));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const filters = useMemo(() => {
    const cats = Array.from(
      new Set((source || []).map((p) => p.category).filter(Boolean))
    );
    return ["All", ...cats];
  }, [source]);

  const items = useMemo(() => {
    const list = source || [];
    if (active === "All") return list;
    return list.filter((b) => b.category === active);
  }, [active, source]);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  useEffect(() => {
    // Recompute after items/filter change once layout settles
    const id = setTimeout(updateArrows, 50);
    return () => clearTimeout(id);
  }, [items]);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Draggable tab strip — only enters "drag mode" once movement exceeds a threshold
  const DRAG_THRESHOLD = 5;
  const onDragStart = (e) => {
    const el = tabStripRef.current;
    if (!el) return;
    drag.current = {
      down: true,
      dragging: false,
      startX: e.pageX - el.offsetLeft,
      startScroll: el.scrollLeft,
      moved: 0,
    };
  };
  const onDragMove = (e) => {
    const el = tabStripRef.current;
    if (!el || !drag.current.down) return;
    const x = e.pageX - el.offsetLeft;
    const walk = x - drag.current.startX;
    drag.current.moved = Math.abs(walk);
    if (drag.current.moved > DRAG_THRESHOLD) {
      if (!drag.current.dragging) {
        drag.current.dragging = true;
        el.classList.add(styles.tabStripDragging);
      }
      e.preventDefault();
      el.scrollLeft = drag.current.startScroll - walk;
    }
  };
  const onDragEnd = () => {
    const el = tabStripRef.current;
    if (!el) return;
    drag.current.down = false;
    // keep .tabStripDragging until after the click phase settles so we can cancel it
    requestAnimationFrame(() => {
      el.classList.remove(styles.tabStripDragging);
      drag.current.dragging = false;
    });
  };
  const onStripClickCapture = (e) => {
    if (drag.current.dragging) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <section className={`section ${styles.section}`}>
      <div className={styles.decor} aria-hidden />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* ROW 1 — heading + view all */}
        <header className={styles.head}>
          <div>
            <span className="eyebrow">Our Products</span>
            <h2>
              Our <span className="gradient-text">Best Sellers</span> Products
            </h2>
          </div>
          <Link href="/products" className={`btn btn-primary ${styles.viewAllTop}`}>
            View All Products
          </Link>
        </header>

        {/* ROW 2 — filter pills (draggable) */}
        <div
          ref={tabStripRef}
          className={styles.tabStrip}
          role="tablist"
          aria-label="Bestseller categories"
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          onClickCapture={onStripClickCapture}
        >
          {filters.map((f) => {
            const isActive = f === active;
            return (
              <button
                key={f}
                onClick={() => setActive(f)}
                role="tab"
                aria-selected={isActive}
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* ROW 3 — carousel */}
        <div className={styles.carouselWrap}>
          <button
            onClick={() => scrollBy(-1)}
            className={`${styles.navBtn} ${styles.navPrev}`}
            aria-label="Previous"
            disabled={!canPrev}
          >
            ‹
          </button>

          <div className={styles.carousel} ref={scrollRef}>
            {loading ? (
              <p className={styles.empty}>Loading products…</p>
            ) : items.length === 0 ? (
              <p className={styles.empty}>
                No items in this category yet — check back soon.
              </p>
            ) : (
              items.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))
            )}
          </div>

          <button
            onClick={() => scrollBy(1)}
            className={`${styles.navBtn} ${styles.navNext}`}
            aria-label="Next"
            disabled={!canNext}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product: p, index }) {
  const original = Number(p.original || 0);
  const price = Number(p.price || 0);
  const discount = original > price
    ? Math.round(((original - price) / original) * 100)
    : 0;
  const rating = typeof p.rating === "number" ? p.rating : 0;
  const href = `/products/${slugify(p.name)}`;

  return (
    <Link href={href} className={styles.cardLink} aria-label={p.name}>
      <article className={styles.card} style={{ animationDelay: `${index * 60}ms` }}>
        <div className={styles.imgBox}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolveImg(p.image)} alt={p.name} loading="lazy" />
          {discount > 0 && (
            <span className={styles.discount}>{discount}% off</span>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.metaRow}>
            <span className={styles.category}>{p.category}</span>
            {rating > 0 && (
              <span className={styles.ratingBadge}>
                {rating.toFixed(1)} <b>★</b>
              </span>
            )}
          </div>
          <h3>{p.name}</h3>
          <div className={styles.price}>
            <b>₹{price.toLocaleString("en-IN")}</b>
            {original > price && (
              <span>₹{original.toLocaleString("en-IN")}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

