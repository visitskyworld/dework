import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import { FC, useMemo } from "react";

interface Props extends LinkProps {
  exact?: boolean;
  className?: string;
}
const NavLink: FC<Props> = ({ exact, href, children, ...restProps }) => {
  const { asPath } = useRouter();
  const isActive = useMemo(
    () => (exact ? asPath === href : asPath.startsWith(href as string)),
    [exact, asPath, href]
  );

  if (isActive) {
    restProps.className += " active";
  }

  return (
    <Link href={href}>
      <a {...restProps}>{children}</a>
    </Link>
  );
};

export default NavLink;
