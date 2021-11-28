import { useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import { useCallback, useState } from "react";
import { MeQuery, UserDetails } from "../graphql/types";

export function useUser(skip: boolean = false): UserDetails | undefined {
  const { data } = useQuery<MeQuery>(Queries.me, { skip });
  return data?.me;
}

export function useToggle(): {
  value: boolean;
  onToggleOn(): void;
  onToggleOff(): void;
} {
  const [value, setValue] = useState(false);
  const onToggleOn = useCallback(() => setValue(true), []);
  const onToggleOff = useCallback(() => setValue(false), []);
  return { value, onToggleOn, onToggleOff };
}

export function useRerender() {
  const [, setRerender] = useState(0);
  return useCallback(() => setRerender((r) => r + 1), []);
}
