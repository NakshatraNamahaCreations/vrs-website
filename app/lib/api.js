"use client";

/**
 * Thin fetch wrapper that:
 *  - prefixes NEXT_PUBLIC_API_URL
 *  - attaches the Bearer JWT (if we have one) OR falls back to sending the
 *    logged-in phone number in `x-vrs-phone` (the backend's resolveUser
 *    middleware upserts the user from that header when no JWT is present)
 *  - parses JSON and throws a real Error on non-2xx responses
 */

export const API_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:5000";

const TOKEN_KEY = "vrs_token";
const SESSION_KEY = "vrs_session";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/** Pull the 10-digit phone from the local mock session, if any. */
function getSessionPhone() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const phone = String(session?.phone || "").trim();
    return /^\d{10}$/.test(phone) ? phone : null;
  } catch {
    return null;
  }
}

export async function api(path, options = {}) {
  const token = getToken();
  const phone = token ? null : getSessionPhone();
  const isForm = options.body instanceof FormData;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(phone && { "x-vrs-phone": phone }),
        ...options.headers,
      },
    });
  } catch (err) {
    // Network / CORS / server-not-running
    const wrapped = new Error(
      "Can't reach the server. Please check your connection and try again."
    );
    wrapped.cause = err;
    wrapped.offline = true;
    throw wrapped;
  }

  const raw = await res.text();
  let data = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { error: raw };
    }
  }

  if (!res.ok) {
    const error = new Error(data.error || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}
