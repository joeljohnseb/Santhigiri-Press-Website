import { notFound } from "next/navigation";
import { AdminOrderActions } from "@/components/admin/order-actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getOrderById } from "@/lib/orders";
import { getStatusColor, getStatusLabel } from "@/lib/pricing";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{order.orderNumber}</h1>
          <p className="mt-1 text-slate-600">{formatDate(order.createdAt)}</p>
        </div>
        <Badge className={getStatusColor(order.status)}>
          {getStatusLabel(order.status)}
        </Badge>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Customer</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Name</dt>
              <dd className="font-medium">{order.customer.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Phone</dt>
              <dd className="font-medium">{order.customer.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium">{order.customer.email}</dd>
            </div>
            {order.customer.studentId && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Student ID</dt>
                <dd className="font-medium">{order.customer.studentId}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">Fulfillment & payment</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Type</dt>
              <dd className="font-medium capitalize">{order.fulfillmentType}</dd>
            </div>
            {order.pickupLocationName && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Pickup</dt>
                <dd className="font-medium">{order.pickupLocationName}</dd>
              </div>
            )}
            {order.deliveryAddress && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Address</dt>
                <dd className="max-w-xs text-right font-medium">
                  {order.deliveryAddress}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-500">Payment</dt>
              <dd className="font-medium capitalize">
                {order.paymentMethod} — {order.paymentStatus}
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <dt className="font-semibold">Total</dt>
              <dd className="text-lg font-bold">{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="mb-4 font-semibold">Order items</h2>
        <ul className="space-y-4">
          {order.items.map((item, index) => (
            <li key={index} className="border-b border-slate-100 pb-4 last:border-0">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-slate-500">
                    Qty {item.quantity} · {item.paperTypeName} · {item.paperSizeName}
                  </p>
                  {item.notes && (
                    <p className="mt-1 text-sm text-amber-700">Note: {item.notes}</p>
                  )}
                  {item.files.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {item.files.map((file) => (
                        <li key={file.id}>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-brand-700 hover:underline"
                          >
                            {file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="font-medium">
                  {item.totalPrice > 0
                    ? formatCurrency(item.totalPrice)
                    : "Quote pending"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <h2 className="mb-4 font-semibold">Update status</h2>
        <AdminOrderActions orderId={order.id} currentStatus={order.status} />
      </Card>
    </div>
  );
}
