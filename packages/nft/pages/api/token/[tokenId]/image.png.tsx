/*
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
*/

import { Request, Response } from "express";
import * as fs from "fs";

export default async function handler(req: Request, res: Response) {
  try {
    const tokenId = parseInt(req.query.tokenId as string);
    if (tokenId !== 1) throw new Error();
    res.statusCode = 200;
    res.setHeader("content-type", "image/png");
    res.send(fs.readFileSync("./public/sample.png"));
  } catch (error) {
    console.log(error);
    res.status(404);
    res.json({ error: "Token not found" });
  }
}
