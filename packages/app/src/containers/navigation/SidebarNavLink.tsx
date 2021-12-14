import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import React, { FC, useMemo } from "react";

interface Props extends LinkProps {
  exact?: boolean;
  className?: string;
}

export const SidebarNavLink: FC<Props> = ({
  exact,
  href,
  children,
  ...restProps
}) => {
  const { asPath } = useRouter();
  const isActive = useMemo(
    () => (exact ? asPath === href : asPath.startsWith(href as string)),
    [exact, asPath, href]
  );

  const className = [restProps.className ?? "", isActive ? "active" : ""].join(
    " "
  );

  return (
    <Link href={href}>
      <a {...restProps} className={className}>
        {children}
      </a>
    </Link>
  );
};
