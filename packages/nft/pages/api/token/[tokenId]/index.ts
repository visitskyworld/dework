import { Request, Response } from "express";
import { Metadata } from "@dewo/nft/utils/types";
import { getTokenMetadata } from "@dewo/nft/utils/tokenId";
import absoluteUrl from "next-absolute-url";

export default async function handler(
  req: Request,
  res: Response<Metadata | { error: string }>
) {
  try {
    const tokenId = parseInt(req.query.tokenId as string);
    const origin = absoluteUrl(req).origin;
    const metadata = await getTokenMetadata(tokenId, origin);
    res.json(metadata);
  } catch {
    res.status(404);
    res.json({ error: "Token not found" });
  }
}
