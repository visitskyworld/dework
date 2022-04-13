import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { ThreepidSource, UserDetails } from "@dewo/app/graphql/types";
import { useAmplitude } from "@dewo/app/util/analytics/AmplitudeContext";
import _ from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useUpdateUserPrompt } from "../user/hooks";

export enum UserPromptStep {
  OnboardingProfile = "profile",
  OnboardingConnectWallet = "wallet",
  OnboardingConnectDiscord = "discord",
  OnboardingDone = "done",
  TaskConnectWalletToReceiveReward = "task-reward-wallet",
}

const UserPromptStepMapping: Record<
  string,
  (user: UserDetails) => UserPromptStep[]
> = {
  "Onboarding.v1.ConnectWallet": () => [
    UserPromptStep.OnboardingProfile,
    UserPromptStep.OnboardingConnectWallet,
    UserPromptStep.OnboardingDone,
  ],
  "Onboarding.v1.ConnectDiscord": (user) => {
    if (user.threepids.some((t) => t.source === ThreepidSource.discord)) {
      return [UserPromptStep.OnboardingProfile, UserPromptStep.OnboardingDone];
    }
    return [
      UserPromptStep.OnboardingProfile,
      UserPromptStep.OnboardingConnectDiscord,
      UserPromptStep.OnboardingDone,
    ];
  },
  "Task.v1.ConnectWalletToReceiveReward": (user) => {
    if (user.threepids.some((t) => t.source === ThreepidSource.metamask)) {
      return [];
    }
    return [UserPromptStep.TaskConnectWalletToReceiveReward];
  },
};

export function usePrompt(): {
  step: UserPromptStep | undefined;
  steps: UserPromptStep[];
  onNext(): Promise<void>;
  onPrev(): Promise<void>;
} {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const { logEvent } = useAmplitude();

  const { user } = useAuthContext();
  const prompt = useMemo(
    () =>
      _.sortBy(
        user?.prompts.filter((p) => !p.completedAt),
        (p) => p.createdAt
      )[0],
    [user?.prompts]
  );

  const type = prompt?.type;
  const currentStep = router.query.step as UserPromptStep | undefined;
  const steps = useMemo(
    () => (!!user ? UserPromptStepMapping[type!]?.(user) : undefined) ?? [],
    [type, user]
  );

  const isSigningIn = !!router.query.threepidId;
  const shouldShow = useMemo(
    () => !!prompt && !isSigningIn,
    [prompt, isSigningIn]
  );

  const updatePrompt = useUpdateUserPrompt();
  const onNext = useCallback(async () => {
    if (steps.indexOf(currentStep!) === steps.length - 1) {
      await updatePrompt({
        type: type!,
        completedAt: new Date().toISOString(),
      });
    }

    const nextStep = steps[steps.indexOf(currentStep!) + 1];
    if (!!nextStep) {
      routerRef.current.push({
        query: { ...routerRef.current.query, step: nextStep },
      });
    } else if (!!currentStep) {
      routerRef.current.push({
        query: _.omit(routerRef.current.query, "step"),
      });
    }

    logEvent("Prompt step changed", {
      step: nextStep,
      type,
      direction: "next",
    });
  }, [logEvent, updatePrompt, currentStep, steps, type]);

  const onPrev = useCallback(async () => {
    const prevStep = steps[steps.indexOf(currentStep!) - 1];
    router.push({ query: { ...router.query, step: prevStep } });
    logEvent("Prompt step changed", {
      step: prevStep,
      type,
      direction: "prev",
    });
  }, [logEvent, steps, router, currentStep, type]);

  useEffect(() => {
    if (shouldShow && !currentStep) {
      onNext();
    }
  }, [shouldShow, currentStep, onNext]);

  return {
    step: steps.indexOf(currentStep!) !== -1 ? currentStep : undefined,
    steps,
    onNext,
    onPrev,
  };
}
