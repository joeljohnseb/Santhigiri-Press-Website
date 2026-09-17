import { NextResponse } from "next/server";
import { createOrder, getAllOrders, getOrderById, getOrdersByEmail } from "@/lib/orders";
import type { Order } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const orderNumber = searchParams.get("orderNumber");

  if (orderNumber) {
    const order = await getOrderById(orderNumber);
    return NextResponse.json(order ?? []);
  }

  if (email) {
    const orders = await getOrdersByEmail(email);
    return NextResponse.json(orders);
  }

  const adminSession = request.headers.get("cookie")?.includes("admin_session=authenticated");
  if (adminSession) {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  }

  return NextResponse.json({ error: "Provide email or orderNumber" }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const order = await createOrder({
      customer: body.customer,
      items: body.items,
      subtotal: body.subtotal,
      deliveryCharge: body.deliveryCharge ?? 0,
      total: body.total,
      status: "pending",
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentMethod === "online" ? "pending" : "pending",
      fulfillmentType: body.fulfillmentType,
      pickupLocationId: body.pickupLocationId,
      pickupLocationName: body.pickupLocationName,
      deliveryAddress: body.deliveryAddress,
      deliveryPincode: body.deliveryPincode,
    } satisfies Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">);

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
