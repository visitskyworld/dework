import { Response } from "express";

interface MetadataStringAttribute {
  trait_type: "string";
  value: string;
}

interface MetadataNumberAttribute {
  trait_type: "number";
  value: number;
}

interface MetadataDateAttribute {
  trait_type: "date";
  value: number;
}

type MetadataAttribute =
  | MetadataStringAttribute
  | MetadataNumberAttribute
  | MetadataDateAttribute;

interface Metadata {
  image: string;
  name: string;
  description: string;
  external_url: string;
  background_color: string;
  attributes: MetadataAttribute[];
}

export default async function handler(req: Request, res: Response<Metadata>) {
  res.json({
    image: "",
    name: "",
    description: "",
    external_url: "",
    background_color: "",
    attributes: [
      {
        trait_type: "string",
        value: "",
      },
    ],
  });
}
