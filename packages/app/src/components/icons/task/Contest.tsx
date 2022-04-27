import React from "react";
import Icon from "@ant-design/icons";

const ContestSvg = () => (
  <svg viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0.7"
      d="M13.205 20.0572C12.819 20.0944 12.4237 20.113 12.0235 20.113C11.6232 20.113 11.2279 20.0944 10.842 20.0572C10.7377 20.0472 10.6448 20.095 10.6448 20.16V21.4727H10.6258C9.86437 21.4727 9.24707 22.0874 9.24707 22.8454H14.7619C14.7619 22.0938 14.1547 21.4849 13.4022 21.4745V20.16C13.4022 20.095 13.3092 20.0472 13.205 20.0572Z"
      fill="#EFB72A"
    />
    <path
      d="M16.1409 24.2542H7.86855C7.48783 24.2542 7.1792 24.5615 7.1792 24.9406V26.3135C7.1792 26.6926 7.48783 26.9999 7.86855 26.9999H16.1409C16.5215 26.9999 16.8302 26.6926 16.8302 26.3135V24.9406C16.8302 24.5615 16.5215 24.2542 16.1409 24.2542Z"
      fill="#EFB72A"
    />
    <path
      d="M21.2767 5.36048C20.1018 4.77348 18.8064 5.00479 17.9041 5.73512H6.1277C5.22422 4.98342 3.91257 4.73766 2.72324 5.33187C0.64501 6.37984 0.396627 9.21685 2.25075 10.6014L5.86365 13.2943C6.21085 16.3787 8.83586 18.7772 12.0261 18.7772C15.2205 18.7772 17.8486 16.3727 18.1903 13.2826L21.7492 10.63C23.6042 9.24468 23.3541 6.40794 21.2767 5.36048ZM5.7909 11.4411L3.12308 9.44329C2.12092 8.70629 2.26838 7.18728 3.37752 6.62754C4.49216 6.07239 5.7909 6.88012 5.7909 8.11137V11.4411ZM20.8768 9.47186L18.2304 11.4537V7.93855C18.358 6.85323 19.5461 6.12035 20.6225 6.65612C21.7331 7.21669 21.8778 8.73582 20.8768 9.47186Z"
      fill="#EFB72A"
    />
  </svg>
);

export const ContestIcon = (props: any) => (
  <Icon component={ContestSvg} {...props} />
);
