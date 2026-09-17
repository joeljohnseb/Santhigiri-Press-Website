import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card hover className="h-full">
        <div className="mb-3 flex items-start justify-between gap-2">
          <CardTitle>{product.name}</CardTitle>
          {product.requiresQuote ? (
            <Badge className="bg-amber-100 text-amber-800">Quote</Badge>
          ) : (
            <Badge className="bg-brand-100 text-brand-800">
              From {formatCurrency(product.basePrice)}
            </Badge>
          )}
        </div>
        <CardDescription>{product.description}</CardDescription>
        <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          Ready in ~{product.turnaroundHours}h
        </div>
      </Card>
    </Link>
  );
}
