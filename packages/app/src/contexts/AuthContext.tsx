import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { UserDetails } from "../graphql/types";
import { clearAuthToken } from "../util/authToken";
import { useCurrentUser } from "../util/hooks";
interface AuthContextValue {
  user: UserDetails | undefined;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  logout: () => {},
});

export const AuthProvider: FC = ({ children }) => {
  const user = useCurrentUser();

  const logout = useCallback(async () => {
    clearAuthToken(undefined);
    window.location.href = "/";
  }, []);
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {useMemo(() => children, [children])}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
