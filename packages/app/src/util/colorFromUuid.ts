import * as Colors from "@ant-design/colors";

const allColors = [
  Colors.red,
  Colors.volcano,
  Colors.gold,
  Colors.orange,
  Colors.yellow,
  Colors.lime,
  Colors.green,
  Colors.cyan,
  Colors.blue,
  Colors.geekblue,
  Colors.purple,
  Colors.magenta,
];

export function colorFromUuid(uuid: string): string {
  const hash = uuid.split("-")[0];
  const hashInt = parseInt(hash, 16);
  const color = allColors[hashInt % allColors.length];
  return color.primary!;
}
