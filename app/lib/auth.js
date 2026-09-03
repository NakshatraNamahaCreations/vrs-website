"use client";

import { useEffect, useState } from "react";
import { api, setToken } from "./api";
import { mergeCartOnLogin, snapshotCartForUser, restoreCartForUser } from "./cart";
import { mergeAddressOnLogin, snapshotAddressForUser, restoreAddressForUser } from "./address";

const KEY = "vrs_session";

/* ---------- backend calls ---------- */

/**
 * Sign in an existing user with email + password. Stores JWT + session and
 * runs the guest cart/address merge.
 */
export async function login(email, password) {
  const res = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(res.token);
  writeSession(res.user);
  try { await mergeCartOnLogin(); } catch { /* silent — cart merge is best-effort */ }
  try { await mergeAddressOnLogin(); } catch { /* silent — address merge is best-effort */ }
  return res.user;
}

/**
 * Create a new account. Does NOT auto-authenticate — the UI redirects the
 * user to the login modal after signup, so the JWT returned here is dropped.
 * Guest cart/address merge happens on the subsequent login instead.
 */
export async function signup({ email, password, name = "", phone = "" }) {
  const res = await api("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name, phone }),
  });
  return res.user;
}

/**
 * Request a fresh OTP for the given phone.
 * Returns { ok, expiresAt, devOtp? } from the backend.
 * (Legacy OTP flow — kept in case any client still calls it.)
 */
export async function requestOtp(phone) {
  return api("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

/**
 * Verify OTP; on success stores the JWT + user profile locally
 * and returns the user object.
 */
export async function verifyOtp(phone, otp) {
  const res = await api("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ phone, otp }),
  });
  setToken(res.token);
  writeSession(res.user);
  try { await mergeCartOnLogin(); } catch { /* silent — cart merge is best-effort */ }
  try { await mergeAddressOnLogin(); } catch { /* silent — address merge is best-effort */ }
  return res.user;
}

/**
 * Dev-only login — skips OTP, issues a JWT straight from a phone number.
 * Use during development so we don't need to route real SMS.
 */
export async function devLogin(phone) {
  const res = await api("/api/auth/dev-login", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
  setToken(res.token);
  writeSession(res.user);
  try { await mergeCartOnLogin(); } catch { /* silent */ }
  try { await mergeAddressOnLogin(); } catch { /* silent */ }
  return res.user;
}

/**
 * Fetches /api/auth/me and refreshes the local session if the token is valid.
 * Safe to call on mount — silently clears session on failure.
 */
export async function refreshSession() {
  try {
    const { user } = await api("/api/auth/me");
    writeSession(user);
    return user;
  } catch (err) {
    if (err.status === 401) clearSession();
    return null;
  }
}

/* ---------- local session store ---------- */

function writeSession(user) {
  if (typeof window === "undefined") return;
  // Keep .phone at the root for backward compatibility with the older mock
  const legacy = { phone: user?.phone, ...user, loggedInAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(legacy));
  window.dispatchEvent(new Event("vrs-auth-change"));
}

export function saveSession(phone) {
  // Legacy helper — kept for callers that still bypass the backend.
  // Restore the user's previously-saved cart and address (if any) so their
  // basket and shipping details reappear on this device.
  writeSession({ phone });
  if (phone) {
    restoreCartForUser(phone);
    restoreAddressForUser(phone);
  }
}

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  // Snapshot the current user's cart + address into a per-user store BEFORE
  // clearing the session, so re-logging in as the same user restores them.
  const prev = getSession();
  const phone = prev?.phone;
  if (phone) {
    snapshotCartForUser(phone);
    snapshotAddressForUser(phone);
  }
  localStorage.removeItem(KEY);
  setToken(null);
  window.dispatchEvent(new Event("vrs-auth-change"));
}

export function useSession() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setReady(true);
    const sync = () => setSession(getSession());
    window.addEventListener("vrs-auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("vrs-auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { session, ready, isLoggedIn: !!session };
}
