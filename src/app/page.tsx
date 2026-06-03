import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProductPreview } from "@/components/home/ProductPreview";

export default function HomePage() {
  return (
    <div className="space-y-8 pb-16 pt-6">
      <TrackEventOnMount eventName="page_home_viewed" />
      <HeroSection />
      <HowItWorks />
      <ProductPreview />
    </div>
  );
}
