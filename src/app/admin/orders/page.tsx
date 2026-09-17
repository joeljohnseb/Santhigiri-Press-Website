import Link from "next/link";
import { getAllOrders } from "@/lib/orders";
import { getStatusColor, getStatusLabel } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
      <p className="mt-1 text-slate-600">{orders.length} total orders</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.orderNumber}`}
                    className="font-medium text-brand-700 hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p>{order.customer.name}</p>
                  <p className="text-xs text-slate-500">{order.customer.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </td>
                <td className="px-4 py-3 capitalize">{order.paymentStatus}</td>
                <td className="px-4 py-3 font-medium">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-slate-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
