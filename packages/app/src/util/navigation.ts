import { useRouter } from "next/router";
import { useCallback } from "react";
import { User } from "../graphql/types";

export function useNavigateToProfile(): (user: User) => void {
  const router = useRouter();
  return useCallback(
    (user: User) => router.push(`/profile/${user.id}`),
    [router]
  );
}

export function useNavigateToTask(taskId: string): () => void {
  const router = useRouter();
  return useCallback(
    () =>
      router.push({
        pathname: router.pathname,
        query: { ...router.query, taskId },
      }),
    [router, taskId]
  );
}
