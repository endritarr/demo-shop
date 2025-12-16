import Image from "next/image";
import styles from "./heroSection.module.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HeroSection() {
  return (
    <section className={`${styles.heroSectionBackground} flex items-center container mx-auto relative min-h-[70vh] md:min-h-[calc(100vh-var(--header-height))]`}>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 w-full py-8 md:py-12 px-4">
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative max-w-xs w-full">
            <Image
              src="/products/map-1.1.png"
              alt="Poster Gifts Hero"
              width={800}
              height={800}
              className="object-contain rounded-lg shadow-lg w-full h-auto"
              priority
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center mt-4 md:mt-0 text-center md:text-left px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 md:mb-4">Gifts That Speak from the Heart</h2>
          <p className="mb-4 md:mb-6 text-base md:text-lg text-muted-foreground max-w-md">
            Discover uniquely personalized poster gifts for every occasion and person you cherish.
          </p>
          <Button 
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 transition w-full sm:w-auto"
          >
            <Link href="/products">
              Explore Now
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
