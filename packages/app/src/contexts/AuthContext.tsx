import React, { createContext, FC, useContext, useMemo, useState } from "react";
import { User } from "../types/api";

interface AuthContextValue {
  user: User | undefined;
  onUpdate(user: User): void;
}

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  onUpdate: () => {},
});

interface AuthProviderProps {}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>();
  return (
    <AuthContext.Provider value={{ user, onUpdate: setUser }}>
      {useMemo(() => children, [children])}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
