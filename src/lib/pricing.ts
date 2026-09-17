import {
  getPaperSizeById,
  getPaperTypeById,
  getProductById,
  pricingRules,
} from "./data";
import type { QuoteRequest, QuoteResponse } from "./types";

export function calculateQuote(request: QuoteRequest): QuoteResponse {
  const product = getProductById(request.productId);

  if (!product) {
    return {
      unitPrice: 0,
      totalPrice: 0,
      requiresManualQuote: true,
      message: "Product not found.",
      turnaroundHours: 48,
    };
  }

  if (product.requiresQuote) {
    return {
      unitPrice: 0,
      totalPrice: 0,
      requiresManualQuote: true,
      message: "Our team will confirm the price after reviewing your files.",
      turnaroundHours: product.turnaroundHours,
    };
  }

  const matchingRules = pricingRules
    .filter(
      (rule) =>
        rule.productId === request.productId &&
        rule.paperTypeId === request.paperTypeId &&
        rule.paperSizeId === request.paperSizeId &&
        rule.colorOption === request.colorOption &&
        request.quantity >= rule.minQuantity
    )
    .sort((a, b) => b.minQuantity - a.minQuantity);

  const bestRule = matchingRules[0];

  if (bestRule) {
    const totalPrice = bestRule.pricePerUnit * request.quantity;
    return {
      unitPrice: bestRule.pricePerUnit,
      totalPrice,
      requiresManualQuote: false,
      turnaroundHours: product.turnaroundHours,
    };
  }

  const paperType = getPaperTypeById(request.paperTypeId);
  const paperSize = getPaperSizeById(request.paperSizeId);
  const colorMultiplier = request.colorOption === "color" ? 5 : 1;
  const sizeMultiplier = paperSize?.name === "A3" ? 2 : 1;
  const estimatedUnit = Math.round(
    product.basePrice * colorMultiplier * sizeMultiplier
  );

  return {
    unitPrice: estimatedUnit,
    totalPrice: estimatedUnit * request.quantity,
    requiresManualQuote: false,
    message: `Estimated price using ${paperType?.name ?? "selected paper"} / ${paperSize?.name ?? "selected size"}. Final price confirmed at checkout.`,
    turnaroundHours: product.turnaroundHours,
  };
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Order Received",
    confirmed: "Confirmed",
    printing: "Printing",
    ready: "Ready for Pickup",
    out_for_delivery: "Out for Delivery",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    printing: "bg-purple-100 text-purple-800",
    ready: "bg-teal-100 text-teal-800",
    out_for_delivery: "bg-indigo-100 text-indigo-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] ?? "bg-slate-100 text-slate-800";
}
