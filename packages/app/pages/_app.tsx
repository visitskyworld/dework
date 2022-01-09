import React, { useEffect } from "react";
import { AppInitialProps, AppProps } from "next/app";
import { AppContextType } from "next-server/dist/lib/utils";
import Head from "next/head";
import "../styles/globals.less";
import { withApollo, WithApolloProps } from "next-with-apollo";
import { getDataFromTree } from "@apollo/react-ssr";
import { WebSocketLink } from "@apollo/client/link/ws";
import * as Sentry from "@sentry/nextjs";
import { AuthProvider } from "@dewo/app/contexts/AuthContext";
import {
  Constants,
  siteDescription,
  siteTitle,
} from "@dewo/app/util/constants";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAuthToken } from "@dewo/app/util/authToken";
import { NextComponentType, NextPageContext } from "next";
import { hotjar } from "react-hotjar";
import { PermissionsProvider } from "@dewo/app/contexts/PermissionsContext";
import { InviteMessageToast } from "@dewo/app/containers/invite/InviteMessageToast";
import { SidebarProvider } from "@dewo/app/contexts/sidebarContext";
import { useRouter } from "next/router";
import { useOrganization } from "@dewo/app/containers/organization/hooks";
import { useProject } from "@dewo/app/containers/project/hooks";
import { useParseIdFromSlug } from "@dewo/app/util/uuid";
import { getMainDefinition } from "@apollo/client/utilities";
import { TaskUpdateModalListener } from "@dewo/app/containers/task/TaskUpdateModal";

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
  authenticated: boolean;
}

const SlugReplacer: React.FC = () => {
  // Replace slugs if wrong
  const router = useRouter();
  const { organizationSlug, projectSlug } = router.query;
  const organizationId = useParseIdFromSlug("organizationSlug");
  const organization = useOrganization(organizationId);
  useEffect(() => {
    if (
      organization &&
      organization.id === organizationId &&
      organizationSlug !== organization.slug
    ) {
      router.replace(
        { query: { ...router.query, organizationSlug: organization.slug } },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [organizationSlug, organizationId, organization, router]);

  const projectId = useParseIdFromSlug("projectSlug");
  const project = useProject(projectId);
  useEffect(() => {
    if (project && project.id === projectId && projectSlug !== project.slug) {
      router.replace(
        { query: { ...router.query, projectSlug: project.slug } },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [projectSlug, projectId, project, router]);

  return null;
};

type Props = AppProps & WithApolloProps<any> & AuthProps;
const App: NextComponentType<AppContextType, AppInitialProps, Props> = ({
  Component,
  pageProps,
  apollo,
}) => {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={`${siteDescription}`} />
        <meta name="img" content="https://i.imgur.com/vs0aXnL.png" />
        <link
          rel="icon"
          href={faviconByEnvironment[Constants.ENVIRONMENT ?? "prod"]}
        />
        <script>
          {Constants.ENVIRONMENT === "prod" &&
            `UST_CT = [];UST = { s: Date.now(), addTag: function(tag) { UST_CT.push(tag) } };UST.addEvent = UST.addTag;
            var ust_min_js = document.createElement("script");
            ust_min_js.src = 'https://analytics.dework.xyz/server/ust-rr.min.js?v=4.2.0';
            document.head.appendChild(ust_min_js);`}
        </script>
      </Head>
      <ApolloProvider client={apollo as any}>
        <AuthProvider>
          <PermissionsProvider>
            <SidebarProvider>
              <Component {...pageProps} />
              <InviteMessageToast />
              <SlugReplacer />
              <TaskUpdateModalListener />
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
