"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin, HiOutlineClock, HiOutlineChatBubbleLeftRight, HiArrowRight } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa6";
import { api } from "../lib/api";
import styles from "./contact.module.css";

const cards = [
  {
    icon: "phone",
    label: "Call us",
    primary: "+91 9008155065",
    href: "tel:+919008155065",
    sub: "Mon – Sat · 9am to 8pm",
  },
  {
    icon: "whatsapp",
    label: "WhatsApp",
    primary: "+91 9008155065",
    href: "https://wa.me/919008155065",
    sub: "Instant replies · 24 / 7",
    external: true,
  },
  {
    icon: "email",
    label: "Email us",
    primary: "hello@vrswaterpurifiers.in",
    href: "mailto:hello@vrswaterpurifiers.in",
    sub: "We reply within 6 hours",
  },
  {
    icon: "location",
    label: "Visit us",
    primary: "RR Nagar, Bangalore",
    href: "https://maps.google.com/?q=RR+Nagar+Bangalore",
    sub: "Karnataka, India",
    external: true,
  },
];

const iconMap = {
  phone: <HiOutlinePhone />,
  email: <HiOutlineEnvelope />,
  location: <HiOutlineMapPin />,
  whatsapp: <HiOutlineChatBubbleLeftRight />,
};

export default function ContactPage() {
  const [state, setState] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const phone = state.phone.replace(/\D/g, "").slice(-10);
    if (!state.name.trim()) return setError("Please enter your name.");
    if (!/^\d{10}$/.test(phone)) return setError("Enter a valid 10-digit mobile number.");

    setSubmitting(true);
    try {
      await api("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: state.name.trim(),
          phone,
          email: state.email.trim(),
          message: state.message.trim(),
        }),
      });
      setSent(true);
      setState({ name: "", phone: "", email: "", message: "" });
      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      setError(err.message || "Couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroDecor} aria-hidden />
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>
            Contact Us <em />
          </span>
          <h1>
            Let&apos;s talk about<br />
            your <span className={styles.hilite}>water.</span>
          </h1>
          <p>
            Free on-site TDS check, honest product advice, and transparent
            quotes. Reach us any way you like — we&apos;re here Monday to
            Saturday, 9 am to 8 pm.
          </p>
          <div className={styles.heroChips}>
            <a href="tel:+919008155065" className={styles.heroChip}>
              <HiOutlinePhone /> +91 9008155065
            </a>
            <a href="https://wa.me/919008155065" target="_blank" rel="noreferrer" className={`${styles.heroChip} ${styles.heroChipWa}`}>
              <FaWhatsapp /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ============ CONTACT INFO CARDS ============ */}
      <section className={styles.infoSection}>
        <div className="container">
          <div className={styles.infoGrid}>
            {cards.map((c) => {
              const Wrapper = c.external ? "a" : "a";
              return (
                <Wrapper
                  key={c.label}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noreferrer" : undefined}
                  className={`${styles.infoCard} ${c.accent ? styles.infoCardAccent : ""}`}
                >
                  <span className={styles.infoIcon}>{iconMap[c.icon]}</span>
                  <span className={styles.infoLabel}>{c.label}</span>
                  <b>{c.primary}</b>
                  <em>{c.sub}</em>
                  <span className={styles.infoArrow}>
                    <HiArrowRight />
                  </span>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ MAIN — FORM + SIDE INFO ============ */}
      <section className={styles.main}>
        <div className={`container ${styles.mainGrid}`}>
          {/* LEFT — Form */}
          <div className={styles.formWrap}>
            <div className={styles.formHead}>
              <span className={styles.eyebrow}>
                Send a message <em />
              </span>
              <h2>
                Tell us what you need.<br />
                We&apos;ll <span className={styles.hilite}>get back today.</span>
              </h2>
              <p>
                Share a few details and our team will call or email you within
                the same working day with an honest recommendation.
              </p>
            </div>

            <form onSubmit={onSubmit} className={styles.form}>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Your name</span>
                  <input name="name" required value={state.name} onChange={onChange} placeholder="Full name" />
                </label>
                <label className={styles.field}>
                  <span>Phone number</span>
                  <input name="phone" type="tel" required value={state.phone} onChange={onChange} placeholder="+91 …" />
                </label>
              </div>

              <label className={styles.field}>
                <span>Email address</span>
                <input name="email" type="email" required value={state.email} onChange={onChange} placeholder="you@example.com" />
              </label>

              <label className={styles.field}>
                <span>Message (optional)</span>
                <textarea
                  name="message"
                  rows={4}
                  value={state.message}
                  onChange={onChange}
                  placeholder="Tell us about your water problem, purifier model, or the area you live in…"
                />
              </label>

              <div className={styles.formFoot}>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  <HiOutlineChatBubbleLeftRight />
                  {submitting ? "Sending…" : "Send message"}
                </button>
                {sent && (
                  <span className={styles.success}>
                    ✓ Thanks — we&apos;ll be in touch shortly.
                  </span>
                )}
                {error && !sent && (
                  <span className={styles.success} style={{ color: "#e05252" }}>
                    {error}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT — Side panel */}
          <aside className={styles.side}>
            <div className={styles.sideCard}>
              <div className={styles.sideRow}>
                <span className={styles.sideIcon}><HiOutlineClock /></span>
                <div>
                  <b>Business hours</b>
                  <p>Monday to Saturday<br />9:00 am – 8:00 pm</p>
                  <p className={styles.sideMuted}>Sunday: emergency only</p>
                </div>
              </div>

              <div className={styles.sideRow}>
                <span className={styles.sideIcon}><HiOutlineMapPin /></span>
                <div>
                  <b>Workshop &amp; office</b>
                  <p>VRS Water Purifiers<br />RR Nagar, Bangalore<br />Karnataka — India</p>
                </div>
              </div>

              <div className={styles.sideRow}>
                <span className={styles.sideIcon}><HiOutlinePhone /></span>
                <div>
                  <b>Talk to a specialist</b>
                  <p>
                    <a href="tel:+919008155065">+91 9008155065</a><br />
                    <a href="mailto:hello@vrswaterpurifiers.in">hello@vrswaterpurifiers.in</a>
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.brandsBlock}>
              <span className={styles.brandsLabel}>Brands we service</span>
              <div className={styles.brandsList}>
                {["Aquaguard", "Kent", "AO Smith", "Livpure", "Pureit", "Blue Star", "Havells", "Eureka Forbes"].map((b) => (
                  <span key={b} className={styles.brandChip}>{b}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

    </>
  );
}
