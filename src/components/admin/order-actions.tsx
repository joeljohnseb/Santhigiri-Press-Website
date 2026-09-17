"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import type { OrderStatus } from "@/lib/types";

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Order Received" },
  { value: "confirmed", label: "Confirmed" },
  { value: "printing", label: "Printing" },
  { value: "ready", label: "Ready for Pickup" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function AdminOrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async () => {
    setLoading(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      <Select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        options={statuses}
        className="min-w-[220px]"
      />
      <Button onClick={updateStatus} disabled={loading}>
        {loading ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}
