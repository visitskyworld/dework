import { useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import { useCallback, useMemo, useState } from "react";
import { MeQuery, UserDetails } from "../graphql/types";

export function useCurrentUser(skip: boolean = false): UserDetails | undefined {
  const { data } = useQuery<MeQuery>(Queries.me, { skip });
  return data?.me;
}

interface UseToggleHook {
  isOn: boolean;
  toggleOn(): void;
  toggleOff(): void;
  toggle(): void;
  setToggle(isOn: boolean): void;
}

export function useToggle(defaultIsOn: boolean = false): UseToggleHook {
  const [isOn, setToggle] = useState(defaultIsOn);
  const toggleOn = useCallback(() => setToggle(true), []);
  const toggleOff = useCallback(() => setToggle(false), []);
  const toggle = useCallback(() => setToggle(!isOn), [isOn]);
  return useMemo(
    () => ({ isOn, toggleOn, toggleOff, toggle, setToggle }),
    [isOn, toggleOn, toggleOff, toggle, setToggle]
  );
}

export function useRerender() {
  const [, setRerender] = useState(0);
  return useCallback(() => setRerender((r) => r + 1), []);
}
