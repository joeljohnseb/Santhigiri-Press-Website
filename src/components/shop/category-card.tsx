import Link from "next/link";
import {
  Award,
  BookOpen,
  Image,
  PartyPopper,
  Printer,
  type LucideIcon,
} from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Category } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "party-popper": PartyPopper,
  image: Image,
  award: Award,
  printer: Printer,
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.icon] ?? Printer;

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card hover className="h-full">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle>{category.name}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </Card>
    </Link>
  );
}
