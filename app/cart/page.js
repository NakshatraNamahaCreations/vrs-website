"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiArrowLeft,
  HiArrowRight,
  HiMinus,
  HiPlus,
  HiOutlineTag,
  HiOutlineMapPin,
  HiOutlinePencilSquare,
  HiCheck,
} from "react-icons/hi2";
import { useCart, removeFromCart, updateQty, clearCart, resolveImg } from "../lib/cart";
import {
  useAddresses,
  addAddress,
  updateAddress,
  removeAddress as removeAddressApi,
  setDefaultAddress,
} from "../lib/address";
import { useSession } from "../lib/auth";
import { placeOrder, verifyRazorpayPayment, markRazorpayFailed } from "../lib/orders";
import { openRazorpayCheckout } from "../lib/razorpay";
import { usePincodeLookup } from "../lib/pincode";
import styles from "./cart.module.css";

const emptyAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
};

export default function CartPage() {
  const router = useRouter();
  const { cart, ready, count, subtotal, mrp, savings } = useCart();
  const { addresses, defaultAddress } = useAddresses();
  const { isLoggedIn } = useSession();

  const [draft, setDraft] = useState(emptyAddress);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addressError, setAddressError] = useState("");
  const [saving, setSaving] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");

  // Tracks whether the user tried to add an address while logged out so we
  // can auto-open the form for them the moment they finish logging in.
  const pendingAddOnLogin = useRef(false);

  const { status: pincodeStatus, message: pincodeMessage } = usePincodeLookup(draft.pincode, {
    onResolved: ({ city, state }) =>
      setDraft((d) => ({
        ...d,
        // Only auto-fill if the user hasn't typed something themselves.
        city: d.city || city,
        state: d.state || state,
      })),
  });

  // When the session flips to logged-in, clear any stale "please log in"
  // notices — and if the user was mid-flow trying to add an address, resume
  // by opening the form.
  useEffect(() => {
    if (!isLoggedIn) return;
    setAddressError("");
    setPlaceError((prev) => (prev === "Please log in to add a delivery address." ? "" : prev));
    if (pendingAddOnLogin.current) {
      pendingAddOnLogin.current = false;
      setDraft(emptyAddress);
      setEditingId(null);
      setEditing(true);
    }
  }, [isLoggedIn]);

  const openLoginModal = () => {
    // Navbar listens for this custom event and opens its LoginModal.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("vrs-open-login"));
    }
  };

  const onProceedToPayment = async () => {
    setPlaceError("");
    if (!address) {
      setPlaceError("Please add a delivery address first.");
      return;
    }
    if (!isLoggedIn) {
      setPlaceError("Please log in to complete your payment.");
      openLoginModal();
      return;
    }
    setPlacing(true);
    try {
      const { order, razorpay } = await placeOrder({
        shippingAddress: address,
        items: cart,
        subtotal,
        delivery,
        total,
        savings,
        paymentMethod: "RAZORPAY",
      });

      if (!razorpay?.key || !razorpay?.orderId) {
        throw new Error("Payment gateway is not configured. Please try again later.");
      }

      let paymentResponse;
      try {
        paymentResponse = await openRazorpayCheckout({
          key: razorpay.key,
          orderId: razorpay.orderId,
          amount: razorpay.amount,
          currency: razorpay.currency,
          description: order.orderNumber ? `Order ${order.orderNumber}` : "VRS order",
          prefill: {
            name: address.fullName || "",
            contact: address.phone || "",
          },
        });
      } catch (err) {
        // User cancelled or Razorpay reported failure — mark order failed and
        // route to the failure page. Keep the cart intact for retry.
        await markRazorpayFailed(order._id);
        router.push(`/payment-failed?id=${order.orderNumber || order._id}`);
        return;
      }

      await verifyRazorpayPayment(order._id, {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      // Cart is cleared server-side after successful verification; sync local.
      await clearCart();
      router.push(`/thank-you?id=${order.orderNumber || order._id}`);
    } catch (err) {
      setPlaceError(err.message || "Couldn't complete payment. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const address = defaultAddress;

  const openNewForm = () => {
    // Require login before letting the user create a delivery address —
    // addresses are stored on the backend under the logged-in user.
    if (!isLoggedIn) {
      setAddressError("Please log in to add a delivery address.");
      pendingAddOnLogin.current = true;
      openLoginModal();
      return;
    }
    setDraft(emptyAddress);
    setEditingId(null);
    setAddressError("");
    setEditing(true);
  };

  const cancelForm = () => {
    setEditing(false);
    setAddressError("");
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    setAddressError("");
    if (!draft.fullName.trim()) return setAddressError("Enter your full name.");
    if (!/^\d{10}$/.test(draft.phone.replace(/\D/g, ""))) return setAddressError("Enter a valid 10-digit phone number.");
    if (!draft.line1.trim()) return setAddressError("Enter your address.");
    if (!draft.city.trim() || !draft.state.trim()) return setAddressError("City and state are required.");
    if (!/^\d{6}$/.test(draft.pincode)) return setAddressError("Enter a valid 6-digit PIN code.");
    if (pincodeStatus === "invalid") return setAddressError("This PIN code doesn't exist. Please re-check.");
    if (pincodeStatus === "checking") return setAddressError("Verifying PIN code… please wait a moment.");

    const clean = { ...draft, phone: draft.phone.replace(/\D/g, "").slice(-10) };
    setSaving(true);
    try {
      if (editingId && editingId !== "guest") {
        await updateAddress(editingId, clean);
      } else {
        await addAddress(clean);
      }
      setEditing(false);
      setEditingId(null);
    } catch (err) {
      setAddressError(err.message || "Couldn't save your address.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAddress = async (id) => {
    const targetId = id || address?._id;
    if (!targetId) return;
    if (!confirm("Delete this address?")) return;
    try {
      await removeAddressApi(targetId);
      if (targetId === address?._id) {
        setEditing(false);
        setDraft(emptyAddress);
      }
    } catch (err) {
      setAddressError(err.message);
    }
  };

  const chooseAddress = async (id) => {
    if (id === address?._id) return;
    try { await setDefaultAddress(id); } catch { /* silent */ }
  };

  const startEdit = (addr) => {
    setDraft({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      landmark: addr.landmark || "",
    });
    setEditingId(addr._id);
    setAddressError("");
    setEditing(true);
  };


  // const delivery = subtotal >= 999 ? 0 : subtotal === 0 ? 0 : 79;
  const delivery = 0;
  const total = Math.max(0, subtotal + delivery);
  const totalSavings = savings;
  const canPay = !!address && cart.length > 0;

  if (!ready) return null;

  return (
    <>
      {/* HEADER */}
      <section className={styles.header}>
        <div className={styles.headerDecor} aria-hidden />
        <div className={`container ${styles.headerInner}`}>
          <div>
            <span className={styles.eyebrow}>Your bag <em /></span>
            <h1>Shopping cart</h1>
            <p>
              {count > 0
                ? `${count} ${count === 1 ? "item" : "items"} ready to check out.`
                : "Your cart is empty. Let's fix that."}
            </p>
          </div>
          <Link href="/products" className={styles.headerLink}>
            <HiArrowLeft /> Continue shopping
          </Link>
        </div>
      </section>

      {/* MAIN */}
      {cart.length === 0 ? (
        <section className={styles.emptySection}>
          <div className="container">
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>
                <HiOutlineShoppingBag />
              </span>
              <h2>Your cart is empty</h2>
              <p>Browse our range of premium water purifiers and genuine spare parts.</p>
              <Link href="/products" className={styles.emptyCta}>
                Browse products <HiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.main}>
          <div className={`container ${styles.grid}`}>
            {/* LEFT — items */}
            <div className={styles.items}>
              <div className={styles.itemsHead}>
                <b>Items in your cart</b>
                <button className={styles.clearBtn} onClick={clearCart}>
                  Clear all
                </button>
              </div>

              <ul className={styles.itemList}>
                {cart.map((item) => {
                  const off = item.original ? Math.round(((item.original - item.price) / item.original) * 100) : 0;
                  return (
                    <li key={item.id} className={styles.item}>
                      <Link href="/products" className={styles.itemImg}>
                        <img src={resolveImg(item.image)} alt={item.name} loading="lazy" />
                      </Link>

                      <div className={styles.itemBody}>
                        <span className={styles.itemCategory}>{item.category}</span>
                        <Link href="/products" className={styles.itemName}>{item.name}</Link>

                        <div className={styles.itemMeta}>
                          <span className={styles.itemPrice}>
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                          {item.original && (
                            <span className={styles.itemOrig}>
                              ₹{item.original.toLocaleString("en-IN")}
                            </span>
                          )}
                          {off > 0 && <span className={styles.itemOff}>{off}% off</span>}
                        </div>
                      </div>

                      <div className={styles.itemActions}>
                        <div className={styles.qty}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            aria-label="Decrease"
                          >
                            <HiMinus />
                          </button>
                          <span>{item.qty}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            aria-label="Increase"
                          >
                            <HiPlus />
                          </button>
                        </div>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeFromCart(item.id)}
                        >
                          <HiOutlineTrash /> Remove
                        </button>
                      </div>

                      <div className={styles.itemLineTotal}>
                        <span>Line total</span>
                        <b>₹{(item.price * item.qty).toLocaleString("en-IN")}</b>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* delivery address */}
              <div className={styles.addressBlock}>
                <div className={styles.addressHead}>
                  <div>
                    <span className={styles.addressLabel}>Deliver to</span>
                    <b>
                      {addresses.length > 0
                        ? `Choose an address (${addresses.length})`
                        : "Add a delivery address"}
                    </b>
                  </div>
                </div>

                {addresses.length > 0 && !editing && (
                  <div className={styles.addressPickerList}>
                    {addresses.map((a) => {
                      const active = a._id === address?._id;
                      return (
                        <div
                          key={a._id}
                          className={`${styles.addressPickerCard} ${active ? styles.addressPickerCardActive : ""}`}
                          onClick={() => chooseAddress(a._id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && chooseAddress(a._id)}
                        >
                          <span className={`${styles.addressRadio} ${active ? styles.addressRadioActive : ""}`}>
                            {active && <HiCheck />}
                          </span>
                          <div className={styles.addressPickerBody}>
                            <div className={styles.addressPickerTitle}>
                              <b>{a.label || "Address"}</b>
                              {a.isDefault && <span className={styles.addressPickerDefault}>Default</span>}
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
                          <div className={styles.addressPickerActions}>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); startEdit(a); }}
                              className={styles.addressItemBtnSm}
                              aria-label="Edit address"
                            >
                              <HiOutlinePencilSquare />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveAddress(a._id); }}
                              className={`${styles.addressItemBtnSm} ${styles.addressItemBtnSmDanger}`}
                              aria-label="Delete address"
                            >
                              <HiOutlineTrash />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      className={styles.addAddressBtnCompact}
                      onClick={openNewForm}
                    >
                      <HiOutlineMapPin /> + Add another address
                    </button>

                    {addressError && !editing && (
                      <p className={styles.addressError} role="alert">
                        {addressError}
                        {!isLoggedIn && (
                          <>
                            {" "}
                            <button
                              type="button"
                              onClick={openLoginModal}
                              className={styles.checkoutHintLink}
                            >
                              Log in
                            </button>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                )}

                {addresses.length === 0 && !editing ? (
                  <>
                    <button
                      type="button"
                      className={styles.addAddressBtn}
                      onClick={openNewForm}
                    >
                      <HiOutlineMapPin />
                      <div>
                        <b>+ Add delivery address</b>
                        <span>Required to proceed to payment</span>
                      </div>
                    </button>
                    {addressError && (
                      <p className={styles.addressError} role="alert">
                        {addressError}
                        {!isLoggedIn && (
                          <>
                            {" "}
                            <button
                              type="button"
                              onClick={openLoginModal}
                              className={styles.checkoutHintLink}
                            >
                              Log in
                            </button>
                          </>
                        )}
                      </p>
                    )}
                  </>
                ) : editing && (
                  <form className={styles.addressForm} onSubmit={saveAddress}>
                    <div className={styles.addressRow}>
                      <label>
                        <span>Full name</span>
                        <input
                          value={draft.fullName}
                          onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
                          placeholder="Full name"
                          autoFocus
                        />
                      </label>
                      <label>
                        <span>Phone</span>
                        <input
                          type="tel"
                          value={draft.phone}
                          onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                          placeholder="10-digit mobile"
                        />
                      </label>
                    </div>

                    <label className={styles.addressField}>
                      <span>Address line 1</span>
                      <input
                        value={draft.line1}
                        onChange={(e) => setDraft((d) => ({ ...d, line1: e.target.value }))}
                        placeholder="House / flat, street"
                      />
                    </label>

                    <label className={styles.addressField}>
                      <span>Address line 2 (optional)</span>
                      <input
                        value={draft.line2}
                        onChange={(e) => setDraft((d) => ({ ...d, line2: e.target.value }))}
                        placeholder="Area, locality"
                      />
                    </label>

                    <div className={styles.addressRow3}>
                      <label>
                        <span>City</span>
                        <input
                          value={draft.city}
                          onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
                          placeholder="City"
                        />
                      </label>
                      <label>
                        <span>State</span>
                        <input
                          value={draft.state}
                          onChange={(e) => setDraft((d) => ({ ...d, state: e.target.value }))}
                          placeholder="State"
                        />
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

                    <label className={styles.addressField}>
                      <span>Landmark (optional)</span>
                      <input
                        value={draft.landmark}
                        onChange={(e) => setDraft((d) => ({ ...d, landmark: e.target.value }))}
                        placeholder="Nearest landmark"
                      />
                    </label>

                    {addressError && (
                      <p className={styles.addressError}>{addressError}</p>
                    )}

                    <div className={styles.addressFormFoot}>
                      <button type="button" className={styles.addressCancel} onClick={cancelForm}>
                        Cancel
                      </button>
                      <button type="submit" className={styles.addressSave} disabled={saving}>
                        <HiCheck /> {saving ? "Saving…" : "Save address"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* trust strip */}
              <div className={styles.trust}>
                <div>
                  <span><HiOutlineTruck /></span>
                  <div>
                    <b>Free delivery</b>
                    <em>On orders above ₹999</em>
                  </div>
                </div>
                <div>
                  <span><HiOutlineShieldCheck /></span>
                  <div>
                    <b>Genuine spares</b>
                    <em>OEM parts, warrantied</em>
                  </div>
                </div>
                <div>
                  <span><HiOutlineTag /></span>
                  <div>
                    <b>Best price</b>
                    <em>Or we&apos;ll match it</em>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — summary */}
            <aside className={styles.summary}>
              <div className={styles.summaryCard}>
                <h3>Order summary</h3>

                <div className={styles.lines}>
                  <div className={styles.line}>
                    <span>MRP ({count} {count === 1 ? "item" : "items"})</span>
                    <b>₹{mrp.toLocaleString("en-IN")}</b>
                  </div>
                  <div className={`${styles.line} ${styles.lineSavings}`}>
                    <span>Product discount</span>
                    <b>− ₹{savings.toLocaleString("en-IN")}</b>
                  </div>
                  <div className={styles.line}>
                    <span>Delivery</span>
                    <b>{delivery === 0 ? "FREE" : `₹${delivery}`}</b>
                  </div>
                </div>

                <div className={styles.total}>
                  <span>Total payable</span>
                  <b>₹{total.toLocaleString("en-IN")}</b>
                </div>

                {totalSavings > 0 && (
                  <p className={styles.savingsPill}>
                    ✓ You&apos;re saving <b>₹{totalSavings.toLocaleString("en-IN")}</b> on this order
                  </p>
                )}

                <button
                  type="button"
                  onClick={onProceedToPayment}
                  className={styles.checkout}
                  disabled={!canPay || placing}
                  title={!canPay ? "Add a delivery address to continue" : undefined}
                >
                  {placing ? "Placing…" : (<>Proceed to payment <HiArrowRight /></>)}
                </button>

                {placeError && (
                  <p className={styles.checkoutHint} role="alert">
                    {placeError}
                    {!isLoggedIn && (
                      <>
                        {" "}
                        <button
                          type="button"
                          onClick={openLoginModal}
                          className={styles.checkoutHintLink}
                        >
                          Log in
                        </button>
                      </>
                    )}
                  </p>
                )}

                {!placeError && !address && cart.length > 0 && (
                  <p className={styles.checkoutHint}>
                    Add a delivery address above to continue.
                  </p>
                )}

                <p className={styles.securePay}>
                  🔒 100% secure payment · UPI · Cards · Netbanking
                </p>
              </div>
            </aside>
          </div>
        </section>
      )}
    </>
  );
}
