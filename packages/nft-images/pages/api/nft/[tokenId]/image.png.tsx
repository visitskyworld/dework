import { Response } from "express";
import * as Puppeteer from "puppeteer-core";
import absoluteUrl from "next-absolute-url";
import { IncomingMessage } from "http";

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export default async function handler(req: IncomingMessage, res: Response) {
  const browser = await Puppeteer.launch({
    args: [],
    executablePath: exePath,
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 318, height: 468, deviceScaleFactor: 2 });
  await page.goto(`${absoluteUrl(req).origin}/render`);
  const file = await page.screenshot({ type: "png", omitBackground: true });
  await page.close();

  res.statusCode = 200;
  res.setHeader("Content-Type", "image/png");
  res.send(file);
}
