"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusLabel } from "@/lib/pricing";
import type { Order } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!email && !orderNumber) return;

    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (email) params.set("email", email);
      if (orderNumber) params.set("orderNumber", orderNumber);

      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data ? [data] : []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Track your order</h1>
      <p className="mt-2 text-slate-600">
        Enter your email or order number to see order status
      </p>

      <Card className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@college.edu"
          />
          <Input
            label="Order number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="SG-20260915-1234"
          />
        </div>
        <Button className="mt-4" onClick={search} disabled={loading}>
          <Search className="h-4 w-4" />
          {loading ? "Searching..." : "Track Order"}
        </Button>
      </Card>

      {searched && orders.length === 0 && (
        <p className="mt-8 text-center text-slate-500">No orders found.</p>
      )}

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.orderNumber}`}>
            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-slate-500">
                    {formatDate(order.createdAt)} · {order.items.length} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                  <p className="mt-2 font-semibold">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
