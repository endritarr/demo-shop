import HeroSection from "@/components/homepage/heroSection";
import AttentionSection from "@/components/homepage/attentionSection";
import BestSellersSection from "@/components/homepage/bestSellersSection";
import TrustSection from "@/components/homepage/trustSection";
import ReviewSection from "@/components/homepage/reviewSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AttentionSection />
      <BestSellersSection className="bg-muted/10 p-5"/>
      <ReviewSection />
      <TrustSection className="bg-muted-foreground/50 p-5"/>
    </>
  );
}
