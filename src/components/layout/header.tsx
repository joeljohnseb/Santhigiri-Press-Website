import Link from "next/link";
import { Printer, ShoppingCart, Package, Shield } from "lucide-react";
import { businessInfo } from "@/lib/data";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white">
            <Printer className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{businessInfo.name}</p>
            <p className="text-xs text-slate-500">{businessInfo.tagline}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/categories/academic"
            className="text-sm font-medium text-slate-600 hover:text-brand-700"
          >
            Products
          </Link>
          <Link
            href="/orders"
            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-700"
          >
            <Package className="h-4 w-4" />
            Track Order
          </Link>
          <Link
            href="/checkout"
            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-700"
          >
            <ShoppingCart className="h-4 w-4" />
            Checkout
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-slate-600"
          >
            <Shield className="h-4 w-4" />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
