import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AttentionSection({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "flex items-center justify-center bg-muted-foreground/10 w-full",
        "min-h-[70vh] md:min-h-[calc(100vh-var(--header-height))]",
        "px-4",
        className?.replace(/h-screen/g, "") // Remove h-screen if passed since we use explicit height
      )}
      {...props}
    >
      <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full py-8 md:py-12">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center text-center md:text-left gap-4 md:gap-5 px-4 md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 md:mb-4 text-primary">
            Why Our Products Are Special
          </h2>
          <p className="mb-4 md:mb-6 text-base md:text-lg text-muted-foreground max-w-md">
            Personalized products are a unique way to express your love and appreciation.
            They are long lasting and can be customized to your liking. This demo shop
            showcases a full-stack e-commerce application with modern web development
            practices.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative max-w-xs w-full">
            <Image
              src="/products/map-2.1.png"
              alt="Demo Shop Product"
              width={800}
              height={800}
              className="object-contain rounded-lg shadow-lg w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
