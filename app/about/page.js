import Link from "next/link";
import styles from "./about.module.css";

export const metadata = {
  title: "About VRS Water Purifiers — Pure Water. Better Life.",
  description:
    "For 15+ years, VRS Water Purifiers has been Bangalore's most trusted name for water purification — sales, service, spares and honest advice.",
};

const pillars = [
  {
    mark: "01",
    title: "Our Mission",
    body:
      "To provide innovative water purifiers that ensure 100% pure, safe, and great-tasting water for a healthier tomorrow.",
  },
  {
    mark: "02",
    title: "Our Vision",
    body:
      "To be Bangalore's most trusted water purification service, setting new standards in quality, transparency and after-sales care.",
  },
  {
    mark: "03",
    title: "Our Values",
    body:
      "Honesty over upsell. Quality over quick fixes. Long-term relationships over one-time sales. Everything we do is measured against a single yardstick.",
  },
];

const features = [
  {
    mark: "RO",
    title: "RO Purification",
    body:
      "0.0001-micron reverse-osmosis membrane removes dissolved solids, heavy metals and microplastics — the heart of every VRS system.",
    featured: true,
  },
  {
    mark: "UV",
    title: "UV Protection",
    body: "High-intensity ultraviolet chamber kills 99.9% of bacteria, viruses and cysts.",
  },
  {
    mark: "UF",
    title: "UF Filtration",
    body: "Hollow-fibre ultrafiltration retains essential minerals while polishing the water.",
  },
  {
    mark: "TDS",
    title: "TDS Control",
    body: "Fine-tunes taste and mineral balance for water that&apos;s healthy and delicious.",
  },
  {
    mark: "AF",
    title: "Advanced Filters",
    body: "Sediment, carbon and post-carbon layers work together for complete multi-stage safety.",
  },
  {
    mark: "SI",
    title: "Smart Indicators",
    body: "Real-time LEDs and app alerts for filter life, TDS levels and service reminders.",
  },
];

const certifications = ["NSF", "CE", "ISO 9001:2015", "WQA", "BIS"];

export default function AboutPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroWater} aria-hidden />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              About Us <em />
            </span>
            <h1 className={styles.heroTitle}>
              Pure Water.<br />
              Better Life.
            </h1>
            <p className={styles.heroLede}>
              At VRS, we believe every drop of water should be pure, safe, and
              good for health. Our mission is to deliver advanced water
              purification solutions that you can trust every single day.
            </p>
          </div>

        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className={styles.story}>
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyCopy}>
            <span className={styles.eyebrow}>Our Story <em /></span>
            <h2>
              Driven by a Simple<br />
              Purpose: <span className={styles.hilite}>Your Health.</span>
            </h2>
            <p>
              VRS was founded with a simple yet powerful idea — to make pure and
              healthy drinking water accessible to every home. With expert
              installation, genuine spares and transparent service, we&apos;ve
              earned the trust of thousands of families across Bangalore.
            </p>
            <p>
              Fifteen years on, that promise still stands: honest water advice,
              genuine parts, and service that shows up when it says it will.
            </p>
          </div>

          <div className={styles.storyImgWrap}>
            <img
              src="/images/abt-img.png"
              alt="VRS Water Purifier service in a family home"
              className={styles.storyImg}
              loading="lazy"
            />
            <div className={styles.storyImgBadge}>
              <b>15+</b>
              <span>Years serving Bangalore</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MISSION / VISION / VALUES ============ */}
      <section className={styles.pillars}>
        <div className="container">
          <div className={styles.pillarsCard}>
            {pillars.map((p) => (
              <div key={p.title} className={styles.pillar}>
                <span className={styles.pillarIcon}>{p.mark}</span>
                <h3>{p.title}</h3>
                {p.body && <p>{p.body}</p>}
                {p.list && (
                  <ul>
                    {p.list.map((item) => (
                      <li key={item}>
                        <span className={styles.tickIcon}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                <span className={styles.pillarDots}>
                  <i /><i />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TECHNOLOGY ============ */}
      <section className={styles.tech}>
        <div className={styles.techBg} aria-hidden />
        <div className="container">
          <header className={styles.techHead}>
            <div>
              <span className={styles.eyebrow}>
                Advanced Technology <em />
              </span>
              <h2 className={styles.techHeading}>
                Purity in <span className={styles.hilite}>Every Drop.</span>
              </h2>
            </div>
            <div className={styles.techIntro}>
              <p>
                Every VRS purifier is built around a six-stage engineering stack
                — from coarse sediment removal down to ionic-level polishing —
                designed to work in harmony for water you can taste the
                difference in.
              </p>
            </div>
          </header>

          <div className={styles.techGridInner}>
            {features.map((f) => (
              <article
                key={f.title}
                className={`${styles.techFeature} ${f.featured ? styles.techFeatureFeatured : ""}`}
              >
                <span className={styles.techFeatureIcon}>{f.mark}</span>
                <b>{f.title}</b>
                <em dangerouslySetInnerHTML={{ __html: f.body }} />
                <span className={styles.techAccent} aria-hidden />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CERTIFICATIONS ============ */}
      {/* <section className={styles.certs}>
        <div className="container">
          <div className={styles.certsCard}>
            <div className={styles.certsCopy}>
              <span className={styles.eyebrow}>Certifications <em /></span>
              <h2>Trust Built on Quality</h2>
              <p>
                Our products are tested and certified by leading national and
                international bodies to ensure the highest standards of safety
                and performance.
              </p>
            </div>
            <div className={styles.certsList}>
              {certifications.map((c) => (
                <span key={c} className={styles.certBadge}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* ============ CTA ============ */}
      <section className={styles.cta}>
        <div className={styles.ctaBg} aria-hidden />
        <div className={`container ${styles.ctaInner}`}>
          <div className={styles.ctaCopy}>
            <h2>Make the Pure Choice</h2>
            <p>Choose VRS and give your family the purity they truly deserve.</p>
            <Link href="/products" className={styles.ctaBtn}>
              Explore Products
              <span className={`${styles.arrowCircle} ${styles.arrowCircleDark}`}>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

