import { Button, Carousel, Modal } from "antd";
import { CarouselRef } from "antd/lib/carousel";
import React, { ComponentType, FC, useEffect, useMemo, useRef } from "react";
import * as Icons from "@ant-design/icons";
import { usePrompt, UserPromptStep } from "./hooks";
import styles from "./PromptModal.module.less";
import { OnboardingConnectDiscord } from "./onboarding/OnboardingConnectDiscord";
import { OnboardingConnectWallet } from "./onboarding/OnboardingConnectWallet";
import { OnboardingDone } from "./onboarding/OnboardingDone";
import { OnboardingProfile } from "./onboarding/OnboardingProfile";
import { ConnectWalletToReceiveTaskReward } from "./task/ConnectWalletToReceiveTaskReward";
import { OnboardingSkills } from "./onboarding/OnboardingSkills";
import { ProductUpdate220527 } from "./announcements/ProductUpdate220527";

const StepComponentMapping: Record<
  UserPromptStep,
  ComponentType<{ onNext(): Promise<void>; active: boolean }>
> = {
  [UserPromptStep.OnboardingProfile]: OnboardingProfile,
  [UserPromptStep.OnboardingConnectWallet]: OnboardingConnectWallet,
  [UserPromptStep.OnboardingConnectDiscord]: OnboardingConnectDiscord,
  [UserPromptStep.OnboardingSkills]: OnboardingSkills,
  [UserPromptStep.OnboardingDone]: OnboardingDone,
  [UserPromptStep.TaskConnectWalletToReceiveReward]:
    ConnectWalletToReceiveTaskReward,
  [UserPromptStep.ProductUpdate220527]: ProductUpdate220527,
};

export const PromptModal: FC = () => {
  const prompt = usePrompt();
  const currentIndex = useMemo(
    () => prompt.steps.indexOf(prompt.step!),
    [prompt]
  );

  const carousel = useRef<CarouselRef>(null);
  useEffect(() => {
    if (currentIndex !== -1) {
      carousel.current?.goTo(currentIndex);
    }
  }, [currentIndex]);

  return (
    <Modal
      visible={!!prompt.step}
      footer={null}
      closable={false}
      destroyOnClose
      bodyStyle={{
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 40,
        paddingBottom: 40,
      }}
    >
      <Carousel
        ref={carousel}
        initialSlide={currentIndex}
        prefixCls={`ant-carousel ${styles.carousel}`}
        dots={false}
      >
        {prompt.steps.map((step) => {
          const Component = StepComponentMapping[step];
          return (
            <div key={step}>
              <div className={styles.content}>
                <Component
                  active={step === prompt.step}
                  onNext={prompt.onNext}
                />
              </div>
            </div>
          );
        })}
      </Carousel>

      {currentIndex > 0 && (
        <Button
          icon={<Icons.ArrowLeftOutlined />}
          type="text"
          size="large"
          className={styles.back}
          onClick={prompt.onPrev}
        />
      )}
    </Modal>
  );
};
