export function eatClick(e: React.MouseEvent<any>) {
  e.preventDefault();
  e.stopPropagation();
}

export function stopPropagation(e: React.MouseEvent<any>) {
  e.stopPropagation();
}
