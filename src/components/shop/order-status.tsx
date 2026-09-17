import { getStatusColor, getStatusLabel } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/types";

const steps: OrderStatus[] = [
  "pending",
  "confirmed",
  "printing",
  "ready",
  "completed",
];

export function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const currentIndex = steps.indexOf(
    status === "out_for_delivery" ? "ready" : status
  );

  return (
    <div className="space-y-4">
      <Badge className={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex && status !== "cancelled";
          const isCurrent = step === status;

          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? "bg-brand-700 text-white"
                    : "bg-slate-200 text-slate-500"
                } ${isCurrent ? "ring-4 ring-brand-100" : ""}`}
              >
                {index + 1}
              </div>
              <p className="mt-2 hidden text-center text-xs text-slate-600 sm:block">
                {getStatusLabel(step)}
              </p>
              {index < steps.length - 1 && (
                <div
                  className={`absolute hidden h-0.5 sm:block ${
                    isActive ? "bg-brand-700" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
