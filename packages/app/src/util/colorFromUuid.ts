import * as Colors from "@ant-design/colors";

const allColors = [
  "red",
  "volcano",
  "gold",
  "orange",
  "yellow",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
  "magenta",
];

export function colorNameFromUuid(uuid: string): string {
  const hash = uuid.split("-")[0];
  const hashInt = parseInt(hash, 16);
  return allColors[hashInt % allColors.length];
}

export function colorFromUuid(uuid: string): string {
  // @ts-ignore
  return Colors[colorNameFromUuid(uuid)].primary;
}
