"use client";

import { useEffect, useState } from "react";
import { api, getToken } from "./api";

const KEY = "vrs_orders";
const EVENT = "vrs-orders-change";

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

function writeLocal(orders) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(EVENT));
}

function makeOrderId() {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${Date.now().toString(36)}${rand}`;
}

/* ---------- server sync ---------- */

async function pullFromServer() {
  if (!getToken()) return null;
  try {
    const res = await api("/api/orders");
    const items = res.items || [];
    writeLocal(items);
    return items;
  } catch {
    // 401 or offline — keep local cache untouched
    return null;
  }
}

/* ---------- mutations ---------- */

/**
 * Places an order. When logged in, POSTs to the backend — the server rebuilds
 * the order from the authoritative server-side cart and returns the persisted
 * document. Otherwise falls back to a local-only mock order so guests can
 * still complete the checkout flow.
 */
export async function placeOrder({
  shippingAddress,
  items = [],
  subtotal = 0,
  delivery = 0,
  total = 0,
  savings = 0,
  paymentMethod = "COD",
  promoCode = "",
  discount = 0,
}) {
  if (getToken()) {
    const order = await api("/api/orders", {
      method: "POST",
      body: JSON.stringify({ shippingAddress, paymentMethod, promoCode, discount }),
    });
    // Refresh local cache so useOrders() picks it up immediately.
    await pullFromServer();
    return order;
  }

  const order = {
    _id: makeOrderId(),
    orderStatus: "placed",
    createdAt: new Date().toISOString(),
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      image: i.image,
      category: i.category,
      qty: i.qty,
      price: i.price,
      original: i.original,
    })),
    shippingAddress: shippingAddress
      ? {
          fullName: shippingAddress.fullName || "",
          phone: shippingAddress.phone || "",
          line1: shippingAddress.line1 || "",
          line2: shippingAddress.line2 || "",
          city: shippingAddress.city || "",
          state: shippingAddress.state || "",
          pincode: shippingAddress.pincode || "",
          landmark: shippingAddress.landmark || "",
        }
      : null,
    subtotal,
    delivery,
    total,
    savings,
    paymentMethod,
  };

  writeLocal([order, ...readLocal()]);
  return order;
}

export async function fetchOrders() {
  if (getToken()) {
    const items = await pullFromServer();
    if (items) return items;
  }
  return readLocal();
}

/**
 * useOrders — reactive hook. Reads orders from localStorage and, when logged
 * in, pulls the authoritative list from the backend. Refreshes on
 * `vrs-orders-change`, cross-tab `storage` events, and auth changes.
 */
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrders(readLocal());
    setReady(true);

    if (getToken()) pullFromServer();

    const sync = () => setOrders(readLocal());
    const onAuth = () => {
      sync();
      if (getToken()) pullFromServer();
    };
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("vrs-auth-change", onAuth);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("vrs-auth-change", onAuth);
    };
  }, []);

  return { orders, ready };
}
