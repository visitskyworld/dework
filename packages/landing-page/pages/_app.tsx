import React from "react";
import getConfig from "next/config";
import { AppInitialProps, AppProps } from "next/app";
import { AppContextType } from "next-server/dist/lib/utils";
import Head from "next/head";
import "../../app/styles/globals.less";
import { withApollo, WithApolloProps } from "next-with-apollo";
import { getDataFromTree } from "@apollo/react-ssr";
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

if (typeof window !== "undefined" && Constants.ENVIRONMENT === "prod") {
  const { ID, version } = Constants.hotjarConfig;
  hotjar.initialize(ID, version);
}

Sentry.init({ dsn: Constants.SENTRY_DSN, environment: Constants.ENVIRONMENT });

type Props = AppProps & WithApolloProps<any>;
const App: NextComponentType<AppContextType, AppInitialProps, Props> = ({
  Component,
  pageProps,
  apollo,
}) => {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteURL} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content="https://i.imgur.com/vs0aXnL.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteURL} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content="https://i.imgur.com/vs0aXnL.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <link rel="icon" href="/logo.svg" />
        <script defer>
          {Constants.ENVIRONMENT === "prod" &&
            `UST_CT = [];UST = { s: Date.now(), addTag: function(tag) { UST_CT.push(tag) } };UST.addEvent = UST.addTag;
            var ust_min_js = document.createElement("script");
            ust_min_js.src = 'https://analytics.dework.xyz/server/ust.min.js?v=4.2.0';
            document.head.appendChild(ust_min_js);`}
        </script>
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
    }),
  // Fetches all Apollo data on the server side
  { getDataFromTree }
)(App as any);
