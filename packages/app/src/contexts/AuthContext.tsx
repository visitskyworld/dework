import { useRouter } from "next/router";
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { UserDetails } from "../graphql/types";
import { clearAuthToken } from "../util/authToken";
import { useUser } from "../util/hooks";

interface AuthContextValue {
  user: UserDetails | undefined;
  logout(): void;
  setAuthenticated(authenticated: boolean): void;
}

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  logout: () => {},
  setAuthenticated: () => {},
});

interface AuthProviderProps {
  authenticated: boolean;
}

export const AuthProvider: FC<AuthProviderProps> = ({
  children,
  authenticated: initialAuthenticated,
}) => {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const user = useUser(!authenticated);

  const router = useRouter();
  const logout = useCallback(async () => {
    clearAuthToken(undefined);
    setAuthenticated(false);
    router.push("/");
  }, [router]);
  return (
    <AuthContext.Provider value={{ user, logout, setAuthenticated }}>
      {useMemo(() => children, [children])}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
