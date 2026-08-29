import Link from "next/link";
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineBeaker,
  HiOutlineSparkles,
  HiOutlineBuildingOffice2,
  HiOutlineCog6Tooth,
  HiOutlineClipboardDocumentCheck,
  HiArrowRight,
  HiOutlinePhone,
  HiCheck,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa6";
import { slugifyService } from "./services-data";
import styles from "./services.module.css";

export const metadata = {
  title: "Services — VRS Water Purifiers | Sales · Installation · Repair · AMC",
  description:
    "Complete water purifier services in Bangalore — installation, repair, filter replacement, AMC plans, water testing and genuine spare parts for every leading brand.",
};

const services = [
  {
    icon: <HiOutlineWrenchScrewdriver />,
    title: "Installation",
    body:
      "Professional installation of new water purifiers by trained technicians. Clean, tidy, on-time — every time.",
    features: ["Free installation on new units", "Wall mount, under-sink or countertop", "Complete water inlet setup"],
  },
  {
    icon: <HiOutlineArrowPath />,
    title: "Repair &amp; Service",
    body:
      "Same-day diagnosis and repair for every leading brand. Genuine parts, transparent pricing, warrantied work.",
    features: ["Same-day doorstep visit", "All brands supported", "3-month service warranty"],
    featured: true,
  },
  {
    icon: <HiOutlineShieldCheck />,
    title: "AMC Plans",
    body:
      "Hassle-free annual maintenance with scheduled filter changes, priority visits and unlimited call-outs.",
    features: ["Scheduled quarterly visits", "Priority same-day support", "Discounted spare-parts pricing"],
  },
  {
    icon: <HiOutlineCog6Tooth />,
    title: "Filter &amp; Spare Replacement",
    body:
      "Genuine sediment, carbon, RO membrane, UV lamps and every OEM spare — with proper warranty.",
    features: ["100% original parts", "Bulk discounts available", "Same-day availability"],
  },
  {
    icon: <HiOutlineBeaker />,
    title: "Free Water Testing",
    body:
      "Doorstep TDS, hardness and pH check with honest recommendation. No obligation, no upsell — ever.",
    features: ["Free on-site TDS check", "Written water quality report", "Personalised purifier advice"],
  },
  {
    icon: <HiOutlineSparkles />,
    title: "Tank &amp; Deep Sanitisation",
    body:
      "Food-grade sanitisation of storage tanks, pipes and internal chambers to keep every drop bacteria-free.",
    features: ["Food-grade cleaning agents", "Every 6 – 12 months", "Included in AMC plans"],
  },
  {
    icon: <HiOutlineBuildingOffice2 />,
    title: "Commercial &amp; Industrial",
    body:
      "Large-capacity RO plants, softeners and multi-outlet systems for offices, clinics, cafés and factories.",
    features: ["25 – 500 LPH capacity", "Custom plant design", "Annual service contracts"],
  },
  {
    icon: <HiOutlineClipboardDocumentCheck />,
    title: "Consultation &amp; Audit",
    body:
      "Not sure what you need? Book a 30-min consultation — we&apos;ll audit your setup and give straight advice.",
    features: ["30-minute expert session", "Independent brand advice", "Free water quality report"],
  },
];

