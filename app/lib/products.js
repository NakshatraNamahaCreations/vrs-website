// Shared product catalog. Update names, specs, and pricing as needed.

export const categories = [
  {
    id: "ro",
    name: "RO Purifiers",
    tagline: "Reverse Osmosis for the purest sip",
    description:
      "Multi-stage RO systems that remove up to 99% of dissolved impurities, heavy metals and microplastics while retaining essential minerals.",
  },
  {
    id: "alkaline",
    name: "Alkaline Purifiers",
    tagline: "Ionised, mineral-rich hydration",
    description:
      "Raises pH to 8.5–9.5 and infuses ionised minerals for better hydration, antioxidant benefits and improved metabolism.",
  },
  {
    id: "copper",
    name: "Copper Purifiers",
    tagline: "Ancient wisdom, modern engineering",
    description:
      "Charges purified water with the goodness of copper — believed to boost immunity, digestion and gut health as per Ayurveda.",
  },
  {
    id: "uv-uf",
    name: "UV + UF Purifiers",
    tagline: "For low-TDS municipal water",
    description:
      "Chemical-free ultraviolet and ultrafiltration purification that kills bacteria and viruses without stripping natural minerals.",
  },
  {
    id: "commercial",
    name: "Commercial &amp; Industrial",
    tagline: "High-capacity systems 25 LPH to 2000 LPH",
    description:
      "Reliable purification plants for offices, restaurants, schools, hospitals, factories and townships.",
  },
  {
    id: "accessories",
    name: "Filters &amp; Accessories",
    tagline: "Genuine cartridges and add-ons",
    description:
      "Sediment, carbon and RO membranes, TDS meters, pressure pumps, storage tanks and every spare you need to keep your purifier at peak performance.",
  },
];

export const products = [
  {
    id: "pristine-alkaline-pro",
    name: "Pristine Alkaline Pro",
    category: "alkaline",
    price: "₹22,900",
    tag: "Bestseller",
    capacity: "10 L",
    stages: "10 Stage",
    tds: "Up to 2000 ppm",
    features: [
      "Copper + Zinc + Alkaline cartridge",
      "Mineral RO with pH booster",
      "Smart LED indicators",
      "Detachable food-grade tank",
    ],
    accent: "linear-gradient(135deg,#14c9a1,#0f7fbf)",
  },
  {
    id: "aqua-copper-elite",
    name: "Aqua Copper Elite",
    category: "copper",
    price: "₹19,499",
    tag: "New",
    capacity: "8 L",
    stages: "9 Stage",
    tds: "Up to 1800 ppm",
    features: [
      "Real copper infusion chamber",
      "Iron & lead removal filter",
      "Auto flush RO membrane",
      "UV in-tank sterilisation",
    ],
    accent: "linear-gradient(135deg,#f0a24d,#c25b2a)",
  },
  {
    id: "pure-ro-max",
    name: "Pure RO Max",
    category: "ro",
    price: "₹15,900",
    capacity: "9 L",
    stages: "8 Stage",
    tds: "Up to 2500 ppm",
    features: [
      "High recovery RO membrane",
      "TDS controller for taste",
      "Anti-bacterial storage tank",
      "1-year comprehensive warranty",
    ],
    accent: "linear-gradient(135deg,#2aa7dd,#052a4a)",
  },
  {
    id: "hydra-uv-uf",
    name: "Hydra UV + UF",
    category: "uv-uf",
    price: "₹9,999",
    capacity: "7 L",
    stages: "6 Stage",
    tds: "Up to 500 ppm",
    features: [
      "For municipal & low TDS water",
      "UV + UF chemical-free purification",
      "Retains natural minerals",
      "Compact wall-mount design",
    ],
    accent: "linear-gradient(135deg,#6cc7ec,#0f7fbf)",
  },
  {
    id: "grande-100-lph",
    name: "Grande Commercial 100 LPH",
    category: "commercial",
    price: "On request",
    tag: "Commercial",
    capacity: "100 L / hr",
    stages: "9 Stage",
    tds: "Up to 3000 ppm",
    features: [
      "Stainless steel body",
      "Ideal for offices &amp; restaurants",
      "Auto shut-off &amp; pressure gauge",
      "Optional chiller add-on",
    ],
    accent: "linear-gradient(135deg,#0a4d7a,#14c9a1)",
  },
  {
    id: "titan-500-lph",
    name: "Titan Industrial 500 LPH",
    category: "commercial",
    price: "On request",
    capacity: "500 L / hr",
    stages: "12 Stage",
    tds: "Up to 5000 ppm",
    features: [
      "Skid mounted industrial plant",
      "Anti-scalant &amp; softener bundle",
      "PLC based automation",
      "Custom capacity up to 2000 LPH",
    ],
    accent: "linear-gradient(135deg,#052a4a,#0f7fbf)",
  },
  {
    id: "sediment-cartridge",
    name: "Sediment Filter Cartridge",
    category: "accessories",
    price: "₹350",
    capacity: "10 inch",
    stages: "5 micron",
    tds: "—",
    features: [
      "Removes rust, sand &amp; silt",
      "Compatible with all RO systems",
      "Food-grade polypropylene",
      "6 month service life",
    ],
    accent: "linear-gradient(135deg,#8ec5da,#3a556b)",
  },
  {
    id: "ro-membrane-100gpd",
    name: "RO Membrane 100 GPD",
    category: "accessories",
    price: "₹1,650",
    capacity: "100 GPD",
    stages: "Thin film",
    tds: "Up to 2000 ppm",
    features: [
      "Rejection rate 96%+",
      "Fits domestic RO housings",
      "Long service life",
      "OEM grade",
    ],
    accent: "linear-gradient(135deg,#14c9a1,#052a4a)",
  },
];

export const productsByCategory = categories.map((c) => ({
  ...c,
  items: products.filter((p) => p.category === c.id),
}));
