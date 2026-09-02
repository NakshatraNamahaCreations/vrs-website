import Link from "next/link";
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
  HiOutlineBeaker,
  HiOutlineCheckBadge,
  HiArrowRight,
} from "react-icons/hi2";
import styles from "./page.module.css";
import Bestsellers from "./components/Bestsellers";
import Testimonials from "./components/Testimonials";
import ShopByCategory from "./components/ShopByCategory";
import { services as siteServices, slugifyService } from "./services/services-data";

const SERVICE_ICONS = {
  wrench: HiOutlineWrenchScrewdriver,
  repair: HiOutlineArrowPath,
  shield: HiOutlineShieldCheck,
  beaker: HiOutlineBeaker,
};

const usps = [
  {
    title: "12-Stage Purification",
    text: "RO + UV + UF + Alkaline + Copper — the most complete purification stack for Indian water quality.",
  },
  {
    title: "WHO-Grade Water",
    text: "Every drop meets WHO drinking water standards for TDS, hardness, and microbial contamination.",
  },
  {
    title: "Zero-Waste Technology",
    text: "Water recovery up to 70% — recycles reject water so nothing goes down the drain.",
  },
  {
    title: "Smart Alerts",
    text: "In-app filter-change reminders, TDS reads and one-tap service booking for total peace of mind.",
  },
];

const stats = [
  { value: "17+", label: "Years of trust" },
  { value: "45K+", label: "Homes protected" },
  { value: "12", label: "Purification stages" },
  { value: "24 / 7", label: "Support desk" },
];

const brands = [
  { name: "Aquaguard", image: "/images/aqua-guard.jpg" },
  { name: "Kent", image: "/images/kent.jpg" },
  { name: "AO Smith", image: "/images/ao-smith.jpg" },
  { name: "Livpure", image: "/images/liv-pure.jpg" },
  { name: "Pureit", image: "/images/pureit.jpg" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden />
        <div className={styles.heroGrid} aria-hidden />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.badge}>
              <span /> Trusted by 45,000+ Indian households
            </span>
            <h1>
              Welcome to <br />
              <span className="gradient-text">VRS Water Purifiers</span>
            </h1>
            <p className={styles.lede}>
              VRS Water Purifiers crafts premium RO, alkaline and copper purification
              systems engineered andr the Indian home. Great tasting, mineral-rich
              water — straight from your tap.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/products" className="btn btn-primary">
                Explore Products
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Talk to an expert
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* STATS STRIP */}
      <section className={styles.statsSection}>
        <div className={`container ${styles.statsInner}`}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <ShopByCategory />

      {/* BESTSELLERS */}
      <Bestsellers />

      {/* SERVICES */}
      <section className={`section ${styles.servicesSection}`}>
        <div className={styles.servicesDecor} aria-hidden />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <header className={styles.servicesHead}>
            <div className={styles.servicesLead}>
              <span className="eyebrow">Our Services</span>
              <h2>
                Beyond the sale — <span className="gradient-text">we take care of it.</span>
              </h2>
              <p>
                From day-one installation to ongoing maintenance, our certified
                technicians keep every drop of your water clean, safe and sweet.
              </p>
            </div>
            <Link href="/services" className={`btn btn-primary ${styles.servicesCta}`}>
              View all services <HiArrowRight />
            </Link>
          </header>

          <div className={styles.servicesGrid}>
            {siteServices.slice(0, 4).map((s, i) => {
              const Icon = SERVICE_ICONS[s.iconKey] || HiOutlineWrenchScrewdriver;
              return (
                <Link
                  key={s.title}
                  href={`/services/${slugifyService(s.title)}`}
                  className={styles.serviceCard}
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <div
                    className={styles.serviceIcon}
                    style={{ background: s.accent }}
                    aria-hidden
                  >
                    <Icon />
                  </div>
                  <div className={styles.serviceBody}>
                    <h3>{s.title}</h3>
                    <p className={styles.serviceTagline}>{s.tagline}</p>
                    {s.features?.length > 0 && (
                      <ul className={styles.serviceFeats}>
                        {s.features.slice(0, 2).map((f) => (
                          <li key={f}>
                            <HiOutlineCheckBadge aria-hidden />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className={styles.serviceFoot}>
                    <span className={styles.serviceSteps}>
                      {s.process.length}-step process
                    </span>
                    <span className={styles.serviceArrow}>
                      Learn more <HiArrowRight />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className={styles.servicesStrip}>
            <div>
              <b>50,000+</b>
              <span>Service visits done</span>
            </div>
            <div>
              <b>4.9 ★</b>
              <span>Average customer rating</span>
            </div>
            <div>
              <b>3-month</b>
              <span>Workmanship warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why VRS</span>
            <h2>Engineered for water<br />that finally tastes right.</h2>
            <p>
              Every purifier we build is tested for Indian water conditions —
              hard, brackish, and high TDS — so what reaches your glass is
              healthier and unmistakably better.
            </p>
          </div>
          <div className={`grid-4 ${styles.uspGrid}`}>
            {usps.map((u, i) => (
              <article key={u.title} className={styles.uspCard} style={{ animationDelay: `${i * 80}ms` }}>
                <div className={styles.uspIcon}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3>{u.title}</h3>
                <p>{u.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className={styles.brandsSection}>
        <div className="container">
          <div className={styles.brandsHead}>
            <div>
              <span className="eyebrow">Trusted Brands</span>
              <h2>
                Every leading purifier brand,<br />
                <span className="gradient-text">under one roof.</span>
              </h2>
            </div>
            <p>
              Genuine products, expert installation and authorised service for
              India&apos;s most trusted water purifier brands — all sourced,
              delivered and supported by VRS.
            </p>
          </div>

          <div className={styles.brandsGrid}>
            {brands.map((b) => (
              <div key={b.name} className={styles.brandCard}>
                <div className={styles.brandImg}>
                  <img src={b.image} alt={`${b.name} water purifier`} loading="lazy" />
                </div>
                <span className={styles.brandName}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <span className="eyebrow" style={{ color: "#6cc7ec" }}>Get started</span>
            <h2 style={{ color: "#fff" }}>Ready to upgrade your<br />home&apos;s water?</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 12 }}>
              Free on-site TDS test and honest advice on the best purifier
              for your water — no obligation.
            </p>
          </div>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className="btn btn-light">
              Book a free demo
            </Link>
            <a href="tel:+919008155065" className="btn btn-ghost" style={{ color: "#fff", background: "rgba(255,255,255,0.06)" }}>
              Call +91 9008155065
            </a>
          </div>
        </div>
      </section>

         {/* TESTIMONIALS */}
      <Testimonials />
    </>
  );
}
