"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
  HiOutlineBeaker,
  HiOutlineCog6Tooth,
  HiOutlineSparkles,
  HiOutlineBuildingOffice2,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCheckBadge,
  HiChevronRight,
  HiArrowLeft,
  HiArrowRight,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineTrophy,
  HiOutlineStar,
  HiOutlinePhone,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa6";
import { services, slugifyService } from "../services-data";
import styles from "./service.module.css";

const WHATSAPP_NUMBER = "919876543210";

const ICONS = {
  wrench: HiOutlineWrenchScrewdriver,
  repair: HiOutlineArrowPath,
  shield: HiOutlineShieldCheck,
  beaker: HiOutlineBeaker,
  cog: HiOutlineCog6Tooth,
  sparkles: HiOutlineSparkles,
  building: HiOutlineBuildingOffice2,
  clipboard: HiOutlineClipboardDocumentCheck,
};

// Generic strip beneath the hero — same for every service.
const STATS = [
  { icon: <HiOutlineClock />, value: "24 hrs", label: "Avg. response time" },
  { icon: <HiOutlineUserGroup />, value: "45K+", label: "Homes served" },
  { icon: <HiOutlineTrophy />, value: "17+", label: "Years of trust" },
  { icon: <HiOutlineStar />, value: "4.9 / 5", label: "Customer rating" },
];

// "Why VRS" trust ribbon — same across services.
const TRUST = [
  {
    title: "Certified technicians",
    body: "Every VRS engineer is factory-trained and background-verified.",
  },
  {
    title: "Genuine OEM parts",
    body: "Only original manufacturer spares — every replacement warrantied.",
  },
  {
    title: "Transparent pricing",
    body: "Upfront quotes before work begins. No hidden charges, ever.",
  },
];

