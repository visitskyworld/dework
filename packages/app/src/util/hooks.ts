import { message } from "antd";
import copy from "copy-to-clipboard";
import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface UseToggleHook {
  isOn: boolean;
  toggleOn(): void;
  toggleOff(): void;
  toggle(): void;
  setToggle(isOn: boolean): void;
}

export function useToggle(defaultIsOn: boolean = false): UseToggleHook {
  const [isOn, setToggle] = useState(defaultIsOn);
  const toggleOn = useCallback(() => setToggle(true), []);
  const toggleOff = useCallback(() => setToggle(false), []);
  const toggle = useCallback(() => setToggle((prevIsOn) => !prevIsOn), []);
  return useMemo(
    () => ({ isOn, toggleOn, toggleOff, toggle, setToggle }),
    [isOn, toggleOn, toggleOff, toggle, setToggle]
  );
}

export function useRunning<P extends any[], R extends Promise<any>>(
  callback: (...args: P) => R
) {
  const [isRunning, setIsRunning] = useState(false);
  return [
    (...args: P): R => {
      const response = callback(...args);
      if (response instanceof Promise) {
        setIsRunning(true);
        response.finally(() => setIsRunning(false));
      }
      return response;
    },
    isRunning,
  ] as const;
}

export function useRunningCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): [T, boolean] {
  const [running, setRunning] = useState(false);
  // @ts-ignore
  const wrappedCallback = useCallback<T>((...args) => {
    const response = callback(...args);
    if (response instanceof Promise) {
      setRunning(true);
      response.finally(() => setRunning(false));
    }

    return response;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return [wrappedCallback, running];
}

export function useRerender() {
  const [, setRerender] = useState(0);
  return useCallback(() => setRerender((r) => r + 1), []);
}

export function useCopyToClipboardAndShowToast(
  messageContent = "Copied to clipboard"
): (textToCopy: string) => void {
  return useCallback(
    (textToCopy: string) => {
      copy(textToCopy);
      message.success({ content: messageContent, type: "success" });
    },
    [messageContent]
  );
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
