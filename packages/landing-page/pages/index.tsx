import { Logo } from "@dewo/app/components/Logo";
import React from "react";
import { PageHeader, Button } from "antd";
import getConfig from "next/config";
import { ProductSection } from "../components/ProductSection";
import { ExplorePopularDaosSection } from "../components/ExplorePopularDaosSection";
import { LandingPageFooter } from "../components/Footer";
import { BookDemoSection } from "../components/BookDemoSection";

const appUrl = getConfig().publicRuntimeConfig.APP_URL;

const Page = () => (
  <>
    <PageHeader
      title={<Logo />}
      extra={[
        <Button key="open-app" type="primary" href={appUrl}>
          Open App
        </Button>,
      ]}
      style={{ width: "100%" }}
      className="max-w-xl mx-auto"
    />
    <ProductSection appUrl={appUrl} />
    <ExplorePopularDaosSection />
    <BookDemoSection />
    <LandingPageFooter />
  </>
);

export default Page;
