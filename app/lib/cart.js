"use client";

import { useEffect, useState } from "react";
import { api, API_URL, getToken } from "./api";

const KEY = "vrs_cart";
const USER_CARTS_KEY = "vrs_carts_by_user";
const EVENT = "vrs-cart-change";

/* ---------- local cache ---------- */

function readLocal() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

/* ---------- per-user snapshots ---------- */

function readUserCarts() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USER_CARTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUserCarts(map) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_CARTS_KEY, JSON.stringify(map));
}

/** Save the currently visible cart under the given user key, then clear it. */
export function snapshotCartForUser(userKey) {
  if (!userKey) return;
  const all = readUserCarts();
  all[userKey] = readLocal();
  writeUserCarts(all);
  writeLocal([]);
}

/**
 * Load the given user's saved cart into the visible slot. If this user has
 * no snapshot yet (first-ever login on this device), the current guest cart
 * is preserved so the shopper doesn't lose what they were building.
 */
export function restoreCartForUser(userKey) {
  if (!userKey) return;
  const all = readUserCarts();
  if (Object.prototype.hasOwnProperty.call(all, userKey)) {
    writeLocal(all[userKey] || []);
  }
}

/* ---------- image resolver (shared with products page) ---------- */

export function resolveImg(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.startsWith("/uploads/")) return `${API_URL}${url}`;
  return url; // /images/xxx is served from the customer /public folder
}

/* ---------- server-shape → local-shape ---------- */

function fromServerItems(items = []) {
  return items.map((i) => {
    const p = i.product || {};
    return {
      id: p._id || i.product,
      name: p.name || "Product",
      image: p.image || "",
      category: p.category || "",
      price: i.price,
      original: i.originalPrice,
      qty: i.qty,
    };
  });
}

async function pullFromServer() {
  try {
    const res = await api("/api/cart");
    const items = fromServerItems(res.items);
    writeLocal(items);
    return items;
  } catch (err) {
    // 401 (session expired) etc. — leave local cache untouched
    return null;
  }
}

/* ---------- mutations ---------- */

export async function addToCart(product, qty = 1) {
  const q = Math.max(1, Number(qty) || 1);
  const idStr = String(product.id);
  const current = readLocal();
  const existing = current.find((c) => String(c.id) === idStr);
  const next = existing
    ? current.map((c) => (String(c.id) === idStr ? { ...c, qty: c.qty + q } : c))
    : [...current, { ...product, qty: q }];
  writeLocal(next);

  if (getToken()) {
    try {
      await api("/api/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, qty: q }),
      });
      await pullFromServer();
    } catch {
      /* leave local optimistic update in place */
    }
  }
}

export async function removeFromCart(id) {
  writeLocal(readLocal().filter((c) => String(c.id) !== String(id)));

  if (getToken()) {
    try {
      await api(`/api/cart/items/${id}`, { method: "DELETE" });
      await pullFromServer();
    } catch {
      /* silent */
    }
  }
}

export async function updateQty(id, qty) {
  const q = Number(qty);
  if (q <= 0) return removeFromCart(id);

  writeLocal(
    readLocal().map((c) => (String(c.id) === String(id) ? { ...c, qty: q } : c))
  );

  if (getToken()) {
    try {
      await api(`/api/cart/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ qty: q }),
      });
      await pullFromServer();
    } catch {
      /* silent */
    }
  }
}

export async function clearCart() {
  writeLocal([]);
  if (getToken()) {
    try {
      await api("/api/cart", { method: "DELETE" });
    } catch {
      /* silent */
    }
  }
}

/**
 * Called right after successful login — takes the guest cart in localStorage,
 * pushes each item to the backend (best-effort), then pulls the authoritative
 * merged cart back down.
 */
export async function mergeCartOnLogin() {
  if (!getToken()) return;
  const local = readLocal();
  for (const item of local) {
    try {
      await api("/api/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId: item.id, qty: item.qty }),
      });
    } catch {
      /* product id might not exist server-side — skip */
    }
  }
  await pullFromServer();
}

/* ---------- hook ---------- */

export function useCart() {
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readLocal());
    setReady(true);

    // If logged in, pull the authoritative cart from the server
    if (getToken()) pullFromServer();

    const sync = () => setCart(readLocal());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("vrs-auth-change", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("vrs-auth-change", sync);
    };
  }, []);

  const count = cart.reduce((n, c) => n + c.qty, 0);
  const subtotal = cart.reduce((n, c) => n + c.price * c.qty, 0);
  const mrp = cart.reduce((n, c) => n + (c.original || c.price) * c.qty, 0);
  const savings = Math.max(0, mrp - subtotal);

  return { cart, ready, count, subtotal, mrp, savings };
}
