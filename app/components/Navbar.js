"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import SearchOverlay from "./SearchOverlay";
import { useSession } from "../lib/auth";
import { useCart } from "../lib/cart";
import styles from "./Navbar.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us"},
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact Us" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useSession();
  const { count: cartCount } = useCart();

  const onAccountClick = () => {
    if (isLoggedIn) router.push("/account");
    else setLoginOpen(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any page can request the login modal by dispatching `vrs-open-login`.
  useEffect(() => {
    const onOpen = () => setLoginOpen(true);
    window.addEventListener("vrs-open-login", onOpen);
    return () => window.removeEventListener("vrs-open-login", onOpen);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.brandText}>
            <b>VRS</b> Water Purifiers
          </span>
        </Link>

        <nav className={`${styles.nav} ${open ? styles.open : ""}`}>
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.link} ${active ? styles.linkActive : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className={styles.iconBtn}
            aria-label="Search"
          >
            <Icon name="search" />
          </button>
          <button
            type="button"
            onClick={onAccountClick}
            className={styles.iconBtn}
            aria-label={isLoggedIn ? "My account" : "Login"}
          >
            <Icon name="user" />
            {isLoggedIn && <span className={styles.authDot} aria-hidden />}
          </button>
          <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
            <Icon name="cart" />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>

          <button
            className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function Icon({ name }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    );
  }
  if (name === "user") {
    return (
      <svg {...common}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  if (name === "cart") {
    return (
      <svg {...common}>
        <circle cx="9" cy="21" r="1.6" />
        <circle cx="18" cy="21" r="1.6" />
        <path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h8.2a2 2 0 0 0 2-1.6L21 8H6" />
      </svg>
    );
  }
  return null;
}
