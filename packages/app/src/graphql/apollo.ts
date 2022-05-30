import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  useApolloClient,
} from "@apollo/client";
import { ErrorLink, onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import absoluteUrl from "next-absolute-url";
import { MutableRefObject, useEffect } from "react";
import { getAuthToken, isCookiesDisabled } from "../util/authToken";
import { Constants } from "../util/constants";
import { GetServerSidePropsContext, NextPageContext } from "next";
import { useAuthContext } from "../contexts/AuthContext";
import _ from "lodash";

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

  if (Constants.APOLLO_QUERY_LOGGING) {
    const loggingLink = new ApolloLink((operation, forward) => {
      console.log(`🔥 ${operation.operationName}`);
      operation.setContext({ start: new Date().getTime() });

      return forward(operation).map((data) => {
        const time = new Date().getTime() - operation.getContext().start;
        console.log(`✅ ${operation.operationName}: ${time}ms`);
        return data;
      });
    });
    return ApolloLink.from([loggingLink, authLink, errorLink, httpLink]);
  } else {
    return ApolloLink.from([authLink, errorLink, httpLink]);
  }
}

function lookupIdBySlug(
  cache: InMemoryCache,
  typename: string,
  slug: string
): string | undefined {
  // @ts-expect-error
  const data: Record<string, any> = cache.data.data;
  const keys = Object.keys(data).filter((k) => k.startsWith(`${typename}:`));
  const key = keys.find((key) => data[key]?.slug === slug);
  return !!key ? data[key]?.id : undefined;
}

export const createApolloClient = (
  ctx: NextPageContext | GetServerSidePropsContext,
  initialState = {}
) => {
  const origin = absoluteUrl(ctx?.req).origin;
  return new ApolloClient({
    link: createApolloLink(origin, () => getAuthToken(ctx)),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getOrganization: {
              read: (_, { args, toReference }) =>
                toReference({ __typename: "Organization", id: args?.id }),
            },
            getOrganizationIdBySlug: {
              read: (cached, { cache, args }) =>
                cached ?? lookupIdBySlug(cache, "Organization", args?.slug),
            },
            getProject: {
              read: (_, { args, toReference }) =>
                toReference({ __typename: "Project", id: args?.id }),
            },
            getProjectIdBySlug: {
              read: (cached, { cache, args }) =>
                cached ?? lookupIdBySlug(cache, "Project", args?.slug),
            },
            getTask: {
              read: (_, { args, toReference }) =>
                toReference({ __typename: "Task", id: args?.id }),
            },
            getPaginatedTasks: {
              keyArgs: ["filter"],
              // merge: (existing, incoming) => ({
              //   ...existing,
              //   ...incoming,
              //   tasks: [...(existing?.tasks ?? []), ...incoming.tasks],
              // }),
              merge: (existing, incoming) => {
                if (_.isEqual(existing, incoming)) return existing;
                return {
                  ...existing,
                  ...incoming,
                  tasks: [...(existing?.tasks ?? []), ...incoming.tasks],
                };
              },
            },
          },
        },
      },
    }).restore(initialState),
    // https://github.com/apollographql/react-apollo/issues/3358#issuecomment-521928891
    credentials: "same-origin",
    defaultOptions: { watchQuery: { fetchPolicy: "cache-first" } },
  });
};

export function useRefetchDataClientSideIfCookiesAreDisabled() {
  const apolloClient = useApolloClient();
  const authenticated = useAuthContext();

  useEffect(() => {
    if (authenticated && isCookiesDisabled(undefined)) {
      apolloClient.reFetchObservableQueries();
    }
  }, [authenticated, apolloClient]);
}
