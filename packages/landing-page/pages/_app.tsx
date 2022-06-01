import React from "react";
import getConfig from "next/config";
import { AppInitialProps, AppProps } from "next/app";
import { AppContextType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import "../../app/styles/globals.less";
import * as Sentry from "@sentry/nextjs";
import {
  Constants,
  siteDescription,
  siteTitle,
  siteURL,
} from "@dewo/app/util/constants";
import { NextComponentType } from "next";
import { hotjar } from "react-hotjar";
import { isSSR } from "@dewo/app/util/isSSR";

if (!isSSR && Constants.ENVIRONMENT === "prod") {
  const { ID, version } = Constants.hotjarConfig;
  hotjar.initialize(ID, version);
}

Sentry.init({
  dsn: Constants.SENTRY_DSN,
  environment: Constants.ENVIRONMENT,
  ignoreErrors: ["ResizeObserver loop limit exceeded"],
});

const App: NextComponentType<AppContextType, AppInitialProps, AppProps> = ({
  Component,
  pageProps,
}) => {
  const imageUrl =
    "https://dework-og-image-fant.vercel.app/Dework.png?fontSize=100px&heights=300&images=https%3A%2F%2Fapp.dework.xyz%2Flogo.png&md=1&subtitle=The%20task%20manager%20for%20DAOs%20and%20decentralized%20work&widths=300";
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteURL} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={imageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteURL} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={imageUrl} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <link rel="icon" href="/logo.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

App.getInitialProps = async ({ Component, ctx }): Promise<AppInitialProps> => {
  if (ctx.res?.statusCode === 404) {
    ctx.res.writeHead(301, {
      location: `${getConfig().publicRuntimeConfig.APP_URL}${ctx.asPath}`,
    });
    ctx.res.end();
  }

  return {
    pageProps: await Component.getInitialProps?.(ctx),
  };
};

export default App;
