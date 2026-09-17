"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import {
  deliveryZones,
  getDeliveryZoneByPincode,
  pickupLocations,
} from "@/lib/data";
import type {
  FulfillmentType,
  OrderItem,
  PaymentMethod,
} from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface CartItem extends OrderItem {
  requiresManualQuote?: boolean;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("pickup");
  const [pickupLocationId, setPickupLocationId] = useState(
    pickupLocations[0].id
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("counter");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") ?? "[]");
    setCart(stored);
  }, []);

  const deliveryCharge =
    fulfillmentType === "delivery"
      ? (getDeliveryZoneByPincode(deliveryPincode)?.charge ?? 0)
      : 0;

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal + deliveryCharge;

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const placeOrder = async () => {
    if (!name || !email || !phone) {
      setError("Please fill in your name, email, and phone.");
      return;
    }

    if (fulfillmentType === "delivery" && (!deliveryAddress || !deliveryPincode)) {
      setError("Please provide delivery address and pincode.");
      return;
    }

    if (
      fulfillmentType === "delivery" &&
      !getDeliveryZoneByPincode(deliveryPincode)
    ) {
      setError("Sorry, we do not deliver to this pincode yet.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const pickupLocation = pickupLocations.find(
        (p) => p.id === pickupLocationId
      );

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone, studentId: studentId || undefined },
          items: cart,
          subtotal,
          deliveryCharge,
          total,
          paymentMethod,
          fulfillmentType,
          pickupLocationId:
            fulfillmentType === "pickup" ? pickupLocationId : undefined,
          pickupLocationName: pickupLocation?.name,
          deliveryAddress:
            fulfillmentType === "delivery" ? deliveryAddress : undefined,
          deliveryPincode:
            fulfillmentType === "delivery" ? deliveryPincode : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to place order");
      }

      const order = await response.json();
      localStorage.removeItem("cart");
      window.location.href = `/orders/${order.orderNumber}?placed=1`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-slate-600">
          Browse products and add items to checkout.
        </p>
        <Link href="/categories/academic" className="mt-6 inline-block">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Continue shopping
      </Link>

      <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="mb-4 font-semibold">Your details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Student ID (optional)" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Pickup or delivery</h2>
            <div className="mb-4 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={fulfillmentType === "pickup"}
                  onChange={() => setFulfillmentType("pickup")}
                />
                Campus pickup
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={fulfillmentType === "delivery"}
                  onChange={() => setFulfillmentType("delivery")}
                />
                Delivery
              </label>
            </div>

            {fulfillmentType === "pickup" ? (
              <Select
                label="Pickup location"
                value={pickupLocationId}
                onChange={(e) => setPickupLocationId(e.target.value)}
                options={pickupLocations.map((p) => ({
                  value: p.id,
                  label: `${p.name} — ${p.hours}`,
                }))}
              />
            ) : (
              <div className="space-y-4">
                <Textarea
                  label="Delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
                <Input
                  label="Pincode"
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                />
                {deliveryPincode && (
                  <p className="text-sm text-slate-600">
                    Delivery charge:{" "}
                    {getDeliveryZoneByPincode(deliveryPincode)
                      ? formatCurrency(
                          getDeliveryZoneByPincode(deliveryPincode)!.charge
                        )
                      : "Not available for this pincode"}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  Delivery areas:{" "}
                  {deliveryZones.map((z) => z.name).join(", ")}
                </p>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Payment method</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3">
                <input
                  type="radio"
                  checked={paymentMethod === "counter"}
                  onChange={() => setPaymentMethod("counter")}
                />
                <div>
                  <p className="font-medium">Pay at counter on pickup</p>
                  <p className="text-xs text-slate-500">Cash or UPI at the press</p>
                </div>
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3">
                <input
                  type="radio"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <div>
                  <p className="font-medium">Pay online (UPI / Card)</p>
                  <p className="text-xs text-slate-500">
                    Razorpay — configure keys in production
                  </p>
                </div>
              </label>
            </div>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <h2 className="mb-4 font-semibold">Order summary</h2>
            <ul className="space-y-4">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start justify-between gap-2 border-b border-slate-100 pb-4"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-slate-500">
                      Qty {item.quantity} · {item.paperTypeName} ·{" "}
                      {item.paperSizeName}
                    </p>
                    {item.requiresManualQuote && (
                      <p className="text-xs text-amber-600">Manual quote pending</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {item.totalPrice > 0
                        ? formatCurrency(item.totalPrice)
                        : "TBD"}
                    </span>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {deliveryCharge > 0 && (
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{formatCurrency(deliveryCharge)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <Button
              className="mt-6 w-full"
              onClick={placeOrder}
              disabled={submitting}
            >
              {submitting ? "Placing order..." : "Place Order"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
