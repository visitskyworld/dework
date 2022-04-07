import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isSSR } from "../isSSR";
import { useAmplitude } from "./AmplitudeContext";

function useAnalyticsTrackElements() {
  const amplitude = useAmplitude();
  const router = useRouter();
  useEffect(() => {
    if (isSSR) return;
    const listener = (type: keyof WindowEventMap) => (event: unknown) => {
      // @ts-expect-error
      const path: HTMLElement[] = event.path;

      const getName = (el: HTMLElement): string | undefined => {
        // @ts-expect-error
        if (!!el.name && typeof el.name === "string") return el.name;
        if (!!el.id) return `#${el.id}`;
        return undefined;
      };

      const element = path.find((el) => !!getName(el));
      if (!!element) {
        const eventName = `${_.capitalize(type)}: ${getName(element)}`;
        amplitude.logEvent(eventName, {
          type: element.tagName,
          host: window.location.host,
          href: window.location.href,
          params: router.query,
        });
      }
    };

    const types: (keyof WindowEventMap)[] = ["click", "focus", "blur"];
    types.forEach((t) => document.addEventListener(t, listener(t), true));
    return () =>
      types.forEach((t) => document.removeEventListener(t, listener(t), true));
  }, [amplitude, router]);
}

function useAnalyticsTrackRoutes() {
  const amplitude = useAmplitude();
  const router = useRouter();
  useEffect(() => {
    amplitude.logEvent(`Screen: ${router.route}`, {
      host: window.location.host,
      href: window.location.href,
      params: router.query,
    });
  }, [router, amplitude]);
}

export function useAnalyticsListeners() {
  useAnalyticsTrackElements();
  useAnalyticsTrackRoutes();
}
