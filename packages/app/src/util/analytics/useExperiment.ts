import { useEffect, useMemo } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useAmplitude } from "./AmplitudeContext";

export interface ExperimentOptions<T extends string> {
  name: string;
  variants: Partial<Record<T, string>>;
}

export function useExperiment<T extends string>({
  name,
  variants,
}: ExperimentOptions<T>): T {
  const { user } = useAuthContext();
  const variantKey = useMemo(() => {
    const keys = Object.keys(variants) as T[];
    return keys[(!!user ? parseInt(user.id[0], 16) : 0) % keys.length];
  }, [user, variants]);

  const { setUserProperties } = useAmplitude();
  useEffect(() => {
    setUserProperties?.({
      [`Experiment: ${name}`]: `${variantKey} (${variants[variantKey]})`,
    });
  }, [name, variantKey, variants, setUserProperties]);

  return variantKey;
}
