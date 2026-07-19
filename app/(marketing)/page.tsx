import { AtAGlance } from "@/components/marketing/home/at-a-glance";
import { Hero } from "@/components/marketing/home/hero";
import { HerVoiceContest } from "@/components/marketing/home/hervoice-contest";
import { ImpactStory } from "@/components/marketing/home/impact-story";
import { MediaSpotlight } from "@/components/marketing/home/media-spotlight";
import { Mission } from "@/components/marketing/home/mission";
import { Newsletter } from "@/components/marketing/home/newsletter";
import { Partners } from "@/components/marketing/home/partners";
import { Programs } from "@/components/marketing/home/programs";
import { StatsBar } from "@/components/marketing/home/stats-bar";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <HerVoiceContest />
      <AtAGlance />
      <Mission />
      <Programs />
      <ImpactStory />
      <MediaSpotlight />
      <Partners />
      <Newsletter />
    </>
  );
}
