import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ErrorLink, onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import absoluteUrl from "next-absolute-url";
import { MutableRefObject } from "react";
import { getAuthToken } from "../util/authToken";
import { Constants } from "../util/constants";
import { GetServerSidePropsContext, NextPageContext } from "next";

export function createApolloLink(
  origin: string,
  getAuthToken: () => string | undefined,
  onErrorRef?: MutableRefObject<ErrorLink.ErrorHandler | undefined>
): ApolloLink {
  const authLink = setContext((_, { headers }) => {
    const token = getAuthToken();
    return {
      headers: {
        origin,
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const httpLink = createHttpLink({
    uri: `${Constants.GRAPHQL_API_URL}/graphql`,
  });
  const errorLink = onError((error) => onErrorRef?.current?.(error));

  // if (typeof window === "undefined") {
  return ApolloLink.from([authLink, errorLink, httpLink]);
  // }

  // const wsLink = new WebSocketLink({
  //   uri: `${Constants.GRAPHQL_WS_URL}/graphql`,
  //   options: { reconnect: true },
  // });

  // const splitLink = split(
  //   ({ query }) => {
  //     const definition = getMainDefinition(query);
  //     return (
  //       definition.kind === "OperationDefinition" &&
  //       definition.operation === "subscription"
  //     );
  //   },
  //   wsLink,
  //   httpLink
  // );

  // return ApolloLink.from([authLink, errorLink, timeoutLink, splitLink]);
}

export const createApolloClient = (
  ctx: NextPageContext | GetServerSidePropsContext,
  initialState = {}
) => {
  const origin = absoluteUrl(ctx?.req).origin;
  return new ApolloClient({
    link: createApolloLink(origin, () => getAuthToken(ctx)),
    cache: new InMemoryCache().restore(initialState),
    // https://github.com/apollographql/react-apollo/issues/3358#issuecomment-521928891
    credentials: "same-origin",
    defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
  });
};
