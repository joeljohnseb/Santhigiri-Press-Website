import { ProductCard } from "@/components/shop/product-card";
import { categories, products } from "@/lib/data";

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Products & pricing</h1>
      <p className="mt-1 text-slate-600">
        Product catalog is configured in <code className="text-sm">src/lib/data.ts</code>.
        Connect Supabase to manage products from the database in production.
      </p>

      {categories.map((category) => {
        const categoryProducts = products.filter(
          (p) => p.categoryId === category.id
        );
        if (categoryProducts.length === 0) return null;

        return (
          <div key={category.id} className="mt-10">
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
