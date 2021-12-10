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
  split,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getAuthToken } from "@dewo/app/util/authToken";
import { NextComponentType, NextPageContext } from "next";
import { hotjar } from "react-hotjar";
import { PermissionsProvider } from "@dewo/app/contexts/PermissionsContext";
import { getMainDefinition } from "@apollo/client/utilities";

if (typeof window !== "undefined") {
  const { ID, version } = Constants.hotjarConfig;
  hotjar.initialize(ID, version);
}

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
          <PermissionsProvider>
            <Component {...pageProps} />
          </PermissionsProvider>
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

function createApolloLink(ctx: NextPageContext | undefined): ApolloLink {
  const authLink = setContext((_, { headers }) => {
    const token = getAuthToken(ctx);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const httpLink = createHttpLink({
    uri: `${Constants.GRAPHQL_API_URL}/graphql`,
  });

  if (typeof window === "undefined") {
    return authLink.concat(httpLink);
  }

  const wsLink = new WebSocketLink({
    uri: `${Constants.GRAPHQL_WS_URL}/graphql`,
    options: { reconnect: true },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  return authLink.concat(splitLink);
}

export default withApollo(
  ({ ctx, initialState }) => {
    return new ApolloClient({
      link: createApolloLink(ctx),
      cache: new InMemoryCache().restore(initialState || {}),
      // https://github.com/apollographql/react-apollo/issues/3358#issuecomment-521928891
      credentials: "same-origin",
      defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
    });
  },
  // Fetches all Apollo data on the server side
  { getDataFromTree }
)(App as any);
