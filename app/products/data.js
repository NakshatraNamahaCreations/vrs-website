/**
 * Turns a product name into a URL-safe slug.
 *   "Aquaguard Astor RO UV Kit" -> "aquaguard-astor-ro-uv-kit"
 *   "AquaGuard Enance RO Kit"   -> "aquaguard-enance-ro-kit"
 */
export function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[+&/\\]/g, "-")     // + & / \ become dashes
    .replace(/[^a-z0-9\s-]/g, "") // strip other punctuation
    .trim()
    .replace(/\s+/g, "-")         // spaces -> dashes
    .replace(/-+/g, "-");         // collapse repeats
}

export const categories = [
  "Aquaguard Spare Parts",
  "Commercial RO",
  "Commercial Water Purifier",
  "Hot & Ambient",
  "RO UV UF MTDS",
  "RO + UV Water Purifier",
  "Under Sink Models",
  "UV + UF Water Purifier",
  "Water Purifier Accessories",
  "Water Softeners",
];

export const products = [
  {
    id: 1,
    name: "Aquaguard Astor RO UV Kit",
    category: "Aquaguard Spare Parts",
    tag: "Bestseller",
    price: 3999,
    original: 5070,
    image: "/images/product1.jpg",
    images: [
      "/images/product1.jpg",
      "/images/spare-parts.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "Complete service kit for Aquaguard Astor RO+UV water purifiers. Includes the OEM sediment filter, pre-carbon block, RO membrane and post-carbon polisher — everything you need for a full one-year service. Restores original flow rate and taste while keeping TDS in the safe drinking range.",
    features: [
      "Genuine OEM Aquaguard spare kit",
      "Full one-year service coverage",
      "Removes dissolved salts, chlorine, odour and heavy metals",
      "Fits all Astor RO+UV models",
      "1-year replacement warranty",
    ],
  },
  {
    id: 2,
    name: "Aquaguard PF Candle Sleek ARP",
    category: "Aquaguard Spare Parts",
    tag: "Popular",
    price: 375,
    original: 475,
    image: "/images/product2.png",
    images: [
      "/images/product2.png",
      "/images/spare-parts.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "High-density polypropylene sediment candle for Aquaguard Sleek ARP series. Traps sand, silt, rust and fine turbidity before it reaches the RO membrane, extending membrane life. A recommended 3-month replacement part.",
    features: [
      "5-micron polypropylene filtration",
      "Protects downstream RO membrane",
      "Improves visible water clarity",
      "Recommended replacement every 3 months",
      "Direct OEM fit for Sleek ARP",
    ],
  },
  {
    id: 3,
    name: "AquaGuard Enance RO Kit",
    category: "Aquaguard Spare Parts",
    tag: "Popular",
    price: 3600,
    original: 4890,
    image: "/images/product3.png",
    images: [
      "/images/product3.png",
      "/images/spare-parts.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "Full annual maintenance kit for Aquaguard Enhance RO purifiers. Ships with the sediment filter, pre-carbon, RO membrane and post-carbon in a single box — sealed OEM parts, ready for a certified technician install.",
    features: [
      "One-year AMC kit for Enhance RO",
      "Sealed OEM components",
      "Removes TDS, chlorine, pesticides and lead",
      "Improves taste and mineral balance",
      "1-year warranty on parts",
    ],
  },
  {
    id: 4,
    name: "Aquaguard Prefilter Assembly",
    category: "Aquaguard Spare Parts",
    tag: "New",
    price: 4499,
    original: 5999,
    image: "/images/product4.png",
    images: [
      "/images/product4.png",
      "/images/purifier-spare-parts.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "External prefilter assembly that mounts before the purifier's inlet. Removes heavy sediment, sand and rust from municipal or borewell supply before it enters the machine — dramatically extends the life of downstream cartridges.",
    features: [
      "Wall-mounted external housing",
      "Washable sediment cartridge",
      "Reduces load on primary filters",
      "Compatible with all Aquaguard purifiers",
      "Full mounting kit and connectors included",
    ],
  },
  {
    id: 5,
    name: "Aquaguard Magna RO Kit PL4",
    category: "Aquaguard Spare Parts",
    tag: "Bestseller",
    price: 3800,
    original: 5070,
    image: "/images/product5.png",
    images: [
      "/images/product5.png",
      "/images/spare-parts.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "Complete PL4 service kit for Aquaguard Magna RO purifiers. The kit delivers a full year of trouble-free operation with clean, mineral-balanced water and consistent flow.",
    features: [
      "PL4 kit for Magna RO series",
      "Sediment + pre-carbon + RO + post-carbon",
      "Retains essential minerals",
      "Restores full water output",
      "1-year replacement warranty",
    ],
  },
  {
    id: 6,
    name: "Aquaguard Universal RO Filter Kit",
    category: "Aquaguard Spare Parts",
    tag: "Bestseller",
    price: 4500,
    original: 7445,
    image: "/images/product6.png",
    images: [
      "/images/product6.png",
      "/images/purifier-spare-parts.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "Universal RO service kit compatible with most Aquaguard household purifiers. A safe, everyday-value option when the exact model kit isn't available — standard cartridge sizes and connectors.",
    features: [
      "Fits most Aquaguard RO models",
      "Standard 10-inch cartridge sizing",
      "Includes RO membrane and carbon stages",
      "Improves taste and removes odour",
      "1-year warranty",
    ],
  },
  {
    id: 7,
    name: "50 LPH RO with Inbuilt Stainless Steel Tank",
    category: "Commercial RO",
    tag: "Popular",
    price: 48900,
    original: 64000,
    image: "/images/product7.png",
    images: [
      "/images/product7.png",
      "/images/commercial-ro.png",
      "/images/commercial-purifier.png",
    ],
    description:
      "Commercial-grade 50 litres-per-hour RO system with an inbuilt SS304 stainless steel storage tank. Built for offices, cafés, small restaurants and clinics that need dependable purified water on tap through the day.",
    features: [
      "50 LPH RO output",
      "SS304 stainless steel storage tank",
      "Multi-stage RO with UV polishing",
      "Handles TDS up to 2000 ppm",
      "1-year comprehensive warranty",
    ],
  },
  {
    id: 8,
    name: "30 LPH RO with Mega Sediment Filter Copper + Alkaline",
    category: "Commercial Water Purifier",
    tag: "New",
    price: 15500,
    original: 25000,
    image: "/images/product8.png",
    images: [
      "/images/product8.png",
      "/images/commercial-purifier.png",
      "/images/commercial-ro.png",
    ],
    description:
      "30 LPH commercial water purifier with an oversized sediment stage for high-turbidity intake, plus copper-infusion and alkaline post-treatment cartridges that enrich water with essential minerals and stabilise pH.",
    features: [
      "30 LPH commercial output",
      "Mega sediment stage for muddy or borewell water",
      "Copper + alkaline enrichment",
      "Balances pH to 8.0–8.5",
      "Ideal for small offices and shops",
    ],
  },
  {
    id: 9,
    name: "Aquaguard Aspire Blaze Insta WS RO+UV SS Hot & Ambient Copper",
    category: "Hot & Ambient",
    tag: "Popular",
    price: 23500,
    original: 37000,
    image: "/images/product9.png",
    images: [
      "/images/product9.png",
      "/images/hot-ambient.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "Premium Aquaguard Aspire Blaze with instant hot dispense and ambient outlets, a copper-charged tank, and a full stainless-steel body. Delivers piping hot water on demand — no wait, no kettle.",
    features: [
      "Instant hot water dispense",
      "Copper-infusion healthy mineralisation",
      "SS304 stainless steel storage tank",
      "RO+UV multi-stage purification",
      "Touch panel with child lock",
    ],
  },
  {
    id: 10,
    name: "Aquaguard Aspire Blaze 2X RO+UV Stainless Steel Water Purifier",
    category: "Hot & Ambient",
    tag: "Popular",
    price: 23500,
    original: 37000,
    image: "/images/product10.png",
    images: [
      "/images/product10.png",
      "/images/hot-ambient.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "Aspire Blaze 2X uses Aquaguard's dual-stage purification and a food-grade stainless-steel tank to deliver naturally sweet, mineral-balanced water. Hot and ambient taps make it a fit for daily kitchen use.",
    features: [
      "2X purification with RO + UV",
      "Food-grade stainless steel tank",
      "Hot and ambient outlets",
      "Active copper technology",
      "Smart alerts for service and filter change",
    ],
  },
  {
    id: 11,
    name: "KENT Elegant RO UV UF TDS Controller",
    category: "RO UV UF MTDS",
    tag: "Popular",
    price: 16500,
    original: 23500,
    image: "/images/product11.png",
    images: [
      "/images/product11.png",
      "/images/ro-uv-uf.png",
      "/images/kent.jpg",
    ],
    description:
      "KENT Elegant combines RO, UV and UF filtration with a manual TDS controller so essential minerals are retained even for low-TDS municipal supply. A compact wall-mounted design for modern kitchens.",
    features: [
      "RO + UV + UF triple purification",
      "TDS controller to retain minerals",
      "Save water technology — 50% recovery",
      "8 L food-grade storage tank",
      "1-year warranty + 3-year free service",
    ],
  },
  {
    id: 12,
    name: "KENT Grand Plus RO Water Purifier | RO+UV+UF+TDS Control",
    category: "RO UV UF MTDS",
    tag: "Popular",
    price: 23500,
    original: 37000,
    image: "/images/product12.png",
    images: [
      "/images/product12.png",
      "/images/ro-uv-uf.png",
      "/images/kent.jpg",
    ],
    description:
      "KENT Grand Plus is a flagship home purifier with RO+UV+UF and a TDS controller. Its double-purification process ensures every drop is safe and mineral-balanced, no matter the input water source.",
    features: [
      "Double purification: RO + UV + UF",
      "TDS controller retains essential minerals",
      "9 L transparent storage tank",
      "Save water technology reduces waste",
      "Suitable for brackish and municipal water",
    ],
  },
  {
    id: 13,
    name: "Aquaguard Aspire Nova RO + UV Copper + Alkaline SS 2X",
    category: "RO + UV Water Purifier",
    tag: "Popular",
    price: 24000,
    original: 36000,
    image: "/images/product13.png",
    images: [
      "/images/product13.png",
      "/images/ro-uv.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "Aspire Nova pairs RO+UV purification with copper infusion and an alkaline stage, in a slim stainless-steel body. Water comes out cleaner, sweeter and gently mineralised — ideal for growing families.",
    features: [
      "RO + UV 2X purification",
      "Copper infusion + alkaline stages",
      "SS304 stainless steel body",
      "Ambient and normal outlets",
      "1-year comprehensive warranty",
    ],
  },
  {
    id: 14,
    name: "Kent Sapphire",
    category: "RO + UV Water Purifier",
    tag: "Popular",
    price: 18000,
    original: 25000,
    image: "/images/product14.png",
    images: [
      "/images/product14.png",
      "/images/ro-uv.png",
      "/images/kent.jpg",
    ],
    description:
      "KENT Sapphire delivers RO + UV + UF purification in a compact wall-mounted body. Ideal for compact kitchens where quality water and a clean silhouette are both non-negotiable.",
    features: [
      "RO + UV + UF triple purification",
      "8 L detachable storage tank",
      "Save water recovery technology",
      "Fully automatic operation",
      "1-year warranty + 3-year free service",
    ],
  },
  {
    id: 15,
    name: "Aquaguard Designo UTC RO+UV 2X Water Purifier",
    category: "Under Sink Models",
    tag: "Popular",
    price: 25900,
    original: 39500,
    image: "/images/product15.png",
    images: [
      "/images/product15.png",
      "/images/under-sink.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "Designo UTC is a premium under-the-counter purifier that hides all the plumbing away and delivers clean water through a slim countertop tap. Perfect for modular kitchens where counter space is precious.",
    features: [
      "Under-counter installation",
      "RO + UV 2X purification",
      "Sleek countertop dispensing tap",
      "Smart low-water and filter-change alerts",
      "1-year comprehensive warranty",
    ],
  },
  {
    id: 16,
    name: "Aquaguard Nova UV+UF 2X Copper Water Purifier",
    category: "UV + UF Water Purifier",
    tag: "Popular",
    price: 14490,
    original: 17000,
    image: "/images/product16.png",
    images: [
      "/images/product16.png",
      "/images/uv-uf.png",
      "/images/aqua-guard.jpg",
    ],
    description:
      "Aquaguard Nova UV+UF 2X is designed for low-TDS municipal water, using UV and UF stages to eliminate bacteria and cysts while a copper-infusion stage adds a healthy natural mineral boost.",
    features: [
      "UV + UF purification (no RO waste)",
      "Copper-infusion technology",
      "Ideal for low-TDS municipal water",
      "Compact wall-mounted design",
      "Cost-effective daily operation",
    ],
  },
  {
    id: 17,
    name: "Water Purifier 1/4 Connector",
    category: "Water Purifier Accessories",
    tag: "Popular",
    price: 20,
    original: 35,
    image: "/images/product17.png",
    images: [
      "/images/product17.png",
      "/images/accessories.png",
      "/images/spare-parts.png",
    ],
    description:
      "Standard 1/4-inch quick-connect fitting used across most household water purifiers. Push-to-lock design means no tools, no leaks. Food-grade polymer safe for potable water lines.",
    features: [
      "1/4-inch push-fit quick connector",
      "Universal fit across major brands",
      "Food-grade, BPA-free polymer",
      "Leak-proof O-ring seal",
      "No tools required",
    ],
  },
  {
    id: 18,
    name: "KENT Bathroom Water Softener",
    category: "Water Softeners",
    tag: "Popular",
    price: 14400,
    original: 18000,
    image: "/images/product-18.png",
    images: [
      "/images/product-18.png",
      "/images/water-softners.png",
      "/images/kent.jpg",
    ],
    description:
      "KENT Bathroom Water Softener removes hardness from your bath supply — no more dry skin, brittle hair or scaled fittings. Compact wall-mounted body, ready to plumb into a single bathroom line.",
    features: [
      "Softens water for a single bathroom",
      "Reduces skin dryness and hair fall",
      "Extends life of taps, showers and geysers",
      "Compact wall-mounted design",
      "Easy regeneration with common salt",
    ],
  },
];
