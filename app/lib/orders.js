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
 * Places an order. When logged in, POSTs to the backend — the server creates
 * a pending order AND a matching Razorpay order in one call, returning both.
 * Guests can't pay online, so they get a local-only mock order and are
 * expected to log in before actually completing checkout.
 */
export async function placeOrder({
  shippingAddress,
  items = [],
  subtotal = 0,
  delivery = 0,
  total = 0,
  savings = 0,
  paymentMethod = "RAZORPAY",
  promoCode = "",
  discount = 0,
}) {
  if (getToken()) {
    const res = await api("/api/orders", {
      method: "POST",
      body: JSON.stringify({ shippingAddress, paymentMethod, promoCode, discount }),
    });
    // Refresh local cache so useOrders() picks up the new pending order.
    await pullFromServer();
    return res; // { order, razorpay: { key, orderId, amount, currency } }
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
  return { order, razorpay: null };
}

/**
 * Verifies a completed Razorpay payment. Backend re-checks the HMAC signature
 * against the server-side secret and marks the order as paid.
 */
export async function verifyRazorpayPayment(orderId, payload) {
  const res = await api(`/api/orders/${orderId}/verify-payment`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await pullFromServer();
  return res;
}

/**
 * Reports a Razorpay failure or dismissed modal so the backend can flip the
 * order's paymentStatus to "failed". Best-effort — the frontend still
 * navigates to /payment-failed regardless of whether this succeeds.
 */
export async function markRazorpayFailed(orderId) {
  try {
    await api(`/api/orders/${orderId}/payment-failed`, { method: "POST" });
    await pullFromServer();
  } catch { /* silent */ }
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
