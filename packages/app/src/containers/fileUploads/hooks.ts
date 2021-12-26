import { useMutation } from "@apollo/client";
import slugify from "slugify";
import * as Mutations from "@dewo/app/graphql/mutations";
import {
  CreateFileUploadMutation,
  CreateFileUploadMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useUploadImage(): (file: File) => Promise<string> {
  const [createSignedUrl] = useMutation<
    CreateFileUploadMutation,
    CreateFileUploadMutationVariables
  >(Mutations.createFileUploadUrl);
  return useCallback(
    async (image: File): Promise<string> => {
      const { data } = await createSignedUrl({
        variables: {
          input: { fileName: slugify(image.name), contentType: image.type },
        },
      });
      if (!data?.fileUpload) throw new Error("Failed to upload image");
      await fetch(data.fileUpload.signedUrl, { method: "PUT", body: image });
      return data.fileUpload.publicUrl;
    },
    [createSignedUrl]
  );
}
