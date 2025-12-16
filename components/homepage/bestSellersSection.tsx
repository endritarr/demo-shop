import ProductsGrid from "@/components/products/productsGrid";
import { getProductsByIds } from "@/lib/products/products";

const bestSellerIds = [1, 2, 3];
const products = getProductsByIds(bestSellerIds);
export default function BestSellersSection(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  return (
    <section
      className="flex flex-col container mx-auto min-h-[70vh] md:min-h-[calc(100vh-var(--header-height))]"
      {...props}
    >
      <div className="flex flex-col items-center justify-center pt-6 md:pt-10 px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4">
          Best Sellers <span className="text-primary">🔥</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
          Our most popular products.
        </p>
      </div>
      <div className="w-full pb-8 md:pb-12">
        <ProductsGrid products={products} />
      </div>
    </section>
  );
}
