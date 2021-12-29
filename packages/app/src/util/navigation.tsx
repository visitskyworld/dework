import { useRouter } from "next/router";
import { useCallback } from "react";
import { User } from "../graphql/types";
import { uuidToBase62 } from "./uuid";

export function useNavigateToProfile(): (user: User) => void {
  const router = useRouter();
  return useCallback(
    (user: User) => router.push(`/profile/${user.id}`),
    [router]
  );
}

export function useNavigateToUserTaskBoard(): (user: User) => void {
  const router = useRouter();
  return useCallback(
    (user: User) => router.push(`/profile/${user.id}/board`),
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

export function useNavigateToOrganization(): (orgId: string) => void {
  const router = useRouter();
  return useCallback(
    (orgId) => router.push({ pathname: `/o/${uuidToBase62(orgId)}` }),
    [router]
  );
}
export function useNavigateToProject(): (
  orgId: string,
  projId: string
) => void {
  const router = useRouter();
  return useCallback(
    (orgId, projId) =>
      router.push({
        pathname: `/o/${uuidToBase62(orgId)}/p/${uuidToBase62(projId)}`,
      }),
    [router]
  );
}
