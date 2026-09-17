import Link from "next/link";
import {
  ArrowRight,
  Clock,
  CreditCard,
  MapPin,
  Upload,
} from "lucide-react";
import { CategoryCard } from "@/components/shop/category-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { businessInfo, categories } from "@/lib/data";

const steps = [
  {
    icon: Upload,
    title: "Upload files",
    description: "Choose your product and upload PDF or image files",
  },
  {
    icon: CreditCard,
    title: "Get a quote & pay",
    description: "See instant pricing or request a custom quote",
  },
  {
    icon: MapPin,
    title: "Pickup on campus",
    description: "Collect from the press counter or a campus pickup point",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="mb-3 text-sm font-medium text-brand-100">
            Santhigiri College Campus
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            Print assignments, posters, and fest materials — without the queue
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-100">
            Order online, upload your files, pay via UPI, and pick up on campus.
            Simple printing for students and staff.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/categories/academic">
              <Button size="lg" variant="secondary">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/orders">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Track My Order
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-brand-100">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {businessInfo.hours}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Campus pickup available
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900">Browse by category</h2>
        <p className="mt-2 text-slate-600">
          Select a category to see available print services
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="mb-1 text-xs font-bold text-brand-700">
                  Step {index + 1}
                </p>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
