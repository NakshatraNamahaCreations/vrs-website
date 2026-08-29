"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Looks up an Indian PIN code against the free public postal API. Resolves
 * with { city, state } on success. Throws with an `err.code` of:
 *   - "FORMAT"    → input isn't 6 digits
 *   - "NOT_FOUND" → API says the PIN doesn't exist
 *   - "NETWORK"   → fetch failed / CORS / API down
 */
export async function lookupPincode(pin) {
  if (!/^\d{6}$/.test(pin)) {
    const err = new Error("PIN code must be 6 digits.");
    err.code = "FORMAT";
    throw err;
  }
  let res;
  try {
    res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
  } catch (cause) {
    const err = new Error("Couldn't verify PIN right now. You can still continue.");
    err.code = "NETWORK";
    err.cause = cause;
    throw err;
  }
  const body = await res.json().catch(() => null);
  const data = Array.isArray(body) ? body[0] : null;
  if (!data || data.Status !== "Success" || !data.PostOffice?.length) {
    const err = new Error("This PIN code doesn't exist.");
    err.code = "NOT_FOUND";
    throw err;
  }
  const po = data.PostOffice[0];
  return { city: po.District, state: po.State, country: po.Country };
}

/**
 * usePincodeLookup — fires a lookup whenever `pin` becomes a full 6-digit
 * string. Debounced so quick edits don't spam the API. `onResolved(result)`
 * runs once per successful lookup so the caller can auto-fill fields.
 *
 * status: "idle" | "checking" | "valid" | "invalid"
 *   - "invalid" is only used for definitive "PIN doesn't exist" answers.
 *   - Network errors return to "idle" so the user isn't blocked.
 */
export function usePincodeLookup(pin, { onResolved, debounceMs = 300 } = {}) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const requestId = useRef(0);
  const resolvedRef = useRef(onResolved);
  resolvedRef.current = onResolved;

  useEffect(() => {
    if (!/^\d{6}$/.test(pin)) {
      setStatus("idle");
      setMessage("");
      return;
    }
    const id = ++requestId.current;
    setStatus("checking");
    setMessage("");
    const timer = setTimeout(() => {
      lookupPincode(pin)
        .then((res) => {
          if (id !== requestId.current) return;
          setStatus("valid");
          setMessage(`${res.city}, ${res.state}`);
          resolvedRef.current?.(res);
        })
        .catch((err) => {
          if (id !== requestId.current) return;
          if (err.code === "NOT_FOUND") {
            setStatus("invalid");
            setMessage(err.message);
          } else {
            // Network/CORS/malformed — don't block the user.
            setStatus("idle");
            setMessage("");
          }
        });
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [pin, debounceMs]);

  return { status, message };
}
