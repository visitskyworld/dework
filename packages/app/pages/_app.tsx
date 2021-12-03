import React from "react";
import { AppInitialProps, AppProps } from "next/app";
import { AppContextType } from "next-server/dist/lib/utils";
import Head from "next/head";
import "../styles/globals.less";
import { withApollo, WithApolloProps } from "next-with-apollo";
import { getDataFromTree } from "@apollo/react-ssr";
import { AuthProvider } from "@dewo/app/contexts/AuthContext";
import { Constants } from "@dewo/app/util/constants";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAuthToken } from "@dewo/app/util/authToken";
import { NextComponentType } from "next";
import { hotjar } from "react-hotjar";

if (typeof window !== "undefined") hotjar.initialize(2731946, 6);

interface AuthProps {
  authenticated: boolean;
}

type Props = AppProps & WithApolloProps<any> & AuthProps;
const App: NextComponentType<AppContextType, AppInitialProps, Props> = ({
  Component,
  pageProps,
  apollo,
  authenticated,
}) => {
  return (
    <>
      <Head>
        <title>dewo</title>
        <meta
          name="description"
          content="dewo - the task manager for DAOs and decentralized work"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ApolloProvider client={apollo as any}>
        <AuthProvider authenticated={authenticated}>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    </>
  );
};

App.getInitialProps = async ({
  Component,
  ctx,
}): Promise<AppInitialProps & AuthProps> => {
  return {
    pageProps: await Component.getInitialProps?.(ctx),
    authenticated: !!getAuthToken(ctx as any),
  };
};

export default withApollo(
  ({ ctx, initialState }) => {
    const httpLink = createHttpLink({ uri: `${Constants.API_URL}/graphql` });
    const authLink = setContext((_, { headers }) => {
      const token = getAuthToken(ctx);
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });
    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache().restore(initialState || {}),
      // https://github.com/apollographql/react-apollo/issues/3358#issuecomment-521928891
      credentials: "same-origin",
      defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
    });
  },
  // Fetches all Apollo data on the server side
  { getDataFromTree }
)(App as any);
