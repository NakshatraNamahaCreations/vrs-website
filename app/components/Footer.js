import Link from "next/link";
import styles from "./Footer.module.css";

const trustBadges = [
  {
    icon: "install",
    title: "Free TDS Test",
    sub: "At-home water check",
  },
  {
    icon: "shield",
    title: "Genuine Products",
    sub: "Sourced direct from brands",
  },
  {
    icon: "support",
    title: "24 / 7 Support",
    sub: "Call, WhatsApp or Book",
  },
  {
    icon: "cert",
    title: "ISO 9001",
    sub: "Quality certified service",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.orb} aria-hidden />
      <div className={styles.orbSm} aria-hidden />
      <div className={styles.grid} aria-hidden />

      {/* TRUST STRIP */}
      <div className={styles.trustWrap}>
        <div className={`container ${styles.trust}`}>
          {trustBadges.map((b) => (
            <div key={b.title} className={styles.trustItem}>
              <span className={styles.trustIcon}>
                <TrustIcon name={b.icon} />
              </span>
              <div>
                <b>{b.title}</b>
                <span>{b.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className={`container ${styles.top}`}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <span>
              <b>VRS</b> Water Purifiers
            </span>
          </div>
          <p>
            Every leading water purifier brand under one roof — genuine products,
            expert installation and honest service for Indian homes and
            businesses since 2008.
          </p>

          <div className={styles.tagRow}>
            {["Aquaguard", "Kent", "AO Smith", "Livpure", "Pureit"].map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>

          <div className={styles.social}>
            {["facebook", "instagram", "youtube", "linkedin"].map((s) => (
              <a
                key={s}
                href={`#${s}`}
                aria-label={s}
                className={styles.socialLink}
              >
                <SocialIcon name={s} />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.col}>
          <h4>Explore</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Categories</h4>
          <ul>
            <li><Link href="/products#ro">RO Purifiers</Link></li>
            <li><Link href="/products#alkaline">Alkaline Purifiers</Link></li>
            <li><Link href="/products#copper">Copper Purifiers</Link></li>
            <li><Link href="/products#commercial">Commercial &amp; Industrial</Link></li>
            <li><Link href="/products#accessories">Accessories &amp; Filters</Link></li>
          </ul>
        </div>

        <div className={`${styles.col} ${styles.contactCol}`}>
          <h4>Reach Us</h4>
          <div className={styles.contactCard}>
            <span className={styles.contactIcon}><ContactIcon name="phone" /></span>
            <div>
              <span>Call directly</span>
              <a href="tel:+919999999999">+91 99999 99999</a>
            </div>
          </div>
          <div className={styles.contactCard}>
            <span className={styles.contactIcon}><ContactIcon name="mail" /></span>
            <div>
              <span>Drop a mail</span>
              <a href="mailto:hello@vrswaterpurifiers.in">hello@vrswaterpurifiers.in</a>
            </div>
          </div>
          <div className={styles.contactCard}>
            <span className={styles.contactIcon}><ContactIcon name="pin" /></span>
            <div>
              <span>Visit us</span>
              <p>No. 24, Water Street,<br />Bangalore, Karnataka 560068</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className={`container ${styles.bottom}`}>
        <p>© {year} VRS Water Purifiers. All rights reserved.</p>
        <p className={styles.made}>
          Crafted by{" "}
          <a
            href="https://www.nakshatranamahacreations.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.madeLink}
          >
            Nakshatra Namaha Creations
          </a>{" "}
          
        </p>
        <p className={styles.legal}>
          <Link href="#privacy">Privacy</Link>
          <span>•</span>
          <Link href="#terms">Terms</Link>
          <span>•</span>
          <Link href="#sitemap">Sitemap</Link>
        </p>
      </div>
    </footer>
  );
}

function SocialIcon({ name }) {
  const paths = {
    facebook: "M13 22v-8h3l1-4h-4V7.5c0-1.2.4-2 2.2-2H17V2.1C16.7 2 15.5 2 14.3 2 11.8 2 10 3.5 10 6.3V10H7v4h3v8h3Z",
    instagram: "M12 2.2c3.2 0 3.6 0 4.9.1 3.2.1 4.7 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.2 3.2-1.7 4.7-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.2-.2-4.7-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.9s0-3.5.1-4.8C2.4 4 3.9 2.4 7.1 2.3 8.4 2.2 8.8 2.2 12 2.2Zm0 3.4a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8Zm0 10.6a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4Zm6.6-10.9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z",
    youtube: "M21.6 7.2s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C15.9 4 12 4 12 4s-3.9 0-6.8.3c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 8.8 2 10.5v2.9c0 1.7.2 3.3.2 3.3s.2 1.4.8 2c.8.8 1.9.8 2.4.9 1.7.2 6.6.3 6.6.3s3.9 0 6.8-.3c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.7.2-3.3v-2.9c0-1.7-.2-3.3-.2-3.3ZM10 14.5v-5l4.5 2.5-4.5 2.5Z",
    linkedin: "M4 4h4v16H4V4Zm2-2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm4 6h4v2c.7-1.3 2.3-2.3 4-2.3 3 0 4 2 4 5V20h-4v-6.2c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5V20h-4V8Z",
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d={paths[name]} />
    </svg>
  );
}

function TrustIcon({ name }) {
  const paths = {
    install: "M12 2 3 7v6c0 5 3.8 9 9 10 5.2-1 9-5 9-10V7l-9-5Z M9 12l2 2 4-4",
    shield: "M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z M9 12l2 2 4-4",
    support: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z M12 6v6l4 2",
    cert: "M12 2 15 8l6 1-4.5 4.5 1 6-5.5-3-5.5 3 1-6L3 9l6-1 3-6Z",
  };
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}

function ContactIcon({ name }) {
  const paths = {
    phone: "M22 16.9v3a2 2 0 0 1-2.2 2 20 20 0 0 1-8.6-3.1 20 20 0 0 1-6-6 20 20 0 0 1-3.1-8.6A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2Z",
    mail: "M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2Z M22 6l-10 7L2 6",
    pin: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}
