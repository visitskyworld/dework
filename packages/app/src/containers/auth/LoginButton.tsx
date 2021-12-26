import { stopPropagation } from "@dewo/app/util/eatClick";
import { Button, ButtonProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";

export const LoginButton: FC<ButtonProps> = (props) => {
  const router = useRouter();
  return (
    <Link href={`/auth?redirect=${router.asPath}`}>
      <a onClick={stopPropagation}>
        <Button {...props} />
      </a>
    </Link>
  );
};
