import { Button, Carousel, Modal } from "antd";
import { CarouselRef } from "antd/lib/carousel";
import React, { ComponentType, FC, useEffect, useMemo, useRef } from "react";
import * as Icons from "@ant-design/icons";
import { OnboardingStep, useOnboarding } from "./hooks";
import styles from "./OnboardingCarouselModal.module.less";
import { OnboardingConnectDiscord } from "./steps/OnboardingConnectDiscord";
import { OnboardingConnectWallet } from "./steps/OnboardingConnectWallet";
import { OnboardingDone } from "./steps/OnboardingDone";
import { OnboardingProfile } from "./steps/OnboardingProfile";

const StepComponentMapping: Record<
  OnboardingStep,
  ComponentType<{ onNext(): void; active: boolean }>
> = {
  [OnboardingStep.profile]: OnboardingProfile,
  [OnboardingStep.wallet]: OnboardingConnectWallet,
  [OnboardingStep.discord]: OnboardingConnectDiscord,
  [OnboardingStep.done]: OnboardingDone,
};

export const OnboardingCarouselModal: FC = () => {
  const onboarding = useOnboarding();
  const currentIndex = useMemo(
    () => onboarding.steps.indexOf(onboarding.step!),
    [onboarding]
  );

  const carousel = useRef<CarouselRef>(null);
  useEffect(() => {
    if (currentIndex !== -1) {
      carousel.current?.goTo(currentIndex);
    }
  }, [currentIndex]);

  return (
    <Modal
      visible={!!onboarding.step}
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
        {onboarding.steps.map((step) => {
          const Component = StepComponentMapping[step];
          return (
            <div key={step}>
              <div className={styles.content}>
                <Component
                  active={step === onboarding.step}
                  onNext={onboarding.onNext}
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
          onClick={onboarding.onPrev}
        />
      )}
    </Modal>
  );
};
