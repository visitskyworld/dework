declare module "between" {
  interface Between {
    between(a: string, b: string): string;
    randstr(length: number): string;
    strord(a: string, b: string): number;
    hi: string;
    lo: string;
  }

  export function inject(chars: string): Between;
  export const between: Between;
}
