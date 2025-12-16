"use client";

import {
  Card,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Product, getPriceBySize } from "@/lib/products/products";

export default function ProductItem({ product }: { product: Product }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product.id}?style=${product.style}`);
  };

  const handlePersonalize = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}?style=${product.style}`);
  };
  return (
    <Card
      className="py-0 gap-1"
    >
      <div className="p-4">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={400}
          className="object-contain rounded-sm w-full h-full"
          unoptimized
        />
      </div>
      
      <CardHeader className="text-lg p-4 pb-0" onClick={handleClick}>
        <CardTitle className="m-0">
          {product.name}

          <p className="text-muted-foreground text-sm m-0">
            From ${Math.round((getPriceBySize(product, "15_20") ?? 0) * 0.75)}
            <span className="text-gray-600 text-md line-through ml-1">
              ${getPriceBySize(product, "15_20") ?? 0}
            </span>
          </p>
        </CardTitle>
      </CardHeader>
      
      <div className="px-4 pt-0 pb-4" onClick={(e) => e.stopPropagation()}>
        <Button
          className="w-full"
          onClick={handlePersonalize}
          size="sm"
        >
          Personalize
        </Button>
      </div>

    </Card>
  );
}
