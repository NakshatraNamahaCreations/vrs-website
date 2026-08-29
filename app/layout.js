import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "VRS Water Purifiers — Premium Drinking Water Systems for Every Home",
  description:
    "Discover a curated range of RO, UV, UF, alkaline and copper water purifiers engineered for pure, healthy and great tasting water. Domestic and commercial solutions.",
  keywords: [
    "water purifier",
    "RO water purifier",
    "alkaline water purifier",
    "UV water purifier",
    "copper water purifier",
    "commercial water purifier",
    "VRS Water Purifiers",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
