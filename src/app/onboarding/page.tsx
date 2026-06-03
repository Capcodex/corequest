import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { OnboardingPanel } from "@/components/onboarding/OnboardingPanel";

export default function OnboardingPage() {
  return (
    <div className="py-10">
      <TrackEventOnMount eventName="onboarding_started" />
      <OnboardingPanel />
    </div>
  );
}
