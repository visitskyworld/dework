import React, { FC, ReactElement } from "react";
import { TaskStatus } from "@dewo/app/graphql/types";

const IconMapping: Record<TaskStatus, (size: number) => ReactElement> = {
  [TaskStatus.COMMUNITY_SUGGESTIONS]: () => <></>,
  [TaskStatus.BACKLOG]: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8.5"
        cy="8.5"
        r="7.75"
        stroke="white"
        stroke-width="1.5"
        stroke-dasharray="3 2"
      />
    </svg>
  ),
  [TaskStatus.TODO]: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8.5" cy="8.5" r="7.75" stroke="#F8F8F8" stroke-width="1.5" />
    </svg>
  ),
  [TaskStatus.IN_REVIEW]: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8.5" cy="9.5" r="7.75" stroke="#7392FF" stroke-width="1.5" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.87744 9.63072C2.91236 12.6701 5.38708 15.1232 8.43476 15.1232C11.5042 15.1232 13.9925 12.635 13.9925 9.56555C13.9925 6.51789 11.5394 4.04318 8.49997 4.00823V9.63072H2.87744Z"
        fill="#7392FF"
      />
    </svg>
  ),
  [TaskStatus.IN_PROGRESS]: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8.5"
        cy="9.38892"
        r="7.75"
        stroke="#FFD260"
        stroke-width="1.5"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.5 15.0118C11.5394 14.9769 13.9925 12.5021 13.9925 9.45447C13.9925 6.4068 11.5394 3.93209 8.5 3.89716V15.0118Z"
        fill="#FFD260"
      />
    </svg>
  ),
  [TaskStatus.DONE]: (size) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8.96276" cy="7.93469" r="4.62585" fill="white" />
      <path
        d="M8.5 0C3.80603 0 0 3.80603 0 8.5C0 13.194 3.80603 17 8.5 17C13.194 17 17 13.194 17 8.5C17 3.80603 13.194 0 8.5 0ZM12.1713 5.72422L8.17556 11.2644C8.11971 11.3423 8.04609 11.4059 7.96079 11.4497C7.8755 11.4935 7.78099 11.5163 7.6851 11.5163C7.58921 11.5163 7.4947 11.4935 7.40941 11.4497C7.32411 11.4059 7.25049 11.3423 7.19464 11.2644L4.82868 7.98583C4.75659 7.88527 4.82868 7.74487 4.95201 7.74487H5.84185C6.03538 7.74487 6.21942 7.83783 6.33326 7.99721L7.68415 9.87176L10.6667 5.7356C10.7806 5.57812 10.9627 5.48326 11.1581 5.48326H12.048C12.1713 5.48326 12.2434 5.62366 12.1713 5.72422Z"
        fill="#715AFF"
      />
    </svg>
  ),
};

interface Props {
  status: TaskStatus;
  size?: number;
}

export const TaskStatusIcon: FC<Props> = ({ status, size = 16 }) =>
  IconMapping[status](size);
