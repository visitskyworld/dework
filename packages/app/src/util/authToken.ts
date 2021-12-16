import { NextPageContext } from "next";
import { parseCookies, setCookie, destroyCookie } from "nookies";

const AUTH_TOKEN_KEY = "dewo_auth_token";

const isServer = typeof window === "undefined";

if (!isServer) {
  (window as any).clearAuth = function () {
    clearAuthToken(undefined);
    window.location.href = "/";
  };
}

export function getAuthToken(
  ctx: NextPageContext | undefined
): string | undefined {
  const fromCookies = parseCookies(ctx)[AUTH_TOKEN_KEY];
  const fromLocalStorage = !isServer
    ? localStorage.getItem(AUTH_TOKEN_KEY)
    : undefined;
  // @ts-ignore
  const fromSSRContext = ctx?.req?.authToken;
  return fromSSRContext ?? fromCookies ?? fromLocalStorage;
}

export function setAuthToken(
  ctx: NextPageContext | undefined,
  authToken: string
) {
  // @ts-ignore
  if (!!ctx?.req) ctx.req.authToken = authToken;
  if (!isServer) localStorage.setItem(AUTH_TOKEN_KEY, authToken);
  setCookie(ctx, AUTH_TOKEN_KEY, authToken, {
    path: "/",
    sameSite: "none",
    secure: true,
    expires: new Date("2030-01-01T00:00:00.000Z"),
  });
}

export function clearAuthToken(ctx: NextPageContext | undefined) {
  // @ts-ignore
  if (!!ctx?.req) ctx.req.authToken = undefined;
  if (!isServer) localStorage.removeItem(AUTH_TOKEN_KEY);
  destroyCookie(ctx, AUTH_TOKEN_KEY, { path: "/" });
}
