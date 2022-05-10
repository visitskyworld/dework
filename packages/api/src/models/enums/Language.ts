import { registerEnumType } from "@nestjs/graphql";

export enum Language {
  CHINESE = "zh",
  ENGLISH = "en",
}

registerEnumType(Language, { name: "Language" });
