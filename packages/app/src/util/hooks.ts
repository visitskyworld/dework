import { message } from "antd";
import copy from "copy-to-clipboard";
import { useCallback, useMemo, useState } from "react";

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
