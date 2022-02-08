import React, { FC, ReactNode } from "react";

interface Props {
  icon: ReactNode;
  children: ReactNode;
}

export const Tab: FC<Props> = ({ icon, children }) => (
  <>
    {icon}
    {children}
  </>
);
