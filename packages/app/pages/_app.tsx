import React, { useEffect, useRef } from "react";
import { AppInitialProps, AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.less";
import { withApollo, WithApolloProps } from "next-with-apollo";
import * as Sentry from "@sentry/nextjs";
import { AuthProvider } from "@dewo/app/contexts/AuthContext";
import { Constants } from "@dewo/app/util/constants";
import { ErrorLink } from "@apollo/client/link/error";
import { getAuthToken } from "@dewo/app/util/authToken";
import { NextComponentType } from "next";
import { hotjar } from "react-hotjar";
import { PermissionsProvider } from "@dewo/app/contexts/PermissionsContext";
import { InviteMessageToast } from "@dewo/app/containers/invite/InviteMessageToast";
import { SidebarProvider } from "@dewo/app/contexts/sidebarContext";
import { useRouter } from "next/router";
import { TaskUpdateModalListener } from "@dewo/app/containers/task/TaskUpdateModal";
import absoluteUrl from "next-absolute-url";
import { FeedbackButton } from "@dewo/app/containers/feedback/FeedbackButton";
import { ServerErrorModal } from "@dewo/app/components/ServerErrorModal";
import { AppContextType } from "next/dist/shared/lib/utils";
import { FallbackSeo } from "@dewo/app/containers/seo/FallbackSeo";
import { createApolloClient, createApolloLink } from "@dewo/app/graphql/apollo";
import { ApolloProvider, useLazyQuery } from "@apollo/client";
import {
  UserProfileQuery,
  UserProfileQueryVariables,
} from "@dewo/app/graphql/types";
import * as Queries from "../src/graphql/queries";
import { getDataFromTree } from "@apollo/react-ssr";
import { isSSR } from "@dewo/app/util/isSSR";
import { OnboardingCarouselModal } from "@dewo/app/containers/onboarding/OnboardingCarouselModal";

if (!isSSR && Constants.ENVIRONMENT === "prod") {
  const { ID, version } = Constants.hotjarConfig;
  hotjar.initialize(ID, version);
}

const faviconByEnvironment: Record<typeof Constants.ENVIRONMENT, string> = {
  dev: "/logo.dev.svg",
  demo: "/logo.demo.svg",
  prod: "/logo.svg",
};

Sentry.init({
  dsn: Constants.SENTRY_DSN,
  environment: Constants.ENVIRONMENT,
  ignoreErrors: ["ResizeObserver loop limit exceeded"],
});

interface AuthProps {
  origin: string;
  initialAuthToken: string | undefined;
}

const isUUID = (str: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str
  );
};

// Redirects old profile URLs to new one
const Redirector: React.FC = () => {
  const router = useRouter();

  // If userId is a UUID, redirect to use username instead
  const { username: maybeUsername } = router.query as { username: string };
  const [getUser] = useLazyQuery<UserProfileQuery, UserProfileQueryVariables>(
    Queries.userProfile,
    // Required to avoid infinite render-loop
    { ssr: false }
  );

  useEffect(() => {
    const fn = async () => {
      if (maybeUsername && isUUID(maybeUsername)) {
        const { data } = await getUser({ variables: { id: maybeUsername } });
        const username = data?.user?.username;
        if (!username) return;
        router.replace({
          query: { ...router.query, username },
        });
      }
    };
    fn();
  }, [maybeUsername, router, getUser]);

  return null;
};

type Props = AppProps & WithApolloProps<any> & AuthProps;
const App: NextComponentType<AppContextType, AppInitialProps, Props> = ({
  Component,
  pageProps,
  origin,
  initialAuthToken,
  apollo,
}) => {
  const onErrorRef = useRef<ErrorLink.ErrorHandler>();
  apollo.setLink(
    createApolloLink(
      origin,
      () => getAuthToken(undefined) || initialAuthToken,
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
      </Head>
      <FallbackSeo />
      <ApolloProvider client={apollo as any}>
        <AuthProvider
          initialAuthenticated={!!initialAuthToken || !!getAuthToken(undefined)}
        >
          <PermissionsProvider>
            <SidebarProvider>
              <Redirector />
              <Component {...pageProps} />
              <InviteMessageToast />
              <FeedbackButton />
              <TaskUpdateModalListener />
              <ServerErrorModal onErrorRef={onErrorRef} />
              <OnboardingCarouselModal />
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
    origin: absoluteUrl(ctx?.req).origin,
    initialAuthToken: getAuthToken(ctx),
  };
};

export default withApollo(
  ({ ctx, initialState }) => createApolloClient(ctx!, initialState),
  // Fetches all Apollo data on the server side
  { getDataFromTree }
)(App as any);
