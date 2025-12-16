"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartItem as CartItemType } from "@/contexts/CartContext";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, variant, quantity } = item;
  const discountedPrice = variant.price - variant.price * 0.25;
  const itemTotal = discountedPrice * quantity;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="relative w-full sm:w-32 h-48 sm:h-32 shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain rounded-md"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Size: {variant.size.replace("_", "x")}
              </p>
            </div>

            {/* Price and Quantity Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col">
                <div className="text-lg font-bold">
                  ${discountedPrice.toFixed(2)}
                  <span className="text-sm text-muted-foreground line-through ml-2">
                    ${variant.price.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: ${itemTotal.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(product.id, variant.productUid, quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(product.id, variant.productUid, quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeFromCart(product.id, variant.productUid)}
                  aria-label="Remove item"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

