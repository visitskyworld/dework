import { useRouter } from "next/router";
import * as URL from "url";
import Link, { LinkProps } from "next/link";
import React, { FC, useMemo } from "react";
import { isSSR } from "@dewo/app/util/isSSR";
import classNames from "classnames";
import styles from "./Sidebar.module.less";

interface Props extends LinkProps {
  href: string;
  exact?: boolean;
  clickable?: boolean;
  className?: string;
}

export const SidebarNavLink: FC<Props> = ({
  exact,
  href,
  children,
  clickable = true,
  ...restProps
}) => {
  const { asPath } = useRouter();
  const isActive = useMemo(() => {
    if (isSSR) return false;
    const pathname = href.startsWith("/") ? href : URL.parse(href).pathname;
    if (!pathname) return false;
    return exact ? pathname === asPath : asPath.startsWith(pathname);
  }, [exact, asPath, href]);

  const className = classNames({
    [restProps.className ?? ""]: true,
    [styles.active]: isActive,
  });

  if (!clickable) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Link href={href}>
      <a {...restProps} className={className}>
        {children}
      </a>
    </Link>
  );
};
