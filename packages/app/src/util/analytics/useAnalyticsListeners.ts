import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { isSSR } from "../isSSR";
import { useAmplitude } from "./AmplitudeContext";

function useAnalyticsTrackElements() {
  const amplitude = useAmplitude();
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    if (isSSR) return;
    const listener = (type: keyof WindowEventMap) => (event: unknown) => {
      // @ts-expect-error
      const path: HTMLElement[] = event.path;

      const getName = (el: HTMLElement): string | undefined => {
        if (!["INPUT", "BUTTON", "TEXTAREA"].includes(el.tagName)) {
          return undefined;
        }
        // @ts-expect-error
        if (!!el.name && typeof el.name === "string") return el.name;
        if (
          !!el.id &&
          !el.id.includes("rc-tabs") &&
          !el.id.includes("rc_select")
        )
          return `#${el.id}`;
        return undefined;
      };

      const element = path?.find((el) => !!getName(el));
      if (!!element) {
        const eventName = `${_.capitalize(type)}: ${getName(element)}`;
        amplitude.logEvent(eventName, {
          tagName: element.tagName,
          host: window.location.host,
          href: window.location.href,
          route: routerRef.current.route,
          params: routerRef.current.query,
        });
      }
    };

    const types: (keyof WindowEventMap)[] = ["click", "focus"];
    types.forEach((t) => document.addEventListener(t, listener(t), true));
    return () =>
      types.forEach((t) => document.removeEventListener(t, listener(t), true));
  }, [amplitude]);
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
