"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { FileUpload } from "@/components/shop/file-upload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import {
  categories,
  getPaperSizeById,
  getPaperTypeById,
  getProductById,
  paperSizes,
  paperTypes,
} from "@/lib/data";
import type { ColorOption, QuoteResponse, UploadedFile } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paperTypeId, setPaperTypeId] = useState(paperTypes[0].id);
  const [paperSizeId, setPaperSizeId] = useState(paperSizes[0].id);
  const [colorOption, setColorOption] = useState<ColorOption>("bw");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  useEffect(() => {
    params.then(({ id }) => setProductId(id));
  }, [params]);

  const product = productId ? getProductById(productId) : undefined;
  const category = product
    ? categories.find((c) => c.id === product.categoryId)
    : undefined;

  useEffect(() => {
    if (!product) return;

    const fetchQuote = async () => {
      setLoadingQuote(true);
      try {
        const response = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            quantity,
            paperTypeId,
            paperSizeId,
            colorOption: product.supportsColor ? colorOption : "bw",
          }),
        });
        const data = await response.json();
        setQuote(data);
      } finally {
        setLoadingQuote(false);
      }
    };

    fetchQuote();
  }, [product, quantity, paperTypeId, paperSizeId, colorOption]);

  if (productId && !product) {
    notFound();
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-slate-500">
        Loading...
      </div>
    );
  }

  const addToCart = () => {
    const cartItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      paperTypeId,
      paperTypeName: getPaperTypeById(paperTypeId)?.name ?? "",
      paperSizeId,
      paperSizeName: getPaperSizeById(paperSizeId)?.name ?? "",
      colorOption: product.supportsColor ? colorOption : "bw",
      unitPrice: quote?.unitPrice ?? 0,
      totalPrice: quote?.totalPrice ?? 0,
      files,
      notes,
      requiresManualQuote: quote?.requiresManualQuote ?? false,
    };

    const existing = JSON.parse(localStorage.getItem("cart") ?? "[]");
    existing.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(existing));
    window.location.href = "/checkout";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href={category ? `/categories/${category.slug}` : "/"}
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-2 text-slate-600">{product.description}</p>
          <p className="mt-4 text-sm text-slate-500">
            Minimum quantity: {product.minQuantity} · Turnaround: ~
            {product.turnaroundHours} hours
          </p>
        </div>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Configure your order</h2>
          <div className="space-y-4">
            <Input
              label="Quantity"
              type="number"
              min={product.minQuantity}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(product.minQuantity, Number(e.target.value)))
              }
            />

            <Select
              label="Paper type"
              value={paperTypeId}
              onChange={(e) => setPaperTypeId(e.target.value)}
              options={paperTypes.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
            />

            <Select
              label="Paper size"
              value={paperSizeId}
              onChange={(e) => setPaperSizeId(e.target.value)}
              options={paperSizes.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
            />

            {product.supportsColor && (
              <Select
                label="Colour option"
                value={colorOption}
                onChange={(e) => setColorOption(e.target.value as ColorOption)}
                options={[
                  { value: "bw", label: "Black & White" },
                  { value: "color", label: "Colour" },
                ]}
              />
            )}

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Upload files
              </p>
              <FileUpload files={files} onChange={setFiles} />
            </div>

            <Textarea
              label="Special instructions (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Binding colour, double-sided, etc."
            />

            <div className="rounded-lg bg-brand-50 p-4">
              <p className="text-sm font-medium text-brand-900">Price quote</p>
              {loadingQuote ? (
                <p className="mt-1 text-sm text-brand-700">Calculating...</p>
              ) : quote?.requiresManualQuote ? (
                <p className="mt-1 text-sm text-brand-700">
                  {quote.message ?? "Manual quote required"}
                </p>
              ) : (
                <p className="mt-1 text-2xl font-bold text-brand-900">
                  {formatCurrency(quote?.totalPrice ?? 0)}
                  <span className="ml-2 text-sm font-normal text-brand-700">
                    ({formatCurrency(quote?.unitPrice ?? 0)} each)
                  </span>
                </p>
              )}
              {quote?.message && !quote.requiresManualQuote && (
                <p className="mt-1 text-xs text-brand-600">{quote.message}</p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={addToCart}
              disabled={files.length === 0}
            >
              <ShoppingCart className="h-4 w-4" />
              Proceed to Checkout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
