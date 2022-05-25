import { GetServerSidePropsContext, NextPageContext } from "next";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { isSSR } from "./isSSR";
import { LocalStorage } from "./LocalStorage";

const AUTH_TOKEN_KEY = "dewo_auth_token";

if (!isSSR) {
  (window as any).clearAuth = function () {
    clearAuthToken(undefined);
    window.location.href = "/";
  };
}

function getAuthTokens(
  ctx: NextPageContext | GetServerSidePropsContext | undefined
) {
  const fromCookies = parseCookies(ctx)[AUTH_TOKEN_KEY];
  const fromLocalStorage = !isSSR
    ? LocalStorage.getItem(AUTH_TOKEN_KEY)
    : undefined;
  // @ts-ignore
  const fromSSRContext = ctx?.req?.authToken;
  return { fromCookies, fromLocalStorage, fromSSRContext };
}

export function getAuthToken(
  ctx: NextPageContext | GetServerSidePropsContext | undefined
): string | undefined {
  const tokens = getAuthTokens(ctx);
  return tokens.fromSSRContext ?? tokens.fromCookies ?? tokens.fromLocalStorage;
}

export function isCookiesDisabled(
  ctx: NextPageContext | GetServerSidePropsContext | undefined
) {
  const tokens = getAuthTokens(ctx);
  return !!tokens.fromLocalStorage && !tokens.fromCookies;
}

export function setAuthToken(
  ctx: NextPageContext | undefined,
  authToken: string
) {
  // @ts-ignore
  if (!!ctx?.req) ctx.req.authToken = authToken;
  LocalStorage.setItem(AUTH_TOKEN_KEY, authToken);
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
  if (!isSSR) LocalStorage.removeItem(AUTH_TOKEN_KEY);
  destroyCookie(ctx, AUTH_TOKEN_KEY, { path: "/" });
}
