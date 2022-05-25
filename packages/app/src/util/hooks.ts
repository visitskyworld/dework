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

export function useRunning<R, P extends any[]>(
  callback: (...args: P) => R
): [(...args: P) => R, boolean] {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(
    (...args: P): R => {
      const response = callback(...args);
      if (response instanceof Promise) {
        setIsRunning(true);
        response.finally(() => setIsRunning(false));
      }
      return response;
    },
    [callback]
  );

  return [handleRun, isRunning];
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

export function useWindowFocus(callback: () => void) {
  useEffect(() => {
    window.addEventListener("focus", callback);
    return () => window.removeEventListener("focus", callback);
  }, [callback]);
}

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function useLocalState<T extends string>(name: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const savedValue = localStorage.getItem(name) as T;
    return savedValue ?? defaultValue;
  });
  useEffect(() => {
    localStorage.setItem(name, value);
  }, [name, value]);
  return [value, setValue] as const;
}
