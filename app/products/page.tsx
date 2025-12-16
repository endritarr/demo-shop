import ProductsGrid from "@/components/products/productsGrid";
import { allProducts } from "@/lib/products/products";

export default async function Products() {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const products = allProducts;
  return (
    <main className="container mx-auto py-8 px-4">
      <ProductsGrid products={products} />
    </main>
  );
}
