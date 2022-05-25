import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { Button, ButtonProps, Checkbox, Dropdown, Menu } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useRunning } from "../util/hooks";
import { isSSR } from "../util/isSSR";
import { LocalStorage } from "../util/LocalStorage";

const defaultLauncherKey = "OpenDiscordButton.defaultLauncher";
enum DiscordLauncher {
  app = "app",
  web = "web",
}

interface Props extends Omit<ButtonProps, "href"> {
  href: string | (() => Promise<string>);
}

export const OpenDiscordButton: FC<Props> = ({ href, ...buttonProps }) => {
  const [saveAsDefault, setUseAsDefault] = useState(false);
  const [handleClick, loading] = useRunning(
    useCallback(
      async (launcher: DiscordLauncher) => {
        if (saveAsDefault) LocalStorage.setItem(defaultLauncherKey, launcher);

        const link = typeof href === "string" ? href : await href();
        if (launcher === DiscordLauncher.app) {
          window.open(link.replace(/^https:\/\//, "discord://"), "_blank");
        } else {
          window.open(link, "_blank");
        }
      },
      [href, saveAsDefault]
    )
  );

  const defaultLauncher = useMemo(
    () =>
      isSSR
        ? undefined
        : (LocalStorage.getItem(defaultLauncherKey) as
            | DiscordLauncher
            | undefined),
    []
  );

  if (!!defaultLauncher) {
    return (
      <Button
        icon={<DiscordIcon />}
        {...buttonProps}
        loading={loading}
        onClick={() => handleClick(defaultLauncher)}
      />
    );
  }

  return (
    <Dropdown
      trigger={["click"]}
      overlay={
        <Menu>
          <Menu.Item onClick={() => handleClick(DiscordLauncher.web)}>
            Discord Web
          </Menu.Item>
          <Menu.Item onClick={() => handleClick(DiscordLauncher.app)}>
            Discord App
          </Menu.Item>
          <Menu.Divider />
          <Checkbox
            checked={saveAsDefault}
            style={{ paddingLeft: 12, paddingRight: 12 }}
            onChange={(e) => setUseAsDefault(e.target.checked)}
          >
            Save as default
          </Checkbox>
        </Menu>
      }
    >
      <Button
        icon={<DiscordIcon />}
        {...buttonProps}
        href={undefined}
        loading={loading}
      />
    </Dropdown>
  );
};
