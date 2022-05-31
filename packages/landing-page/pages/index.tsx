import React from "react";
import { HeroSection } from "../components/HeroSection";
import { Header } from "../components/Header";
import { SocialProofSection } from "../components/SocialProofSection";

const Page = () => (
  <>
    <Header />
    <HeroSection />
    <SocialProofSection />
    {/* <ProductSection appUrl={appUrl} />
    <ExplorePopularDaosSection />
    <BookDemoSection />
    <LandingPageFooter /> */}
  </>
);

export default Page;
