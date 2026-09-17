import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { OrderStatusTracker } from "@/components/shop/order-status";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getOrderById } from "@/lib/orders";
import { getStatusColor, getStatusLabel } from "@/lib/pricing";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { id } = await params;
  const { placed } = await searchParams;
  const order = await getOrderById(id);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Order not found</h1>
        <Link href="/orders" className="mt-4 inline-block text-brand-700">
          Search for your order
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {placed && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <p className="font-medium">
            Order placed successfully! Save your order number:{" "}
            <strong>{order.orderNumber}</strong>
          </p>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-slate-600">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge className={getStatusColor(order.status)}>
          {getStatusLabel(order.status)}
        </Badge>
      </div>

      <Card className="mt-8">
        <h2 className="mb-4 font-semibold">Order progress</h2>
        <OrderStatusTracker status={order.status} />
      </Card>

      <Card className="mt-6">
        <h2 className="mb-4 font-semibold">Items</h2>
        <ul className="space-y-4">
          {order.items.map((item, index) => (
            <li
              key={index}
              className="flex justify-between border-b border-slate-100 pb-4 last:border-0"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-slate-500">
                  Qty {item.quantity} · {item.paperTypeName} · {item.paperSizeName}{" "}
                  · {item.colorOption === "color" ? "Colour" : "B&W"}
                </p>
                {item.files.length > 0 && (
                  <p className="text-xs text-slate-400">
                    {item.files.length} file(s) uploaded
                  </p>
                )}
              </div>
              <p className="font-medium">
                {item.totalPrice > 0
                  ? formatCurrency(item.totalPrice)
                  : "Quote pending"}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-slate-200 pt-4 text-right">
          <p className="text-lg font-bold">{formatCurrency(order.total)}</p>
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="mb-4 font-semibold">Fulfillment</h2>
        {order.fulfillmentType === "pickup" ? (
          <div>
            <p className="font-medium">Campus pickup</p>
            <p className="text-sm text-slate-600">{order.pickupLocationName}</p>
          </div>
        ) : (
          <div>
            <p className="font-medium">Delivery</p>
            <p className="text-sm text-slate-600">{order.deliveryAddress}</p>
            <p className="text-sm text-slate-500">
              Pincode: {order.deliveryPincode}
            </p>
          </div>
        )}
        <p className="mt-3 text-sm text-slate-600">
          Payment:{" "}
          {order.paymentMethod === "online" ? "Online (UPI/Card)" : "Pay at counter"}{" "}
          — {order.paymentStatus}
        </p>
      </Card>
    </div>
  );
}
