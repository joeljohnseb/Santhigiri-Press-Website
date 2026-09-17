import { NextResponse } from "next/server";
import { getOrderById, updateOrderPayment, updateOrderStatus } from "@/lib/orders";
import type { OrderStatus } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminSession = request.headers.get("cookie")?.includes("admin_session=authenticated");
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (body.status) {
    const order = await updateOrderStatus(id, body.status as OrderStatus);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  if (body.paymentStatus) {
    const order = await updateOrderPayment(id, body.paymentStatus);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}
