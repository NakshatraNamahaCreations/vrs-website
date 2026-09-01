"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { HiXMark, HiMagnifyingGlass, HiArrowRight } from "react-icons/hi2";
import { api } from "../lib/api";
import { resolveImg } from "../lib/cart";
import { slugify } from "../products/data";
import styles from "./SearchOverlay.module.css";

export default function SearchOverlay({ open, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [source, setSource] = useState(null);
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Fetch catalogue when the overlay first opens (avoids blocking initial nav render)
  useEffect(() => {
    if (!open || source) return;
    let cancelled = false;
    api("/api/products?limit=500")
      .then((res) => {
        if (!cancelled) setSource(res.items || []);
      })
      .catch(() => !cancelled && setSource([]));
    return () => { cancelled = true; };
  }, [open, source]);

  // Reset query and focus the input each time the overlay opens.
  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!source) return [];
    const query = q.trim().toLowerCase();
    if (!query) return source.slice(0, 8);
    return source
      .filter((p) => {
        const hay = `${p.name || ""} ${p.category || ""}`.toLowerCase();
        return hay.includes(query);
      })
      .slice(0, 20);
  }, [q, source]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Search products">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchBar}>
          <HiMagnifyingGlass className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search purifiers, spares, brands…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close search"
          >
            <HiXMark />
          </button>
        </div>

        <div className={styles.body}>
          {source === null ? (
            <p className={styles.hint}>Loading catalogue…</p>
          ) : results.length === 0 ? (
            <p className={styles.hint}>
              No products match “{q.trim()}”. Try a different keyword or browse the{" "}
              <Link href="/products" onClick={onClose}>full catalogue</Link>.
            </p>
          ) : (
            <>
              {!q.trim() && (
                <span className={styles.sectionLabel}>Popular right now</span>
              )}
              <ul className={styles.results}>
                {results.map((p) => {
                  const price = Number(p.price || 0);
                  const original = Number(p.originalPrice || p.original || 0);
                  return (
                    <li key={p._id || p.id}>
                      <Link
                        href={`/products/${slugify(p.name)}`}
                        className={styles.result}
                        onClick={onClose}
                      >
                        <span className={styles.thumb}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={resolveImg(p.image)} alt="" />
                        </span>
                        <div className={styles.info}>
                          <em className={styles.category}>{p.category}</em>
                          <b>{p.name}</b>
                          <div className={styles.price}>
                            <span>₹{price.toLocaleString("en-IN")}</span>
                            {original > price && (
                              <em>₹{original.toLocaleString("en-IN")}</em>
                            )}
                          </div>
                        </div>
                        <HiArrowRight className={styles.arrow} />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link href="/products" onClick={onClose} className={styles.viewAll}>
                View full catalogue <HiArrowRight />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
