declare module 'uuid-base62' {
  export function encode(uuid: string): string;
  export function decode(input: string): string;
}