import { useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import { useCallback, useMemo, useState } from "react";
import { MeQuery, UserDetails } from "../graphql/types";

export function useCurrentUser(skip: boolean = false): UserDetails | undefined {
  const { data } = useQuery<MeQuery>(Queries.me, { skip });
  return data?.me;
}

export function useToggle(): {
  value: boolean;
  toggleOn(): void;
  toggleOff(): void;
  toggle(): void;
} {
  const [value, setValue] = useState(false);
  const toggleOn = useCallback(() => setValue(true), []);
  const toggleOff = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue(!value), [value]);
  return useMemo(
    () => ({ value, toggleOn, toggleOff, toggle }),
    [value, toggleOn, toggleOff, toggle]
  );
}

export function useRerender() {
  const [, setRerender] = useState(0);
  return useCallback(() => setRerender((r) => r + 1), []);
}
