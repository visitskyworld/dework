import React from "react";
import getConfig from "next/config";
import { AppInitialProps, AppProps } from "next/app";
import { AppContextType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import "../../app/styles/globals.less";
import { withApollo, WithApolloProps } from "next-with-apollo";
import * as Sentry from "@sentry/nextjs";
import {
  Constants,
  siteDescription,
  siteTitle,
  siteURL,
} from "@dewo/app/util/constants";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { NextComponentType } from "next";
import { hotjar } from "react-hotjar";
import { FeedbackButton } from "@dewo/app/containers/feedback/FeedbackButton";
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

type Props = AppProps & WithApolloProps<any>;
const App: NextComponentType<AppContextType, AppInitialProps, Props> = ({
  Component,
  pageProps,
  apollo,
}) => {
  const imageUrl =
    "https://dework-og-image-fant.vercel.app/**Dework**.png?fontSize=100px&heights=300&images=https%3A%2F%2Fapp.dework.xyz%2Flogo.png&md=1&subtitle=The%20task%20manager%20for%20DAOs%20and%20decentralized%20work&widths=300";
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
        {/* <script defer>
          {Constants.ENVIRONMENT === "prod" &&
            `UST_CT = [];UST = { s: Date.now(), addTag: function(tag) { UST_CT.push(tag) } };UST.addEvent = UST.addTag;
            var ust_min_js = document.createElement("script");
            ust_min_js.src = 'https://analytics.dework.xyz/server/ust.min.js?v=4.2.0';
            document.head.appendChild(ust_min_js);`}
        </script> */}
      </Head>
      <ApolloProvider client={apollo as any}>
        <Component {...pageProps} />
        <FeedbackButton />
      </ApolloProvider>
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

export default withApollo(
  ({ initialState }) =>
    new ApolloClient({
      link: createHttpLink({
        uri: `${getConfig().publicRuntimeConfig.GRAPHQL_API_URL}/graphql`,
      }),
      cache: new InMemoryCache().restore(initialState || {}),
      defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
    })
)(App as any);
