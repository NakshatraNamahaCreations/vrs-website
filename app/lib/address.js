"use client";

import { useEffect, useState } from "react";
import { api, getToken } from "./api";

const GUEST_KEY = "vrs_checkout_address";
const CACHE_KEY = "vrs_addresses";
const USER_ADDRESSES_KEY = "vrs_addresses_by_user";
const EVENT = "vrs-address-change";

/* ---------- local cache helpers ---------- */

function readCache() {
  if (typeof window === "undefined") return [];
  try {
    if (getToken()) {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? [{ _id: "guest", ...JSON.parse(raw) }] : [];
  } catch {
    return [];
  }
}

function writeCache(list) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

function writeGuest(addr) {
  if (typeof window === "undefined") return;
  if (addr) localStorage.setItem(GUEST_KEY, JSON.stringify(addr));
  else localStorage.removeItem(GUEST_KEY);
  window.dispatchEvent(new Event(EVENT));
}

/* ---------- per-user snapshots ---------- */

function readUserAddresses() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USER_ADDRESSES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUserAddressesMap(map) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_ADDRESSES_KEY, JSON.stringify(map));
}

/** Save the current visible address under the given user key, then clear it. */
export function snapshotAddressForUser(userKey) {
  if (!userKey || typeof window === "undefined") return;
  const all = readUserAddresses();
  const raw = localStorage.getItem(GUEST_KEY);
  all[userKey] = raw ? JSON.parse(raw) : null;
  writeUserAddressesMap(all);
  writeGuest(null);
}

/**
 * Load the given user's saved address into the visible slot. If this user
 * has no snapshot yet (first-ever login on this device), the current guest
 * address is preserved so the shopper doesn't lose what they entered.
 */
export function restoreAddressForUser(userKey) {
  if (!userKey || typeof window === "undefined") return;
  const all = readUserAddresses();
  if (Object.prototype.hasOwnProperty.call(all, userKey)) {
    writeGuest(all[userKey] || null);
  }
}

/* ---------- server sync ---------- */

export async function fetchAddresses() {
  if (!getToken()) return null;
  try {
    const res = await api("/api/user/profile");
    const list = res.user?.addresses || [];
    writeCache(list);
    return list;
  } catch {
    return null;
  }
}

/**
 * Save any pending guest address into the freshly-logged-in user's account,
 * then pull the merged list back.
 */
export async function mergeAddressOnLogin() {
  if (!getToken()) return;
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (raw) {
      const guest = JSON.parse(raw);
      await api("/api/user/addresses", {
        method: "POST",
        body: JSON.stringify({ ...guest, isDefault: true }),
      });
      localStorage.removeItem(GUEST_KEY);
    }
  } catch {
    /* silent */
  }
  await fetchAddresses();
}

/* ---------- mutations ---------- */

export async function addAddress(payload) {
  if (!getToken()) {
    // Guest — only a single stored address
    console.log("[address] addAddress: no token, using guest branch");
    writeGuest(payload);
    return [{ _id: "guest", ...payload }];
  }
  // Do NOT force isDefault: true — the backend auto-defaults if it's the
  // first address for the user. Subsequent additions stay non-default until
  // the user promotes them via setDefaultAddress().
  const res = await api("/api/user/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log("[address] addAddress response:", res, "count:", res?.addresses?.length);
  writeCache(res.addresses || []);
  return res.addresses;
}

export async function updateAddress(id, payload) {
  if (!getToken() || id === "guest") {
    writeGuest(payload);
    return [{ _id: "guest", ...payload }];
  }
  const res = await api(`/api/user/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  writeCache(res.addresses || []);
  return res.addresses;
}

export async function setDefaultAddress(id) {
  if (!getToken() || id === "guest") return readCache();
  const res = await api(`/api/user/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isDefault: true }),
  });
  writeCache(res.addresses || []);
  return res.addresses;
}

export async function removeAddress(id) {
  if (!getToken() || id === "guest") {
    writeGuest(null);
    return [];
  }
  const res = await api(`/api/user/addresses/${id}`, { method: "DELETE" });
  writeCache(res.addresses || []);
  return res.addresses;
}

/* ---------- hook ---------- */

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAddresses(readCache());
    setReady(true);
    if (getToken()) fetchAddresses();

    const sync = () => setAddresses(readCache());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("vrs-auth-change", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("vrs-auth-change", sync);
    };
  }, []);

  const defaultAddress =
    addresses.find((a) => a.isDefault) || addresses[0] || null;

  return { addresses, defaultAddress, ready };
}
