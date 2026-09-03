"use client";

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
let loadPromise = null;

/**
 * Lazily inject the Razorpay Checkout script. Cached in-flight so multiple
 * "Proceed to payment" clicks don't attach the tag more than once.
 */
export function loadRazorpayScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("Razorpay is browser-only"));
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Razorpay));
      existing.addEventListener("error", () => {
        loadPromise = null;
        reject(new Error("Failed to load Razorpay Checkout"));
      });
      return;
    }
    const el = document.createElement("script");
    el.src = SCRIPT_SRC;
    el.async = true;
    el.onload = () => resolve(window.Razorpay);
    el.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Razorpay Checkout"));
    };
    document.body.appendChild(el);
  });

  return loadPromise;
}

/**
 * Opens Razorpay Checkout with the given options and resolves with the
 * payment response on success, rejects on failure or user dismiss.
 */
export async function openRazorpayCheckout({ key, orderId, amount, currency = "INR", name, description, prefill, theme }) {
  const Razorpay = await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key,
      order_id: orderId,
      amount,
      currency,
      name: name || "VRS Water Purifiers",
      description: description || "Order payment",
      prefill: prefill || {},
      theme: theme || { color: "#0f8f6b" },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });

    rzp.on("payment.failed", (response) => {
      const err = new Error(response?.error?.description || "Payment failed");
      err.details = response?.error;
      reject(err);
    });

    rzp.open();
  });
}
