import React, { FC, ReactNode } from "react";

interface Props {
  icon: ReactNode;
  children: string;
}

export const Tab: FC<Props> = ({ icon, children }) => (
  <>
    {icon}
    {children}
  </>
);
