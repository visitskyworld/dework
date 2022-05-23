import React, { createContext, FC, useContext, useMemo } from "react";
import { useToggle, UseToggleHook } from "../util/hooks";

const SidebarContext = createContext<UseToggleHook>({
  isOn: false,
  toggle: () => {},
  toggleOn: () => {},
  toggleOff: () => {},
  setToggle: () => {},
});

export const SidebarProvider: FC = ({ children }) => {
  const value = useToggle(true);
  return (
    <SidebarContext.Provider value={value}>
      {useMemo(() => children, [children])}
    </SidebarContext.Provider>
  );
};

export function useSidebarContext(): UseToggleHook {
  return useContext(SidebarContext);
}
