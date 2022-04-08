import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { ThreepidSource, UserDetails } from "@dewo/app/graphql/types";
import _ from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import { useUpdateUserOnboarding } from "../user/hooks";

export enum OnboardingStep {
  profile = "profile",
  wallet = "wallet",
  discord = "discord",
  done = "done",
}

const OnboardingStepMapping: Record<
  string,
  (user: UserDetails) => OnboardingStep[]
> = {
  "Onboarding.v1.ConnectWallet": () => [
    OnboardingStep.profile,
    OnboardingStep.wallet,
    OnboardingStep.done,
  ],
  "Onboarding.v1.ConnectDiscord": (user) => {
    if (user.threepids.some((t) => t.source === ThreepidSource.discord)) {
      return [OnboardingStep.profile, OnboardingStep.done];
    }
    return [
      OnboardingStep.profile,
      OnboardingStep.discord,
      OnboardingStep.done,
    ];
  },
};

export function useOnboarding(): {
  step: OnboardingStep | undefined;
  steps: OnboardingStep[];
  onNext(): void;
  onPrev(): void;
} {
  const router = useRouter();

  const { user } = useAuthContext();
  const shouldShow = useMemo(
    () =>
      !!user?.onboarding &&
      !user.onboarding.completedAt &&
      !router.query.threepidId,
    [user?.onboarding, router.query.threepidId]
  );

  const type = user?.onboarding?.type;
  const currentStep = router.query.onboarding as OnboardingStep | undefined;
  const steps = useMemo(
    () => (!!user ? OnboardingStepMapping[type!]?.(user) : undefined) ?? [],
    [type, user]
  );

  const updateOnboarding = useUpdateUserOnboarding();
  const onNext = useCallback(async () => {
    if (currentStep === OnboardingStep.done) {
      await updateOnboarding({
        type: type!,
        completedAt: new Date().toISOString(),
      });
    }

    const nextStep = steps[steps.indexOf(currentStep!) + 1];
    if (!!nextStep) {
      router.push({ query: { ...router.query, onboarding: nextStep } });
    } else if (!!currentStep) {
      router.push({ query: _.omit(router.query, "onboarding") });
    }
  }, [updateOnboarding, currentStep, steps, router, type]);

  const onPrev = useCallback(async () => {
    const prevStep = steps[steps.indexOf(currentStep!) - 1];
    router.push({ query: { ...router.query, onboarding: prevStep } });
  }, [steps, router, currentStep]);

  useEffect(() => {
    if (!!user && !user.onboarding) {
      const threepids = new Set(user.threepids.map((t) => t.source));
      if (threepids.has(ThreepidSource.discord)) {
        updateOnboarding({ type: "Onboarding.v1.ConnectWallet" });
      } else {
        updateOnboarding({ type: "Onboarding.v1.ConnectDiscord" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!user]);

  useEffect(() => {
    if (shouldShow && !currentStep) {
      onNext();
    }
  }, [shouldShow, currentStep, onNext]);

  return { step: currentStep, steps, onNext, onPrev };
}
