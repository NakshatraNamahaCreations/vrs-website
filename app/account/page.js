"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineShoppingBag,
  HiOutlineMapPin,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineInboxStack,
  HiChevronRight,
  HiOutlineExclamationTriangle,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiCheck,
  HiOutlineStar,
} from "react-icons/hi2";
import { useSession, clearSession } from "../lib/auth";
import {
  useAddresses,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
} from "../lib/address";
import { useOrders } from "../lib/orders";
import { usePincodeLookup } from "../lib/pincode";
import { resolveImg } from "../lib/cart";
import styles from "./account.module.css";

const CURRENT_STATUSES = new Set(["placed", "confirmed", "shipped", "out_for_delivery"]);
const STATUS_LABELS = {
  placed: "Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function shortOrderId(order) {
  const num = typeof order === "object" ? order?.orderNumber : null;
  if (num) return String(num).toUpperCase();
  const raw = typeof order === "object" ? order?._id : order;
  if (!raw) return "VRS-XXXXXX";
  return `VRS-${String(raw).slice(-6).toUpperCase()}`;
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return ""; }
}

const menu = [
  { id: "orders", label: "My Orders", icon: <HiOutlineShoppingBag /> },
  { id: "addresses", label: "Saved Addresses", icon: <HiOutlineMapPin /> },
  { id: "profile", label: "Edit Profile", icon: <HiOutlineUser /> },
];

