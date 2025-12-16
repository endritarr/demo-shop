"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { allProducts, getPriceBySize, getVariantBySize, ProductSize } from "@/lib/products/products";
import LookupField from "@/components/ui/forms/LookupField";
import TextField from "@/components/ui/forms/TextField";
import DateField from "@/components/ui/forms/DateField";

type Poster = {
  mapImageDataUrl?: string;
  mapImageUrl?: string;
  posterDataUrl?: string;
  title: string;
  description: string;
  size: string;
  location: string;
  coordinates: { latitude: number; longitude: number };
};

export default function PosterForm({
  slug,
  style,
}: {
  slug: string;
  style: string;
}) {
  const { addToCart } = useCart();
  const productId = parseInt(slug, 10);
  const product = allProducts.find((p) => p.id === productId);

  // Debug logging
  useEffect(() => {
    console.log(
      "Slug:",
      slug,
      "Product ID:",
      productId,
      "Product found:",
      !!product
    );
  }, [slug, productId, product]);
  // Get today's date in YYYY-MM-DD format for the date input
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    location: "Winnenden, Germany",
    date: getTodayDate(),
    text: "A special memory from this place",
    shape: "rectangle" as "rectangle" | "heart" | "circle",
    size: "15_20" as "15_20" | "21_29" | "27_43",
  });
  const [poster, setPoster] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePoster = async () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000");

      const response = await fetch(`${baseUrl}/api/poster`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formData.date || "",
          text: formData.text || "",
          location: formData.location,
          style: style,
          shape: formData.shape,
          // Don't request PDF for preview - use PNG instead
          // PDF will be requested separately for download
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate poster");
      }

      // Preview always uses PNG format (JSON response)
      const data = await response.json();
      setPoster(data);
    } catch (err) {
      console.error("Error generating poster:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Generate poster automatically after user stops typing (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleGeneratePoster();
    }, 800); // Wait 800ms after user stops typing

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, formData.location, formData.date, formData.text, formData.shape]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const imageSrc =
    poster?.posterDataUrl ||
    poster?.mapImageUrl ||
    poster?.mapImageDataUrl ||
    "";

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-destructive">Error generating poster</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 lg:h-[calc(100vh-var(--header-total-height))] lg:overflow-hidden pb-8 lg:pb-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:h-full">
        {/* Poster - shown first on mobile, right on desktop */}
        <div className="order-1 lg:order-2 w-full lg:w-2/3 flex justify-center items-center lg:h-full overflow-visible min-h-[40vh] lg:min-h-0 lg:max-h-[85vh]">
          {loading ? (
            <div className="flex items-center justify-center w-full py-8 lg:h-full lg:py-0">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              </div>
            </div>
          ) : imageSrc ? (
            <div className="relative w-full lg:w-auto flex items-center justify-center p-1 sm:p-2 lg:h-full lg:max-h-[85vh]">
              <div
                className="border-black shadow-2xl rounded-xs flex items-center justify-center lg:h-full lg:max-h-[80vh]"
                style={{ borderWidth: "12px", borderStyle: "solid" }}
              >
                <Image
                  key={style}
                  src={imageSrc}
                  alt="Poster"
                  width={800}
                  height={1200}
                  unoptimized
                  className="w-full h-auto lg:h-full lg:w-auto rounded-sm"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "85vh",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full py-8 lg:h-full lg:py-0">
              <div className="text-center">
                <p className="text-lg text-muted-foreground">
                  No poster generated yet
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Fill in the form to generate a poster
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Form options - shown below on mobile, left on desktop */}
        <div className="order-2 lg:order-1 p-4 pb-8 lg:pb-4 w-full lg:w-1/3 flex flex-col gap-4 lg:overflow-y-auto lg:max-h-full">
          
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location"
            props={{ disabled: true }}
          />


          <DateField
            label="Date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            props={{ disabled: true }}
          />    

          <TextField
            label="Text"
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            placeholder="Enter text"
            props={{ disabled: true }}
          />


          <LookupField
            label="Shape"
            name="shape"
            value={formData.shape}
            onChange={handleInputChange}
            options={[
              { label: "Rectangle", value: "rectangle" },
              { label: "Circle", value: "circle" },
            ]}
            props={{ disabled: true }}
          />

          <LookupField
            label="Size"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            options={[
              { label: "15x20", value: "15_20" },
              { label: "21x29", value: "21_29" },
              { label: "27x43", value: "27_43" },
            ]}
            props={{ disabled: true }}
          />

          {/* add price here based on the size */}
          <p className="text-muted-foreground text-xl m-0 text-right pt-4">
            ${Math.round((product ? getPriceBySize(product, formData.size as ProductSize) ?? 0 : 0) * 0.75)}
            <span className="text-gray-600 text-md line-through ml-1 font-normal">
              ${product ? getPriceBySize(product, formData.size as ProductSize) ?? 0 : 0}
            </span>
          </p>
          

          <Button
            className="w-full"
            onClick={() => {
              if (product) {
                const variant = getVariantBySize(product, formData.size as ProductSize);
                if (variant) {
                  addToCart(product, variant);
                }
              }
            }}
            disabled={!product}
          >
            <ShoppingCartIcon className="w-4 h-4" />
            Add to Cart
          </Button>

          {/* <Button
            variant="outline"
            onClick={async () => {
              if (!poster) return;
              
              try {
                const baseUrl =
                  process.env.NEXT_PUBLIC_BASE_URL ||
                  (typeof window !== "undefined"
                    ? window.location.origin
                    : "http://localhost:3000");

                // Request PDF with default size 8x10 (you can make this configurable)
                const response = await fetch(`${baseUrl}/api/poster`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    date: formData.date || "",
                    text: formData.text || "",
                    location: formData.location,
                    style: style,
                    shape: formData.shape,
                    format: "pdf",
                    size: "8x10", // Default size, can be made configurable
                  }),
                });

                if (!response.ok) {
                  throw new Error("Failed to generate PDF");
                }

                // Get PDF blob and trigger download
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `poster-8x10.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } catch (error) {
                console.error("Error downloading PDF:", error);
                setError(error instanceof Error ? error.message : "Failed to download PDF");
              }
            }}
            disabled={!poster}
          >
            Download PDF
          </Button> */}
        </div>
      </div>
    </div>
  );
}
