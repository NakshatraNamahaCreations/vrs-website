"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark, HiOutlinePhone, HiOutlinePaperAirplane, HiCheck, HiArrowLeft } from "react-icons/hi2";
import { requestOtp, verifyOtp } from "../lib/auth";
import styles from "./LoginModal.module.css";

export default function LoginModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [mounted, setMounted] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => setMounted(true), []);

  // reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(1);
        setPhone("");
        setOtp(["", "", "", "", "", ""]);
        setLoading(false);
        setSuccess(false);
        setError("");
        setDevOtp("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // esc + lock scroll
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

  const sendOtp = async (e) => {
    e?.preventDefault?.();
    setError("");
    setDevOtp("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await requestOtp(phone);
      // Backend echoes the OTP in dev mode so we can log in without SMS.
      if (res?.devOtp) setDevOtp(String(res.devOtp));
      setStep(2);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch (err) {
      setError(err.message || "Couldn't send the OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const onOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;
    e.preventDefault();
    const next = paste.split("").concat(["", "", "", "", "", ""]).slice(0, 6);
    setOtp(next);
    otpRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const submitVerify = async (e) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      // verifyOtp stores the JWT, writes the session, and merges the guest
      // cart + address into the freshly-logged-in account.
      await verifyOtp(phone, code);
      setSuccess(true);
      setTimeout(() => onClose(), 1600);
    } catch (err) {
      setError(err.message || "That OTP didn't work. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Login">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <HiXMark />
        </button>

        {/* header */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>VRS</span>
          </div>
          <div>
            <b>VRS Water Purifiers</b>
            <span>Secure Login</span>
          </div>
        </div>

        {/* progress */}
        <div className={styles.progress}>
          <span className={step >= 1 ? styles.progressActive : ""} />
          <span className={step >= 2 ? styles.progressActive : ""} />
        </div>

        {/* body */}
        {success ? (
          <div className={styles.success}>
            <div className={styles.successBadge}>
              <HiCheck />
            </div>
            <b>Login successful</b>
            <p>Welcome back to VRS Water Purifiers.</p>
          </div>
        ) : step === 1 ? (
          <form onSubmit={sendOtp} className={styles.body}>
            <div>
              <h3>Login with your mobile number</h3>
              <p>We&apos;ll send a 6-digit OTP to verify.</p>
            </div>

            <label className={styles.field}>
              <span>Mobile number</span>
              <div className={styles.phoneRow}>
                <span className={styles.prefix}>
                  <HiOutlinePhone /> +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  autoFocus
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Mobile number"
                />
              </div>
            </label>

            {error && <span className={styles.error}>{error}</span>}

            <button type="submit" className={styles.submit} disabled={loading || phone.length < 10}>
              {loading ? "Sending…" : (<><HiOutlinePaperAirplane /> Send OTP</>)}
            </button>
          </form>
        ) : (
          <form onSubmit={submitVerify} className={styles.body}>
            <div>
              <h3>Enter the OTP</h3>
              <p>
                We sent a code to <b>+91 {phone}</b>.{" "}
                <button type="button" className={styles.editLink} onClick={() => setStep(1)}>
                  <HiArrowLeft /> Change
                </button>
              </p>
            </div>

            <div className={styles.otpRow} onPaste={onOtpPaste}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => onOtpChange(i, e.target.value)}
                  onKeyDown={(e) => onOtpKey(i, e)}
                  className={styles.otpBox}
                />
              ))}
            </div>

            {devOtp && (
              <span className={styles.error} style={{ color: "var(--muted)" }}>
                Dev OTP: <b>{devOtp}</b>
              </span>
            )}

            {error && <span className={styles.error}>{error}</span>}

            <button type="submit" className={styles.submit} disabled={loading || otp.join("").length !== 6}>
              {loading ? "Verifying…" : (<><HiCheck /> Verify &amp; Login</>)}
            </button>

            <button type="button" className={styles.resend} onClick={sendOtp} disabled={loading}>
              Didn&apos;t get it? <b>Resend OTP</b>
            </button>
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
