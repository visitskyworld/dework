import React, { MutableRefObject, useEffect, useRef } from "react";
import { AppInitialProps, AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.less";
import { withApollo, WithApolloProps } from "next-with-apollo";
import * as Sentry from "@sentry/nextjs";
import { AuthProvider } from "@dewo/app/contexts/AuthContext";
import { Constants } from "@dewo/app/util/constants";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ErrorLink, onError } from "@apollo/client/link/error";
import { getAuthToken } from "@dewo/app/util/authToken";
import { NextComponentType } from "next";
import { hotjar } from "react-hotjar";
import { PermissionsProvider } from "@dewo/app/contexts/PermissionsContext";
import { InviteMessageToast } from "@dewo/app/containers/invite/InviteMessageToast";
import { SidebarProvider } from "@dewo/app/contexts/sidebarContext";
import { useRouter } from "next/router";
import { useOrganization } from "@dewo/app/containers/organization/hooks";
import { useProject } from "@dewo/app/containers/project/hooks";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { TaskUpdateModalListener } from "@dewo/app/containers/task/TaskUpdateModal";
import { FeedbackButton } from "@dewo/app/containers/feedback/FeedbackButton";
import { ServerErrorModal } from "@dewo/app/components/ServerErrorModal";
import { getDataFromTree } from "@apollo/react-ssr";
import { AppContextType } from "next/dist/shared/lib/utils";
import { FallbackSeo } from "@dewo/app/containers/seo/FallbackSeo";

if (typeof window !== "undefined" && Constants.ENVIRONMENT === "prod") {
  const { ID, version } = Constants.hotjarConfig;
  hotjar.initialize(ID, version);
}

const faviconByEnvironment: Record<typeof Constants.ENVIRONMENT, string> = {
  dev: "/logo.dev.svg",
  demo: "/logo.demo.svg",
  prod: "/logo.svg",
};

Sentry.init({ dsn: Constants.SENTRY_DSN, environment: Constants.ENVIRONMENT });

interface AuthProps {
  initialAuthToken: string | undefined;
}

const SlugReplacer: React.FC = () => {
  // Replace slugs if wrong
  const router = useRouter();
  const { organizationSlug, projectSlug } = router.query;
  const organizationId = useParseIdFromSlug("organizationSlug");
  const { organization } = useOrganization(organizationId);
  useEffect(() => {
    if (
      organization &&
      organization.id === organizationId &&
      organizationSlug !== organization.slug
    ) {
      router.replace(
        { query: { ...router.query, organizationSlug: organization.slug } },
        undefined,
        { shallow: true }
      );
    }
  }, [organizationSlug, organizationId, organization, router]);

  const projectId = useParseIdFromSlug("projectSlug");
  const { project } = useProject(projectId);
  useEffect(() => {
    if (project && project.id === projectId && projectSlug !== project.slug) {
      router.replace(
        { query: { ...router.query, projectSlug: project.slug } },
        undefined,
        { shallow: true }
      );
    }
  }, [projectSlug, projectId, project, router]);

  return null;
};

type Props = AppProps & WithApolloProps<any> & AuthProps;
const App: NextComponentType<AppContextType, AppInitialProps, Props> = ({
  Component,
  pageProps,
  initialAuthToken,
  apollo,
}) => {
  const onErrorRef = useRef<ErrorLink.ErrorHandler>();
  apollo.setLink(
    createApolloLink(
      () => initialAuthToken || getAuthToken(undefined),
      onErrorRef
    )
  );
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <link
          rel="icon"
          href={faviconByEnvironment[Constants.ENVIRONMENT ?? "prod"]}
        />
        {/* <script defer>
          {Constants.ENVIRONMENT === "prod" &&
            `UST_CT = [];UST = { s: Date.now(), addTag: function(tag) { UST_CT.push(tag) } };UST.addEvent = UST.addTag;
            var ust_min_js = document.createElement("script");
            ust_min_js.src = 'https://analytics.dework.xyz/server/ust.min.js?v=4.2.0';
            document.head.appendChild(ust_min_js);`}
        </script> */}
      </Head>
      <FallbackSeo />
      <ApolloProvider client={apollo as any}>
        <AuthProvider
          initialAuthenticated={!!initialAuthToken || !!getAuthToken(undefined)}
        >
          <PermissionsProvider>
            <SidebarProvider>
              <Component {...pageProps} />
              <InviteMessageToast />
              <FeedbackButton />
              <SlugReplacer />
              <TaskUpdateModalListener />
              <ServerErrorModal onErrorRef={onErrorRef} />
            </SidebarProvider>
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
  if (ctx.res?.statusCode === 404) {
    ctx.res.writeHead(301, { location: "/" });
    ctx.res.end();
  }

  return {
    pageProps: await Component.getInitialProps?.(ctx),
    initialAuthToken: getAuthToken(ctx),
  };
};

function createApolloLink(
  getAuthToken: () => string | undefined,
  onErrorRef?: MutableRefObject<ErrorLink.ErrorHandler | undefined>
): ApolloLink {
  const authLink = setContext((_, { headers }) => {
    const token = getAuthToken();
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

export default withApollo(
  ({ ctx, initialState }) => {
    return new ApolloClient({
      link: createApolloLink(() => getAuthToken(ctx)),
      cache: new InMemoryCache().restore(initialState || {}),
      // https://github.com/apollographql/react-apollo/issues/3358#issuecomment-521928891
      credentials: "same-origin",
      defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
    });
  },
  // Fetches all Apollo data on the server side
  { getDataFromTree }
)(App as any);
