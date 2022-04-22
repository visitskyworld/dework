import React, { FC } from "react";
import { TaskPriority } from "@dewo/app/graphql/types";

const HighPrio = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="6" width="3" height="7" fill="#E3E3E9" />
    <rect x="5" y="3" width="3" height="10" fill="#E3E3E9" />
    <rect x="10" width="3" height="13" fill="#E3E3E9" />
  </svg>
);
const MedPrio = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="6" width="3" height="7" fill="#E3E3E9" />
    <rect x="5" y="3" width="3" height="10" fill="#E3E3E9" />
    <rect x="10" width="3" height="13" fill="#E3E3E9" fill-opacity="0.22" />
  </svg>
);
const LowPrio = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="6" width="3" height="7" fill="#E3E3E9" />
    <rect
      x="5"
      y="3"
      width="3"
      height="10"
      fill="#E3E3E9"
      fill-opacity="0.22"
    />
    <rect x="10" width="3" height="13" fill="#E3E3E9" fill-opacity="0.22" />
  </svg>
);
const UrgentPrio = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM7.5 4.625C7.5 4.55625 7.55625 4.5 7.625 4.5H8.375C8.44375 4.5 8.5 4.55625 8.5 4.625V8.875C8.5 8.94375 8.44375 9 8.375 9H7.625C7.55625 9 7.5 8.94375 7.5 8.875V4.625ZM8 11.5C7.80374 11.496 7.61687 11.4152 7.47948 11.275C7.3421 11.1348 7.26515 10.9463 7.26515 10.75C7.26515 10.5537 7.3421 10.3652 7.47948 10.225C7.61687 10.0848 7.80374 10.004 8 10C8.19626 10.004 8.38313 10.0848 8.52052 10.225C8.6579 10.3652 8.73485 10.5537 8.73485 10.75C8.73485 10.9463 8.6579 11.1348 8.52052 11.275C8.38313 11.4152 8.19626 11.496 8 11.5Z"
      fill="#FFAB2D"
    />
  </svg>
);
const NoPrio = (
  <svg
    width="11"
    height="19"
    viewBox="0 0 11 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.758 13.16C2.758 13.4027 2.66933 13.6173 2.492 13.804C2.31467 13.9907 2.09067 14.084 1.82 14.084C1.55867 14.084 1.33467 13.9953 1.148 13.818C0.970667 13.6313 0.882 13.4167 0.882 13.174C0.882 12.922 0.970667 12.7073 1.148 12.53C1.32533 12.3433 1.54933 12.25 1.82 12.25C2.09067 12.25 2.31467 12.3387 2.492 12.516C2.66933 12.6933 2.758 12.908 2.758 13.16ZM6.39472 13.16C6.39472 13.4027 6.30605 13.6173 6.12872 13.804C5.95139 13.9907 5.72739 14.084 5.45672 14.084C5.19539 14.084 4.97139 13.9953 4.78472 13.818C4.60739 13.6313 4.51872 13.4167 4.51872 13.174C4.51872 12.922 4.60739 12.7073 4.78472 12.53C4.96205 12.3433 5.18605 12.25 5.45672 12.25C5.72739 12.25 5.95139 12.3387 6.12872 12.516C6.30605 12.6933 6.39472 12.908 6.39472 13.16ZM10.0314 13.16C10.0314 13.4027 9.94277 13.6173 9.76544 13.804C9.5881 13.9907 9.3641 14.084 9.09344 14.084C8.8321 14.084 8.6081 13.9953 8.42144 13.818C8.2441 13.6313 8.15544 13.4167 8.15544 13.174C8.15544 12.922 8.2441 12.7073 8.42144 12.53C8.59877 12.3433 8.82277 12.25 9.09344 12.25C9.3641 12.25 9.5881 12.3387 9.76544 12.516C9.94277 12.6933 10.0314 12.908 10.0314 13.16Z"
      fill="white"
    />
  </svg>
);

interface Props {
  priority: TaskPriority | undefined;
}
export const TaskPriorityIcon: FC<Props> = ({ priority }) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return HighPrio;
    case TaskPriority.MEDIUM:
      return MedPrio;
    case TaskPriority.LOW:
      return LowPrio;
    case TaskPriority.URGENT:
      return UrgentPrio;
    default:
      return NoPrio;
  }
};
