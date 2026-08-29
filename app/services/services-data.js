/**
 * Shared services catalogue — used by the home page section and the
 * per-service detail pages under /services/[slug].
 *
 * `iconKey` is mapped to an actual react-icon at the render site (client
 * component) so this file stays icon-free and importable server-side.
 */

export function slugifyService(name) {
  return String(name || "")
    .toLowerCase()
    // Decode HTML-encoded ampersands (`&amp;`) and plain `&` to dashes so
    // "Repair &amp; Service" and "Repair & Service" both slugify identically.
    .replace(/&amp;/g, "-")
    .replace(/&/g, "-")
    // Turn the word "and" into a dash too (word boundary avoids matching
    // "handout" and friends).
    .replace(/\band\b/g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const services = [
  {
    title: "Installation",
    iconKey: "wrench",
    tagline: "Clean, tidy, on-time — every time.",
    body:
      "Professional installation of new water purifiers by our trained technicians. From wall-mounted units to modular under-sink systems, we plumb, mount and commission every unit to manufacturer spec.",
    features: [
      "Free installation on all new units purchased from VRS",
      "Wall mount, under-sink or countertop set-ups",
      "Complete water-inlet plumbing and mount hardware",
      "Post-install performance check and hand-over demo",
    ],
    process: [
      { title: "Schedule a slot", body: "Book online or by phone — most installs happen within 24 hours." },
      { title: "Site survey", body: "Our technician arrives, inspects your space and confirms the ideal mount." },
      { title: "Install & demo", body: "Full plumbing, mounting, a live water-quality check and a hand-over walkthrough." },
    ],
    accent: "linear-gradient(135deg, #0f7fbf, #14c9a1)",
  },
  {
    title: "Repair & Service",
    iconKey: "repair",
    tagline: "Same-day diagnosis for every brand.",
    body:
      "Something acting up? Book a same-day doorstep visit. Our technicians carry genuine OEM parts, quote transparent pricing before starting work, and back every repair with a 3-month workmanship warranty.",
    features: [
      "Same-day doorstep visit within city limits",
      "All major brands supported (Aquaguard, KENT, Livpure, etc.)",
      "Genuine spare parts with warranty",
      "3-month service warranty on all repairs",
    ],
    process: [
      { title: "Describe the issue", body: "Tell us what's wrong — leaking, no water, bad taste — over phone or WhatsApp." },
      { title: "Same-day visit", body: "A technician arrives with a full parts kit within a few hours in most cities." },
      { title: "Repair & sign-off", body: "Transparent quote, quick fix, and a 3-month workmanship warranty on the job." },
    ],
    accent: "linear-gradient(135deg, #14c9a1, #0f7fbf)",
  },
  {
    title: "AMC Plans",
    iconKey: "shield",
    tagline: "Set it and forget it maintenance.",
    body:
      "Annual maintenance contracts that put your purifier's health on autopilot. Scheduled quarterly visits, priority same-day support and discounted spare parts — all for one predictable annual fee.",
    features: [
      "Scheduled quarterly service visits",
      "Priority same-day support call-outs",
      "Discounted pricing on spare parts",
      "Complete filter-change coverage on Premium plans",
    ],
    process: [
      { title: "Choose a plan", body: "Basic, Standard or Premium — one predictable annual fee for peace of mind." },
      { title: "Scheduled visits", body: "We show up on time, every quarter, for a full check-up and filter change if needed." },
      { title: "Priority support", body: "Something wrong between visits? You skip the queue — always." },
    ],
    accent: "linear-gradient(135deg, #052a4a, #0f7fbf)",
  },
  {
    title: "Free Water Testing",
    iconKey: "beaker",
    tagline: "Know your water. Choose right.",
    body:
      "Not sure if you need RO, UV or a softener? Book a free doorstep water-quality test. We check TDS, hardness and pH, then hand you a written report and honest recommendation — no obligation to buy.",
    features: [
      "Free on-site TDS, hardness and pH check",
      "Written water-quality report at your doorstep",
      "Independent, brand-neutral purifier advice",
      "No obligation, no upsell — ever",
    ],
    process: [
      { title: "Book a slot", body: "Zero cost, zero obligation — pick a time that works for you." },
      { title: "Doorstep test", body: "TDS, hardness and pH tested on-site with calibrated instruments." },
      { title: "Get the report", body: "A written report and honest advice on what (if anything) you actually need." },
    ],
    accent: "linear-gradient(135deg, #14c9a1, #052a4a)",
  },
  {
    title: "Filter & Spare Replacement",
    iconKey: "cog",
    tagline: "Genuine parts, on the same day.",
    body:
      "Sediment, carbon, RO membranes, UV lamps and every OEM spare — all in stock and delivered on the same day. Every replacement comes with a proper warranty and is installed by our certified technicians.",
    features: [
      "100% original OEM parts",
      "Same-day availability across most brands",
      "Bulk discounts for offices and cafés",
      "Warranty on all replacement parts",
    ],
    process: [
      { title: "Tell us the model", body: "Share your purifier model or a photo — we'll match the right spare instantly." },
      { title: "Confirm the quote", body: "Transparent OEM pricing with the warranty period spelled out up-front." },
      { title: "Same-day fit", body: "We deliver and install the new part with a leak-test on the same day." },
    ],
    accent: "linear-gradient(135deg, #0f7fbf, #6cc7ec)",
  },
  {
    title: "Tank & Deep Sanitisation",
    iconKey: "sparkles",
    tagline: "Food-grade cleaning, top to bottom.",
    body:
      "Storage tanks, pipes and internal chambers cleaned with food-grade sanitisation agents. Removes biofilm, algae and mineral scale so every drop stays as clean as the day the purifier was installed.",
    features: [
      "Food-grade sanitising agents, zero residue",
      "Recommended every 6 – 12 months",
      "Bundled free with all AMC Premium plans",
      "Complete tank drain, scrub and re-fill",
    ],
    process: [
      { title: "Schedule a slot", body: "Book a 90-minute window that fits your family or office routine." },
      { title: "Full drain & scrub", body: "Tank drained, chambers scrubbed and pipes flushed with food-grade sanitiser." },
      { title: "Refill & sign-off", body: "System refilled, TDS checked and a fresh-taste demo before we leave." },
    ],
    accent: "linear-gradient(135deg, #14c9a1, #6cc7ec)",
  },
  {
    title: "Commercial & Industrial",
    iconKey: "building",
    tagline: "25 – 500 LPH systems, custom-built.",
    body:
      "Large-capacity RO plants, softeners and multi-outlet systems for offices, clinics, cafés and factories. We design, deliver and maintain the whole set-up so your staff and customers get consistently clean water.",
    features: [
      "25 – 500 LPH capacity systems",
      "Custom plant design and site survey",
      "Multi-outlet distribution and storage",
      "Annual service contracts and priority support",
    ],
    process: [
      { title: "Site survey", body: "We visit, measure the water source and map out your usage load." },
      { title: "Custom design", body: "Bespoke plant spec — capacity, footprint, storage and distribution." },
      { title: "Install & AMC", body: "Turnkey install with an annual service contract for zero-downtime uptime." },
    ],
    accent: "linear-gradient(135deg, #052a4a, #14c9a1)",
  },
  {
    title: "Consultation & Audit",
    iconKey: "clipboard",
    tagline: "Straight advice, no sales pitch.",
    body:
      "Not sure what you need? Book a 30-minute consultation. We audit your setup, test your source water, and give you brand-neutral advice on the exact system that fits your family, budget and space.",
    features: [
      "30-minute expert consultation",
      "Free water-quality report",
      "Independent, brand-neutral recommendation",
      "Follow-up support after installation",
    ],
    process: [
      { title: "Book a session", body: "Pick a 30-minute slot — home visit or video call, whichever you prefer." },
      { title: "Audit & test", body: "We check your source water, current setup and household usage patterns." },
      { title: "Get a plan", body: "Written recommendation with brand-neutral options and honest trade-offs." },
    ],
    accent: "linear-gradient(135deg, #0f7fbf, #052a4a)",
  },
];
