import ProductItem from "./productItem";
import { Product as ProductType } from "@/lib/products/products";

export default function ProductsGrid({ products }: { products: ProductType[] }) {
  return (
    <div className="flex justify-center w-full px-4">
      <div
        className="
                grid grid-cols-1 
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-[repeat(auto-fit,minmax(240px,280px))]
                gap-4 md:gap-5
                justify-items-center
                w-fit
                max-w-full
            "
      >
        {products.map((product: ProductType) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
