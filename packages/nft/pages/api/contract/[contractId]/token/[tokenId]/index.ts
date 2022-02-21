import { Request, Response } from "express";
import { Metadata } from "@dewo/nft/utils/types";
import { getTokenMetadata } from "@dewo/nft/utils/tokenId";
import absoluteUrl from "next-absolute-url";

export default async function handler(
  req: Request,
  res: Response<Metadata | { error: string }>
) {
  try {
    const origin = absoluteUrl(req).origin;
    const tokenId = parseInt(req.query.tokenId as string);
    const contractId = req.query.contractId as string;
    const metadata = await getTokenMetadata(origin, contractId, tokenId);
    res.json(metadata);
  } catch {
    res.status(404);
    res.json({ error: "Token not found" });
  }
}
