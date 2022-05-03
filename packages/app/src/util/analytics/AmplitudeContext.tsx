import React, {
  FC,
  ReactNode,
  useMemo,
  createContext,
  useCallback,
  useContext,
} from "react";
import { AmplitudeClient } from "amplitude-js";
import { Constants } from "../constants";
import { isSSR } from "../isSSR";

type EventProperties = { [key: string]: any };

interface AmplitudeContextProps {
  identify(id: string, properties: EventProperties): void;
  logEvent(eventName: string, properties?: EventProperties): void;
  setUserProperties(properties: any): void;
}

const AmplitudeContext = createContext<AmplitudeContextProps>({} as any);

export function useAmplitude(): AmplitudeContextProps {
  return useContext(AmplitudeContext);
}

interface AmplitudeProviderProps {
  apiKey: string;
  apiEndpoint: string | undefined;
  children: ReactNode;
}

export const AmplitudeProvider: FC<AmplitudeProviderProps> = ({
  apiKey,
  apiEndpoint,
  children,
}) => {
  const debug = Constants.ENVIRONMENT !== "prod";
  const amplitude = useMemo<AmplitudeClient | undefined>(() => {
    if (isSSR) return undefined;
    if (debug) {
      console.log("[AmplitudeProvider.initialize]");
    }

    const amplitude = require("amplitude-js").default;
    const instance: AmplitudeClient = amplitude.getInstance();
    instance.init(apiKey, undefined, { apiEndpoint, batchEvents: true });
    return instance;
  }, [apiKey, apiEndpoint, debug]);

  const identify = useCallback<AmplitudeContextProps["identify"]>(
    (id, properties) => {
      if (!amplitude) return;

      const identify = new amplitude.Identify();
      if (!!document.referrer) {
        identify.set("referrer", document.referrer);
        identify.setOnce("initial_referrer", document.referrer);
      }

      if (debug) {
        console.log("[AmplitudeProvider.identify]", {
          id,
          properties,
          referrer: document.referrer,
        });
      }

      amplitude.identify(identify);
      amplitude.setUserId(id);
      amplitude.setUserProperties(properties);
    },
    [amplitude, debug]
  );

  const logEvent = useCallback<AmplitudeContextProps["logEvent"]>(
    (eventName, properties) => {
      if (debug) {
        console.log("[AmplitudeProvider.logEvent]", eventName, properties);
      }
      return amplitude?.logEvent(eventName, properties);
    },
    [amplitude, debug]
  );

  const setUserProperties = useCallback(
    (properties: any) => {
      if (debug) {
        console.log("[AmplitudeProvider.setUserProperties]", properties);
      }

      amplitude?.setUserProperties(properties);
    },
    [amplitude, debug]
  );

  return (
    <AmplitudeContext.Provider
      value={useMemo(
        () => ({ identify, logEvent, setUserProperties }),
        [identify, logEvent, setUserProperties]
      )}
    >
      {useMemo(() => children, [children])}
    </AmplitudeContext.Provider>
  );
};
