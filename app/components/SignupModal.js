"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiXMark,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiCheck,
  HiArrowRightCircle,
} from "react-icons/hi2";
import { signup } from "../lib/auth";
import styles from "./LoginModal.module.css";

export default function SignupModal({ open, onClose, onSwitchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setForm({ name: "", email: "", phone: "", password: "" });
        setShowPassword(false);
        setLoading(false);
        setSuccess(false);
        setError("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Live filters — reject disallowed characters as the user types so an
  // invalid character never lands in the field in the first place.
  const onNameChange = (raw) => {
    // Letters, spaces, hyphens and apostrophes (for names like O'Brien /
    // Mary-Jane). No digits, no other punctuation.
    set("name", raw.replace(/[^A-Za-z\s'-]/g, ""));
  };
  const onPhoneChange = (raw) => {
    set("phone", raw.replace(/\D/g, "").slice(0, 10));
  };
  const onEmailChange = (raw) => {
    // Emails have no whitespace; strip on paste.
    set("email", raw.replace(/\s+/g, ""));
  };

  // Field-level status derived from the current form values — used for the
  // inline hint under each input and the submit button's disabled state.
  const nameValid = form.name.trim().length >= 2;
  const emailValid = /^\S+@\S+\.\S+$/.test(form.email.trim());
  const phoneValid = form.phone === "" || form.phone.length === 10;
  const passwordValid = form.password.length >= 8;
  const formValid = nameValid && emailValid && phoneValid && passwordValid;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const email = form.email.trim().toLowerCase();
    const name = form.name.trim();
    const phone = form.phone.replace(/\D/g, "").slice(-10);

    if (!name) return setError("Enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (phone && phone.length !== 10) return setError("Phone must be a 10-digit number.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");

    setLoading(true);
    try {
      await signup({ name, email, phone, password: form.password });
      setSuccess(true);
      // Hand off to the login modal so the user signs in with the credentials
      // they just created (backend response's JWT is intentionally discarded
      // so a real login happens).
      setTimeout(() => {
        onClose();
        setTimeout(() => onSwitchToLogin?.(), 260);
      }, 1200);
    } catch (err) {
      setError(err.message || "Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    onClose();
    setTimeout(() => onSwitchToLogin?.(), 260);
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Create an account">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <HiXMark />
        </button>

        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>VRS</span>
          </div>
          <div>
            <b>VRS Water Purifiers</b>
            <span>Create your account</span>
          </div>
        </div>

        {success ? (
          <div className={styles.success}>
            <div className={styles.successBadge}>
              <HiCheck />
            </div>
            <b>Account created</b>
            <p>Redirecting you to log in…</p>
          </div>
        ) : (
          <form onSubmit={submit} className={styles.body}>
            <div>
              <h3>Join VRS Water Purifiers</h3>
              <p>It takes less than a minute.</p>
            </div>

            <label className={styles.field}>
              <span>Full name</span>
              <div className={styles.inputWrap}>
                <HiOutlineUser className={styles.inputIcon} />
                <input
                  type="text"
                  autoComplete="name"
                  autoFocus
                  value={form.name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              {form.name && !nameValid && (
                <em className={styles.fieldHint}>Enter at least 2 letters.</em>
              )}
            </label>

            <label className={styles.field}>
              <span>Email address</span>
              <div className={styles.inputWrap}>
                <HiOutlineEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              {form.email && !emailValid && (
                <em className={styles.fieldHint}>Enter a valid email like name@example.com.</em>
              )}
            </label>

            <label className={styles.field}>
              <span>Phone <em style={{ color: "var(--muted, #6b7c88)", fontStyle: "normal", fontWeight: 400 }}>(optional)</em></span>
              <div className={styles.inputWrap}>
                <HiOutlinePhone className={styles.inputIcon} />
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  placeholder="10-digit mobile"
                />
              </div>
              {form.phone && form.phone.length < 10 && (
                <em className={styles.fieldHint}>{form.phone.length} / 10 digits</em>
              )}
            </label>

            <label className={styles.field}>
              <span>Password <em style={{ color: "var(--muted, #6b7c88)", fontStyle: "normal", fontWeight: 400 }}>(at least 8 characters)</em></span>
              <div className={styles.inputWrap}>
                <HiOutlineLockClosed className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Choose a strong password"
                />
                <button
                  type="button"
                  className={styles.inputAction}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
              {form.password && !passwordValid && (
                <em className={styles.fieldHint}>{form.password.length} / 8 characters — add {8 - form.password.length} more.</em>
              )}
            </label>

            {error && <span className={styles.error}>{error}</span>}

            <button
              type="submit"
              className={styles.submit}
              disabled={loading || !formValid}
              title={!formValid ? "Fill in every field correctly to continue" : undefined}
            >
              {loading ? "Creating account…" : (<><HiArrowRightCircle /> Create account</>)}
            </button>

            <div className={styles.switchRow}>
              <span>Already have an account?</span>
              <button type="button" className={styles.switchBtn} onClick={goToLogin}>
                Log in
              </button>
            </div>
          </form>
        )}

        <p className={styles.terms}>
          By continuing, you agree to our <a href="#terms">Terms</a> &amp; <a href="#privacy">Privacy Policy</a>.
        </p>
      </div>
    </div>,
    document.body
  );
}
