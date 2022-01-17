import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { MeQuery, UserDetails } from "../graphql/types";
import { clearAuthToken, setAuthToken } from "../util/authToken";
import { useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";

export function useCurrentUser(skip: boolean = false): UserDetails | undefined {
  const { data } = useQuery<MeQuery>(Queries.me, { skip });
  return data?.me;
}
interface AuthContextValue {
  user: UserDetails | undefined;
  authenticated: boolean;
  logout(): void;
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

  const logout = useCallback(() => {
    clearAuthToken(undefined);
    setAuthenticated(false);
    window.location.href = "/";
  }, []);

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
