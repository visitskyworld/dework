declare module "nearest-color" {
  interface NearestColorResult<TColor extends string = string> {
    name: TColor;
    value: string;
    distance: number;
    rgb: {
      r: number;
      g: number;
      b: number;
    };
  }

  interface NearestColor<TColor extends string = string> {
    (color: string): NearestColorResult<TColor>;
    from<TColor>(colors: Record<TColor, string>): NearestColor<TColor>;
  }

  const nearestColor: NearestColor;

  export default nearestColor;
}
