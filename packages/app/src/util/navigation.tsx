import _ from "lodash";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { User } from "../graphql/types";

export function useNavigateToProfile(): (user: User) => void {
  const router = useRouter();
  return useCallback((user: User) => router.push(user.permalink), [router]);
}

export function useNavigateToUserTaskBoard(): (user: User) => void {
  const router = useRouter();
  return useCallback(
    (user: User) => router.push(`${user.permalink}/board`),
    [router]
  );
}

export function useNavigateToTask(taskId: string): () => void {
  const fn = useNavigateToTaskFn();
  return useCallback(() => fn(taskId), [fn, taskId]);
}

export function useNavigateToTaskFn(): (
  taskId: string,
  openInNewTab?: boolean
) => void {
  const router = useRouter();
  return useCallback(
    (taskId, openInNewTab = false) => {
      if (openInNewTab) {
        window.open(`${window.location.href}?taskId=${taskId}`, "_blank");
      } else {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, taskId },
        });
      }
    },
    [router]
  );
}

export function useCloseTaskDetails(): () => void {
  const router = useRouter();
  return useCallback(
    () =>
      router.push({
        pathname: router.pathname,
        query: _.omit(router.query, ["taskId"]),
      }),
    [router]
  );
}

export function useNavigateToTaskApplicationFn(): (
  applyToTaskId: string
) => void {
  const router = useRouter();
  return useCallback(
    (applyToTaskId) =>
      router.push({
        pathname: router.pathname,
        query: { ...router.query, applyToTaskId },
      }),
    [router]
  );
}
