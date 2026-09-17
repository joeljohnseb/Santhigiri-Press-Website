import Link from "next/link";
import { Package, Clock, IndianRupee, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllOrders, getOrderStats } from "@/lib/orders";
import { getStatusColor, getStatusLabel } from "@/lib/pricing";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getOrderStats();
  const orders = await getAllOrders();
  const recentOrders = orders.slice(0, 5);

  const statCards = [
    { label: "Total Orders", value: stats.total, icon: Package },
    { label: "Pending", value: stats.pending, icon: Clock },
    { label: "In Progress", value: stats.inProgress, icon: Package },
    { label: "Ready", value: stats.ready, icon: CheckCircle },
    { label: "Today's Orders", value: stats.todayOrders, icon: Clock },
    { label: "Revenue (paid)", value: formatCurrency(stats.revenue), icon: IndianRupee },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-slate-600">Overview of today&apos;s printing orders</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-brand-700 hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.orderNumber}`}>
              <Card hover className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-slate-500">
                    {order.customer.name} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                  <span className="font-semibold">{formatCurrency(order.total)}</span>
                </div>
              </Card>
            </Link>
          ))}
          {recentOrders.length === 0 && (
            <p className="text-center text-slate-500">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
