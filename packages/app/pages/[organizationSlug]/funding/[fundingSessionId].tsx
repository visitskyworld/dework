import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FundingSessionOverview } from "@dewo/app/containers/funding/overview/FundingSessionOverview";

const Page: NextPage = () => {
  const router = useRouter();
  const sessionId = router.query.fundingSessionId as string;
  return <FundingSessionOverview id={sessionId} />;
};

export default Page;
