import { MapboxStyles } from "../mapbox";

export type ProductSize = "15_20" | "21_29" | "27_43";

export type ProductVariant = {
  size: ProductSize;
  price: number;
  productUid: string; // Gelato product ID for this size
};

export type Product = {
  id: number;
  name: string;
  description: string;
  variants: ProductVariant[]; // Array of size/price/productUid combinations
  image: string;
  style: string;
};

export const allProducts: Product[] = [
  {
    id: 1,
    name: "LIGHT monochrome",
    description: "LIGHT monochrome map",
    variants: [
      {
        size: "15_20",
        price: 30,
        productUid: "framed_poster_150x200-mm-6x8-inch_black_aluminum_w10xt22-mm_plexiglass_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver",
      },
      {
        size: "21_29",
        price: 45,
        productUid: "framed_poster_210x297mm-8x12-inch_black_aluminum_w10xt22-mm_plexiglass_a4-8x12-inch_170-gsm-65lb-coated-silk_4-0_ver",
      },
      {
        size: "27_43",
        price: 60,
        productUid: "framed_poster_279x432-mm-11x17-inch_black_aluminum_w10xt22-mm_plexiglass_280x430-mm-xl_170-gsm-65lb-coated-silk_4-0_ver",
      },
    ],
    image: "/products/map-1.1.png",
    style: MapboxStyles.LIGHT,
  },
  {
    id: 2,
    name: "DARK monochrome",
    description: "DARK monochrome map",
    variants: [
      {
        size: "15_20",
        price: 35,
        productUid: "framed_poster_150x200-mm-6x8-inch_black_aluminum_w10xt22-mm_plexiglass_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver",
      },
      {
        size: "21_29",
        price: 55,
        productUid: "framed_poster_210x297mm-8x12-inch_black_aluminum_w10xt22-mm_plexiglass_a4-8x12-inch_170-gsm-65lb-coated-silk_4-0_ver",
      },
      {
        size: "27_43",
        price: 70,
        productUid: "framed_poster_279x432-mm-11x17-inch_black_aluminum_w10xt22-mm_plexiglass_280x430-mm-xl_170-gsm-65lb-coated-silk_4-0_ver",
      },
    ],
    image: "/products/map-2.1.png",
    style: MapboxStyles.DARK,
  },
  {
    id: 3,
    name: "NAVIGATION DAY",
    description: "NAVIGATION DAY map",
    variants: [
      {
        size: "15_20",
        price: 35,
        productUid: "framed_poster_150x200-mm-6x8-inch_black_aluminum_w10xt22-mm_plexiglass_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver",
      },
      {
        size: "21_29",
        price: 55,
        productUid: "framed_poster_210x297mm-8x12-inch_black_aluminum_w10xt22-mm_plexiglass_a4-8x12-inch_170-gsm-65lb-coated-silk_4-0_ver",
      },
      {
        size: "27_43",
        price: 70,
        productUid: "framed_poster_279x432-mm-11x17-inch_black_aluminum_w10xt22-mm_plexiglass_280x430-mm-xl_170-gsm-65lb-coated-silk_4-0_ver",
      },
    ],
    image: "/products/map-3.1.png",
    style: MapboxStyles.NAVIGATION_DAY,
  },
  {
    id: 4,
    name: "NAVIGATION NIGHT",
    description: "NAVIGATION NIGHT map",
    variants: [
      {
        size: "15_20",
        price: 40,
        productUid: "framed_poster_150x200-mm-6x8-inch_black_aluminum_w10xt22-mm_plexiglass_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver",
      },
      {
        size: "21_29",
        price: 60,
        productUid: "framed_poster_210x297mm-8x12-inch_black_aluminum_w10xt22-mm_plexiglass_a4-8x12-inch_170-gsm-65lb-coated-silk_4-0_ver",
      },
      {
        size: "27_43",
        price: 80,
        productUid: "framed_poster_279x432-mm-11x17-inch_black_aluminum_w10xt22-mm_plexiglass_280x430-mm-xl_170-gsm-65lb-coated-silk_4-0_ver",
      },
    ],
    image: "/products/map-4.1.png",
    style: MapboxStyles.NAVIGATION_NIGHT,
  },
];

export function getProductsByIds(ids: number[]): Product[] {
  return allProducts.filter(product => ids.includes(product.id));
}

// Helper functions for working with variants
export function getVariantBySize(product: Product, size: ProductSize): ProductVariant | undefined {
  return product.variants.find(v => v.size === size);
}

export function getPriceBySize(product: Product, size: ProductSize): number | undefined {
  return product.variants.find(v => v.size === size)?.price;
}

export function getProductUidBySize(product: Product, size: ProductSize): string | undefined {
  return product.variants.find(v => v.size === size)?.productUid;
}