export default function ServiceDetail() {
  const params = useParams();
  const slug = params?.slug;

  const service = useMemo(() => {
    if (!slug) return null;
    return services.find((s) => slugifyService(s.title) === String(slug)) || null;
  }, [slug]);

  const others = useMemo(() => {
    if (!service) return services.slice(0, 3);
    return services.filter((s) => s.title !== service.title).slice(0, 3);
  }, [service]);

  if (!service) {
    return (
      <section className={styles.notFound}>
        <div className={`container ${styles.notFoundInner}`}>
          <h2>Service not found</h2>
          <p>The service you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/services" className={styles.notFoundBtn}>
            <HiArrowLeft /> Back to all services
          </Link>
        </div>
      </section>
    );
  }

  const Icon = ICONS[service.iconKey] || HiOutlineWrenchScrewdriver;
  const featureHalf = Math.ceil(service.features.length / 2);
  const featureCols = [
    service.features.slice(0, featureHalf),
    service.features.slice(featureHalf),
  ];

  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroDecor} aria-hidden />
        <div className={styles.heroGlow} aria-hidden />
        <div className={`container ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <HiChevronRight />
            <Link href="/services">Services</Link>
            <HiChevronRight />
            <span>{service.title}</span>
          </nav>

          <div className={styles.heroGrid}>
            {/* LEFT — service copy */}
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>VRS Service</span>
              <h1>{service.title}</h1>
              <p className={styles.tagline}>{service.tagline}</p>
              <p className={styles.heroBody}>{service.body}</p>

              <div className={styles.heroCtas}>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hi VRS! I'd like to book the "${service.title}" service.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.primaryCta}
                >
                  <FaWhatsapp /> Book this Service
                </a>
              </div>

              <div className={styles.heroTrust}>
                <HiOutlineShieldCheck />
                <span>Backed by a <b>3-month workmanship warranty</b></span>
              </div>
            </div>

            {/* RIGHT — big icon card */}
            <aside className={styles.heroPanel}>
              <div
                className={styles.heroPanelInner}
                style={{ background: service.accent }}
              >
                <div className={styles.heroIcon}>
                  <Icon />
                </div>
                <span className={styles.heroPanelLabel}>Certified service</span>
                <b className={styles.heroPanelTitle}>{service.title}</b>
                <em className={styles.heroPanelSub}>{service.tagline}</em>

                <div className={styles.heroPanelFoot}>
                  <span>
                    <b>4.9 ★</b>
                    <em>Rated by customers</em>
                  </span>
                  <span>
                    <b>24 hr</b>
                    <em>Avg. response</em>
                  </span>
                </div>
              </div>
              <div className={styles.heroPanelHalo} aria-hidden />
            </aside>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className={styles.statsBar}>
        <div className={`container ${styles.statsGrid}`}>
          {STATS.map((s, i) => (
            <div key={i} className={styles.stat}>
              <span className={styles.statIcon}>{s.icon}</span>
              <div>
                <b>{s.value}</b>
                <em>{s.label}</em>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className={styles.featuresSection}>
        <div className={`container ${styles.featuresInner}`}>
          <header className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>What&apos;s included</span>
            <h2>Everything covered under this service</h2>
            <p>Clear scope, no surprises — here&apos;s exactly what you get.</p>
          </header>

          <div className={styles.featureCols}>
            {featureCols.map((col, ci) => (
              <ul key={ci} className={styles.featureList}>
                {col.map((f, i) => (
                  <li key={i}>
                    <span className={styles.featureIcon}>
                      <HiOutlineCheckBadge />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      {service.process && service.process.length > 0 && (
        <section className={styles.processSection}>
          <div className={`container ${styles.processInner}`}>
            <header className={styles.sectionHead}>
              <span className={styles.sectionEyebrow}>How it works</span>
              <h2>Three simple steps to done</h2>
              <p>Straightforward, transparent, and delivered on schedule.</p>
            </header>

            <ol className={styles.processGrid}>
              {service.process.map((p, i) => (
                <li key={i} className={styles.processStep}>
                  <div className={styles.processNum}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <b>{p.title}</b>
                  <em>{p.body}</em>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ============ WHY VRS ============ */}
      <section className={styles.whySection}>
        <div className={`container ${styles.whyInner}`}>
          <header className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Why VRS</span>
            <h2>Service you can actually trust</h2>
          </header>

          <div className={styles.whyGrid}>
            {TRUST.map((t, i) => (
              <div key={i} className={styles.whyCard}>
                <span className={styles.whyIcon}>
                  <HiOutlineCheckBadge />
                </span>
                <b>{t.title}</b>
                <em>{t.body}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OTHER SERVICES ============ */}
      {others.length > 0 && (
        <section className={styles.otherSection}>
          <div className={`container ${styles.otherInner}`}>
            <header className={styles.sectionHead}>
              <span className={styles.sectionEyebrow}>More from VRS</span>
              <h2>Other services you might need</h2>
            </header>

            <div className={styles.otherGrid}>
              {others.map((s) => {
                const OtherIcon = ICONS[s.iconKey] || HiOutlineWrenchScrewdriver;
                return (
                  <Link
                    key={s.title}
                    href={`/services/${slugifyService(s.title)}`}
                    className={styles.otherCard}
                  >
                    <div
                      className={styles.otherIcon}
                      style={{ background: s.accent }}
                      aria-hidden
                    >
                      <OtherIcon />
                    </div>
                    <b>{s.title}</b>
                    <em>{s.tagline}</em>
                    <span className={styles.otherArrow}>
                      Learn more <HiArrowRight />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ FINAL CTA ============ */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaCard}`}>
          <div>
            <span className={styles.ctaEyebrow}>Ready when you are</span>
            <h2>Book your {service.title.toLowerCase()} today.</h2>
            <p>
              Talk to a VRS specialist — no obligation, no upsell. Free advice
              on whether this service is the right fit for your setup.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hi VRS! I'd like to book the "${service.title}" service.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className={styles.ctaPrimary}
            >
              <FaWhatsapp /> Book this Service
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
