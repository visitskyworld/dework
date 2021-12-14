import { useRouter } from "next/router";
import encoder from "uuid-base62";

export const useParseIdFromSlug = (
  slug: "organizationSlug" | "projectSlug"
): string | undefined => {
  const router = useRouter();
  const query = router.query[slug] as string;
  if (!query) return undefined;
  const encodedId = query.split("-").pop()!;
  return uuidFromBase62(encodedId);
};

export const uuidToBase62 = (uuid: string): string => {
  return encoder.encode(uuid);
};

export const uuidFromBase62 = (input: string): string => {
  try {
    return encoder.decode(input);
  } catch (error) {
    console.error("Couldn't decode:", input);
    return input;
  }
};
