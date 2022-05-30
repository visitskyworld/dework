import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MeQuery, UserDetails } from "../graphql/types";
import { clearAuthToken, setAuthToken } from "../util/authToken";
import { useApolloClient, useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import * as Sentry from "@sentry/nextjs";
import { useAmplitude } from "../util/analytics/AmplitudeContext";
import { useRouter } from "next/router";

function useCurrentUser(skip: boolean = false): UserDetails | undefined {
  const { data } = useQuery<MeQuery>(Queries.me, { skip });
  return data?.me;
}
interface AuthContextValue {
  user: UserDetails | undefined;
  authenticated: boolean;
  logout(redirect?: string): void;
  onAuthenticated(authToken: string): void;
}

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  authenticated: false,
  logout: () => {},
  onAuthenticated: () => {},
});

export const AuthProvider: FC<{ initialAuthenticated: boolean }> = ({
  children,
  initialAuthenticated,
}) => {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const user = useCurrentUser(!authenticated);

  const amplitude = useAmplitude();
  useEffect(() => {
    if (!user) return;
    amplitude.identify(user.id, {
      username: user.username,
      organizations: user.organizations.map((o) => o.id),
      threepids: user.threepids.map((t) => t.source),
      onboarding: user.prompts.find((p) => p.type.startsWith("Onboarding"))
        ?.type,
      userAgent: navigator.userAgent,
    });

    Sentry.setUser({ id: user.id });
  }, [user, amplitude]);

  const router = useRouter();
  const apolloClient = useApolloClient();
  const logout = useCallback(
    (redirect: string = "/") => {
      clearAuthToken(undefined);
      setAuthenticated(false);
      apolloClient.reFetchObservableQueries();
      router.push(redirect);
    },
    [router, apolloClient]
  );

  const onAuthenticated = useCallback((authToken: string) => {
    setAuthToken(undefined, authToken);
    setAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, authenticated, logout, onAuthenticated }}
    >
      {useMemo(() => children, [children])}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