const amcPlans = [
  {
    name: "Basic",
    price: "₹1,499",
    period: "per year",
    tagline: "Peace of mind for a single domestic unit.",
    perks: [
      "2 scheduled service visits",
      "Free TDS &amp; water quality check",
      "Priority phone support",
      "10% off on spare parts",
    ],
  },
  {
    name: "Standard",
    price: "₹2,999",
    period: "per year",
    tagline: "Our most popular plan — everything most homes need.",
    perks: [
      "4 scheduled service visits",
      "Free filter cleaning &amp; tank wash",
      "Free RO membrane check",
      "20% off on spare parts",
      "24-hour response window",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "₹4,499",
    period: "per year",
    tagline: "Full-cover plan with parts included.",
    perks: [
      "Unlimited service visits",
      "Sediment &amp; carbon filters included",
      "Tank sanitisation twice a year",
      "30% off on major spares",
      "Same-day priority visits",
    ],
  },
];

const process = [
  {
    n: "01",
    title: "Book a service",
    body: "Call, WhatsApp or fill our form. Takes less than 60 seconds.",
  },
  {
    n: "02",
    title: "Confirm slot",
    body: "We&apos;ll confirm a same-day or next-day visit that suits you.",
  },
  {
    n: "03",
    title: "On-site diagnosis",
    body: "Certified technician arrives, inspects and gives a fixed quote.",
  },
  {
    n: "04",
    title: "Service &amp; sign-off",
    body: "Work is done, water is tested, and you get a written report.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroDecor} aria-hidden />
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>
            Our Services <em />
          </span>
          <h1>
            Every service your<br />
            purifier will <span className={styles.hilite}>ever need.</span>
          </h1>
          <p>
            Installation, repair, AMCs, genuine spares, water testing and
            commercial plants — all from one team that&apos;s served
            Bangalore for 15+ years.
          </p>
        </div>
      </section>

      {/* ============ SERVICES GRID ============ */}
      <section className={styles.servicesSection}>
        <div className="container">
          <div className={styles.servicesHead}>
            <div>
              <span className={styles.eyebrow}>
                What we do <em />
              </span>
              <h2>
                End-to-end water<br />
                purifier <span className={styles.hilite}>solutions.</span>
              </h2>
            </div>
            <p>
              Eight services covering every stage of your purifier&apos;s life —
              from the first install to the tenth-year filter change.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((s, i) => (
              <article
                key={s.title}
                className={`${styles.serviceCard} ${s.featured ? styles.serviceCardFeatured : ""}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className={styles.serviceIcon}>{s.icon}</span>
                <h3 dangerouslySetInnerHTML={{ __html: s.title }} />
                <p dangerouslySetInnerHTML={{ __html: s.body }} />
                <ul className={styles.serviceFeatures}>
                  {s.features.map((f) => (
                    <li key={f}>
                      <span className={styles.tickIcon}><HiCheck /></span>
                      <span dangerouslySetInnerHTML={{ __html: f }} />
                    </li>
                  ))}
                </ul>
                <Link href={`/services/${slugifyService(s.title)}`} className={styles.serviceLink}>
                  Know more <HiArrowRight />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AMC PLANS ============ */}
      <section className={styles.amcSection}>
        <div className="container">
          <div className={styles.amcHead}>
            <span className={styles.eyebrow} style={{ justifyContent: "center" }}>AMC Plans <em /></span>
            <h2>
              Annual maintenance,<br />
              done <span className={styles.hilite}>right.</span>
            </h2>
            <p>
              Scheduled visits, genuine parts and priority support at a fixed
              yearly price. No surprise bills, no reminder calls to chase.
            </p>
          </div>

          <div className={styles.amcGrid}>
            {amcPlans.map((p, i) => (
              <article key={p.name} className={`${styles.amcCard} ${p.featured ? styles.amcCardFeatured : ""}`} style={{ animationDelay: `${i * 80}ms` }}>
                {p.featured && <span className={styles.amcBadge}>Most popular</span>}
                <span className={styles.amcName}>{p.name}</span>
                <div className={styles.amcPrice}>
                  <b>{p.price}</b>
                  <span>{p.period}</span>
                </div>
                <p className={styles.amcTagline}>{p.tagline}</p>
                <ul className={styles.amcPerks}>
                  {p.perks.map((perk) => (
                    <li key={perk}>
                      <span className={styles.tickIcon}><HiCheck /></span>
                      <span dangerouslySetInnerHTML={{ __html: perk }} />
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={styles.amcCta}>
                  Choose {p.name} <HiArrowRight />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className={styles.processSection}>
        <div className="container">
          <div className={styles.processHead}>
            <span className={styles.eyebrow}>How it works <em /></span>
            <h2>
              Four simple steps.<br />
              <span className={styles.hilite}>Zero hassle.</span>
            </h2>
          </div>
          <div className={styles.processGrid}>
            {process.map((step, i) => (
              <div key={step.n} className={styles.processStep} style={{ animationDelay: `${i * 80}ms` }}>
                <span className={styles.processNum}>{step.n}</span>
                <b>{step.title}</b>
                <em dangerouslySetInnerHTML={{ __html: step.body }} />
                {i < process.length - 1 && <span className={styles.processConnector} aria-hidden />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
