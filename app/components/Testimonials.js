"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    name: "Priya Ramesh",
    role: "Homemaker, Chennai",
    quote:
      "Water tastes fresh and light. The alkaline cartridge made a real difference for my kids' hydration.",
    avatar: "PR",
    rating: 5,
  },
  {
    name: "Dr. Karthik S.",
    role: "Dentist, Coimbatore",
    quote:
      "Installed the commercial 100 LPH unit at my clinic. Clean install, zero downtime and prompt support from the VRS team.",
    avatar: "KS",
    rating: 5,
  },
  {
    name: "Meera Iyer",
    role: "Café Owner, Bangalore",
    quote:
      "The copper purifier is a stunning piece in our kitchen and the water taste has our customers hooked. Reorders happen every quarter.",
    avatar: "MI",
    rating: 5,
  },
  {
    name: "Rahul Menon",
    role: "IT Manager, Kochi",
    quote:
      "Booked a demo online and got a same-day visit. The TDS test was thorough and the recommendation was spot on. No upselling.",
    avatar: "RM",
    rating: 5,
  },
  {
    name: "Sneha Reddy",
    role: "Doctor, Hyderabad",
    quote:
      "Been buying spares from VRS for three years. Genuine parts, delivered on time, and their WhatsApp support is unbelievably quick.",
    avatar: "SR",
    rating: 5,
  },
  {
    name: "Ganesh Pillai",
    role: "Restaurant Owner, Madurai",
    quote:
      "Switched from a competitor to VRS's Blue Star commercial plant. Water quality and pressure improved instantly. Wish I'd switched sooner.",
    avatar: "GP",
    rating: 4,
  },
];

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <header className={styles.head}>
          <div>
            <span className="eyebrow">Loved by families &amp; businesses</span>
            <h2>
              The people who drink from<br />
              <span className="gradient-text">VRS every single day.</span>
            </h2>
          </div>
          <div className={styles.navGroup}>
            <button
              onClick={() => scrollBy(-1)}
              className={styles.navBtn}
              aria-label="Previous testimonial"
              disabled={!canPrev}
            >
              ‹
            </button>
            <button
              onClick={() => scrollBy(1)}
              className={styles.navBtn}
              aria-label="Next testimonial"
              disabled={!canNext}
            >
              ›
            </button>
          </div>
        </header>

        <div className={styles.carousel} ref={scrollRef}>
          {testimonials.map((t, i) => (
            <article
              key={t.name}
              className={styles.card}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className={styles.cardTop}>
                <span className={styles.quote} aria-hidden>&ldquo;</span>
                <span className={styles.stars} aria-label={`${t.rating} out of 5 stars`}>
                  {"★".repeat(t.rating)}
                  <em>{"★".repeat(5 - t.rating)}</em>
                </span>
              </div>
              <p className={styles.body}>{t.quote}</p>
              <div className={styles.person}>
                <span className={styles.avatar}>{t.avatar}</span>
                <div>
                  <b>{t.name}</b>
                  <em>{t.role}</em>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
