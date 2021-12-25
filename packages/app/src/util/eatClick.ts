import { BaseSyntheticEvent } from "react";

export function eatClick(e: BaseSyntheticEvent<any>) {
  e.preventDefault();
  e.stopPropagation();
}

export function stopPropagation(e: BaseSyntheticEvent<any>) {
  e.stopPropagation();
}
