import React, { createContext, FC, useContext, useMemo, useState } from "react";
import { User } from "../graphql/types";
import { useUser } from "../util/hooks";

interface AuthContextValue {
  user: User | undefined;
  setAuthenticated(authenticated: boolean): void;
}

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
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
  return (
    <AuthContext.Provider value={{ user, setAuthenticated }}>
      {useMemo(() => children, [children])}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
