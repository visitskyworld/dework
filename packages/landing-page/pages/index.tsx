import React from "react";
import { Layout } from "antd";
import { HeroSection } from "../components/HeroSection";
import { Header } from "../components/Header";
import { SocialProofSection } from "../components/SocialProofSection";
import { FeatureTabsSecton } from "../components/FeatureTabsSection";
import { BookDemoSection } from "../components/BookDemoSection";
import { LandingPageFooter } from "../components/Footer";
import { ForDAOsSection } from "../components/ForDAOsSection";

const Page = () => (
  <Layout style={{ overflowY: "auto", display: "block" }}>
    <Header />
    <HeroSection />
    <SocialProofSection />
    <FeatureTabsSecton />
    <ForDAOsSection />
    <BookDemoSection />
    <LandingPageFooter />
  </Layout>
);

export default Page;