export default function AccountPage() {
  const router = useRouter();
  const { session, ready } = useSession();
  const [active, setActive] = useState("orders");
  const [orderTab, setOrderTab] = useState("current");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e) => e.key === "Escape" && setConfirmOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [confirmOpen]);

  if (!ready) {
    return (
      <section className={styles.loading}>
        <div className="container">
          <p>Loading your account…</p>
        </div>
      </section>
    );
  }

  const initials = "V"; // placeholder — could be first letter of name
  const phone = session?.phone ? `+91 ${session.phone.slice(0, 5)} ${session.phone.slice(5)}` : "Guest";

  const confirmSignOut = () => {
    clearSession();
    setConfirmOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* HEADER STRIP */}
      <section className={styles.headerStrip}>
        <div className={styles.headerDecor} aria-hidden />
        <div className={`container ${styles.headerInner}`}>
          <div>
            <span className={styles.eyebrow}>My account <em /></span>
            <h1>Welcome back.</h1>
            <p>Manage your orders, addresses and profile in one place.</p>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <section className={styles.main}>
        <div className={`container ${styles.grid}`}>
          {/* LEFT — sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
              <div className={styles.avatar}>{initials}</div>
              <span className={styles.divider} />
              <b>{phone}</b>
              <em>Signed in</em>
            </div>

            <ul className={styles.menu}>
              {menu.map((m) => {
                const isActive = active === m.id;
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => setActive(m.id)}
                      className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                    >
                      <span className={styles.menuIcon}>{m.icon}</span>
                      <span>{m.label}</span>
                      <HiChevronRight className={styles.menuChev} />
                    </button>
                  </li>
                );
              })}
              <li>
                <button onClick={() => setConfirmOpen(true)} className={`${styles.menuItem} ${styles.menuItemDanger}`}>
                  <span className={styles.menuIcon}><HiOutlineArrowRightOnRectangle /></span>
                  <span>Sign Out</span>
                  <HiChevronRight className={styles.menuChev} />
                </button>
              </li>
            </ul>
          </aside>

          {/* RIGHT — content */}
          <div className={styles.content}>
            {active === "orders" && (
              <OrdersTab orderTab={orderTab} setOrderTab={setOrderTab} />
            )}

            {active === "addresses" && (
              <AddressesTab />
            )}

            {active === "profile" && (
              <>
                <header className={styles.contentHead}>
                  <h2>Edit Profile</h2>
                  <p>Update your personal details.</p>
                </header>

                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                  <div className={styles.row}>
                    <label className={styles.field}>
                      <span>First name</span>
                      <input type="text" placeholder="Enter first name" />
                    </label>
                    <label className={styles.field}>
                      <span>Last name</span>
                      <input type="text" placeholder="Enter last name" />
                    </label>
                  </div>
                  <label className={styles.field}>
                    <span>Email address</span>
                    <input type="email" placeholder="you@example.com" />
                  </label>
                  <label className={styles.field}>
                    <span>Mobile number</span>
                    <input type="tel" value={phone} readOnly />
                  </label>
                  <div className={styles.formFoot}>
                    <button type="submit" className={styles.saveBtn}>Save changes</button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      </section>

      {/* SIGN-OUT CONFIRMATION */}
      {mounted && confirmOpen && createPortal(
        <div className={styles.confirmOverlay} onClick={() => setConfirmOpen(false)} role="dialog" aria-modal="true">
          <div className={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <HiOutlineExclamationTriangle />
            </div>
            <h3>Sign out of VRS?</h3>
            <p>
              You&apos;ll need to log in again with your mobile number to access
              your orders, addresses and profile.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.confirmCancel}
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmYes}
                onClick={confirmSignOut}
              >
                Yes, sign out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/* -------------------- ADDRESSES TAB -------------------- */

const emptyAddress = {
  fullName: "",
  phone: "",
  label: "Home",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
};

function OrdersTab({ orderTab, setOrderTab }) {
  const { orders, ready } = useOrders();

  const filtered = orders.filter((o) =>
    orderTab === "current"
      ? CURRENT_STATUSES.has(o.orderStatus)
      : !CURRENT_STATUSES.has(o.orderStatus)
  );

  return (
    <>
      <header className={styles.contentHead}>
        <h2>My Orders</h2>
        <p>Track and manage your purchases.</p>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${orderTab === "current" ? styles.tabActive : ""}`}
          onClick={() => setOrderTab("current")}
        >
          Current
        </button>
        <button
          className={`${styles.tab} ${orderTab === "completed" ? styles.tabActive : ""}`}
          onClick={() => setOrderTab("completed")}
        >
          Completed
        </button>
      </div>

      {!ready ? (
        <div className={styles.emptyCard}>
          <p>Loading your orders…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyCard}>
          <span className={styles.emptyIcon}>
            <HiOutlineInboxStack />
          </span>
          <h3>No {orderTab} orders yet</h3>
          <p>
            Once you place an order, it&apos;ll show up here so you can
            track it every step of the way.
          </p>
          <Link href="/products" className={styles.emptyCta}>
            Browse products
          </Link>
        </div>
      ) : (
        <ul className={styles.orderList}>
          {filtered.map((o) => {
            const itemCount = (o.items || []).reduce((n, i) => n + (i.qty || 0), 0);
            return (
              <li key={o._id} className={styles.orderCard}>
                <div className={styles.orderHead}>
                  <div>
                    <span className={styles.orderIdLabel}>Order</span>
                    <b>{shortOrderId(o)}</b>
                  </div>
                  <span className={`${styles.orderStatus} ${styles[`status_${o.orderStatus}`] || ""}`}>
                    {STATUS_LABELS[o.orderStatus] || o.orderStatus}
                  </span>
                </div>

                <div className={styles.orderMeta}>
                  <span>Placed on <b>{formatDate(o.createdAt)}</b></span>
                  <span>·</span>
                  <span><b>{itemCount}</b> {itemCount === 1 ? "item" : "items"}</span>
                  <span>·</span>
                  <span>Total <b>₹{(o.total || 0).toLocaleString("en-IN")}</b></span>
                </div>

                {o.items && o.items.length > 0 && (
                  <div className={styles.orderThumbs}>
                    {o.items.slice(0, 4).map((it, i) => (
                      <div key={i} className={styles.orderThumb} title={it.name}>
                        {it.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={resolveImg(it.image)} alt={it.name} />
                        ) : (
                          <span>{(it.name || "?").slice(0, 1)}</span>
                        )}
                        {it.qty > 1 && <em>×{it.qty}</em>}
                      </div>
                    ))}
                    {o.items.length > 4 && (
                      <div className={styles.orderThumbMore}>+{o.items.length - 4}</div>
                    )}
                  </div>
                )}

                {o.shippingAddress && (
                  <div className={styles.orderShipTo}>
                    <span>Deliver to</span>
                    <em>
                      {o.shippingAddress.line1}
                      {o.shippingAddress.city && `, ${o.shippingAddress.city}`}
                      {o.shippingAddress.pincode && ` — ${o.shippingAddress.pincode}`}
                    </em>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function AddressesTab() {
  const { addresses, ready } = useAddresses();
  const [editing, setEditing] = useState(null); // null = closed, "new" = new form, "<id>" = edit
  const [draft, setDraft] = useState(emptyAddress);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const { status: pincodeStatus, message: pincodeMessage } = usePincodeLookup(draft.pincode, {
    onResolved: ({ city, state }) =>
      setDraft((d) => ({
        ...d,
        city: d.city || city,
        state: d.state || state,
      })),
  });

  const startNew = () => {
    setDraft(emptyAddress);
    setError("");
    setEditing("new");
  };

  const startEdit = (a) => {
    setDraft({
      fullName: a.fullName || "",
      phone: a.phone || "",
      label: a.label || "Home",
      line1: a.line1 || "",
      line2: a.line2 || "",
      city: a.city || "",
      state: a.state || "",
      pincode: a.pincode || "",
      landmark: a.landmark || "",
    });
    setError("");
    setEditing(a._id);
  };

  const cancel = () => {
    setEditing(null);
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (!draft.fullName.trim()) return setError("Enter your full name.");
    if (!/^\d{10}$/.test(draft.phone.replace(/\D/g, ""))) return setError("Enter a valid 10-digit phone.");
    if (!draft.line1.trim()) return setError("Enter your address.");
    if (!draft.city.trim() || !draft.state.trim()) return setError("City and state are required.");
    if (!/^\d{6}$/.test(draft.pincode)) return setError("Enter a valid 6-digit PIN code.");
    if (pincodeStatus === "invalid") return setError("This PIN code doesn't exist. Please re-check.");
    if (pincodeStatus === "checking") return setError("Verifying PIN code… please wait a moment.");

    const clean = { ...draft, phone: draft.phone.replace(/\D/g, "").slice(-10) };
    setSaving(true);
    try {
      if (editing === "new") await addAddress(clean);
      else await updateAddress(editing, clean);
      setEditing(null);
    } catch (err) {
      setError(err.message || "Couldn't save the address.");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this address?")) return;
    try { await removeAddress(id); } catch { /* silent */ }
  };

  const makeDefault = async (id) => {
    try { await setDefaultAddress(id); } catch { /* silent */ }
  };

  return (
    <>
      <header className={styles.contentHead}>
        <h2>Saved Addresses</h2>
        <p>Your delivery and service addresses.</p>
      </header>

      {ready && addresses.length === 0 && editing !== "new" ? (
        <div className={styles.emptyCard}>
          <span className={styles.emptyIcon}><HiOutlineMapPin /></span>
          <h3>No addresses saved</h3>
          <p>Add a delivery address to speed up your next order and service booking.</p>
          <button className={styles.emptyCta} onClick={startNew}>+ Add new address</button>
        </div>
      ) : (
        <>
          <div className={styles.addressList}>
            {addresses.map((a) => (
              <div key={a._id} className={`${styles.addressItem} ${a.isDefault ? styles.addressItemDefault : ""}`}>
                <div className={styles.addressItemHead}>
                  <span className={styles.addressPinTile}><HiOutlineMapPin /></span>
                  <div className={styles.addressItemInfo}>
                    <div className={styles.addressItemTitle}>
                      <b>{a.label || "Address"}</b>
                      {a.isDefault && (
                        <span className={styles.defaultChip}>
                          <HiOutlineStar /> Default
                        </span>
                      )}
                    </div>
                    <em>{a.fullName}{a.phone && ` · +91 ${a.phone}`}</em>
                    <p>
                      {a.line1}
                      {a.line2 && `, ${a.line2}`}
                      <br />
                      {a.city}, {a.state} — {a.pincode}
                      {a.landmark && <><br /><em>Landmark: {a.landmark}</em></>}
                    </p>
                  </div>
                </div>
                <div className={styles.addressItemActions}>
                  {!a.isDefault && (
                    <button className={styles.addressItemBtn} onClick={() => makeDefault(a._id)}>
                      <HiCheck /> Set as default
                    </button>
                  )}
                  <button className={styles.addressItemBtn} onClick={() => startEdit(a)}>
                    <HiOutlinePencilSquare /> Edit
                  </button>
                  <button className={`${styles.addressItemBtn} ${styles.addressItemBtnDanger}`} onClick={() => del(a._id)}>
                    <HiOutlineTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editing !== "new" && (
            <button className={styles.addressAddBtn} onClick={startNew}>
              <HiOutlineMapPin /> + Add another address
            </button>
          )}
        </>
      )}

      {editing !== null && (
        <form className={styles.addressFormCard} onSubmit={save}>
          <h3>{editing === "new" ? "New address" : "Edit address"}</h3>

          <div className={styles.addressFormRow}>
            <label>
              <span>Full name</span>
              <input value={draft.fullName} onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))} placeholder="Full name" />
            </label>
            <label>
              <span>Phone</span>
              <input type="tel" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} placeholder="10-digit mobile" />
            </label>
          </div>

          <div className={styles.addressFormRow}>
            <label>
              <span>Label</span>
              <select value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}>
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              <span>PIN code</span>
              <input
                value={draft.pincode}
                onChange={(e) => setDraft((d) => ({ ...d, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                placeholder="6-digit PIN"
                aria-invalid={pincodeStatus === "invalid" || undefined}
              />
              {pincodeStatus !== "idle" && (
                <em
                  style={{
                    display: "block",
                    marginTop: 6,
                    fontStyle: "normal",
                    fontSize: 12,
                    color:
                      pincodeStatus === "valid" ? "#0f8f6b" :
                      pincodeStatus === "invalid" ? "#e05252" :
                      "var(--muted)",
                  }}
                >
                  {pincodeStatus === "checking"
                    ? "Verifying PIN…"
                    : pincodeStatus === "valid"
                      ? `✓ ${pincodeMessage}`
                      : pincodeMessage}
                </em>
              )}
            </label>
          </div>

          <label className={styles.addressFormField}>
            <span>Address line 1</span>
            <input value={draft.line1} onChange={(e) => setDraft((d) => ({ ...d, line1: e.target.value }))} placeholder="House / flat, street" />
          </label>

          <label className={styles.addressFormField}>
            <span>Address line 2 (optional)</span>
            <input value={draft.line2} onChange={(e) => setDraft((d) => ({ ...d, line2: e.target.value }))} placeholder="Area, locality" />
          </label>

          <div className={styles.addressFormRow}>
            <label>
              <span>City</span>
              <input value={draft.city} onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))} placeholder="City" />
            </label>
            <label>
              <span>State</span>
              <input value={draft.state} onChange={(e) => setDraft((d) => ({ ...d, state: e.target.value }))} placeholder="State" />
            </label>
          </div>

          <label className={styles.addressFormField}>
            <span>Landmark (optional)</span>
            <input value={draft.landmark} onChange={(e) => setDraft((d) => ({ ...d, landmark: e.target.value }))} placeholder="Nearest landmark" />
          </label>

          {error && <p className={styles.addressFormError}>{error}</p>}

          <div className={styles.addressFormFoot}>
            <button type="button" className={styles.addressFormCancel} onClick={cancel}>Cancel</button>
            <button type="submit" className={styles.addressFormSave} disabled={saving}>
              <HiCheck /> {saving ? "Saving…" : editing === "new" ? "Save address" : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
