import { Button, ButtonProps } from "antd";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useMemo } from "react";
import styles from "./BlockButton.module.less";

const matchRoute = (route: string, pathname: string, exact = false) => {
  if (pathname === route) return true;
  if (exact) return false;
  if (route[route.length - 1] !== "/") route += "/";
  return pathname.startsWith(route);
};

interface BlockButtonProps extends ButtonProps {
  exact?: boolean;
  active?: boolean;
}

export const BlockButton: FC<BlockButtonProps> = ({
  icon,
  href,
  active,
  children,
  exact,
  ...btnProps
}) => {
  const router = useRouter();

  const isActive = useMemo(() => {
    if (active) return true;
    if (!href) return false;

    let pathname = href;
    try {
      pathname = new URL(href).pathname;
    } catch (e) {}

    return matchRoute(pathname, router.asPath, exact);
  }, [active, exact, href, router]);

  const btn = (
    <Button
      block
      type="text"
      icon={icon}
      {...btnProps}
      className={classNames([
        styles.blockbutton,
        isActive && styles.active,
        btnProps.className,
      ])}
    >
      {children}
    </Button>
  );
  if (!href) return btn;
  return (
    <Link href={href}>
      <a href={href}>{btn}</a>
    </Link>
  );
};
