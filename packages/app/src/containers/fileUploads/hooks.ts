import { useMutation } from "@apollo/client";
import slugify from "slugify";
import * as Mutations from "@dewo/app/graphql/mutations";
import {
  CreateFileUploadMutation,
  CreateFileUploadMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useUploadFile(): (file: File) => Promise<string> {
  const [createSignedUrl] = useMutation<
    CreateFileUploadMutation,
    CreateFileUploadMutationVariables
  >(Mutations.createFileUploadUrl);
  return useCallback(
    async (file: File): Promise<string> => {
      const { data } = await createSignedUrl({
        variables: {
          input: { fileName: slugify(file.name), contentType: file.type },
        },
      });
      if (!data?.fileUpload) throw new Error("Failed to upload file");
      await fetch(data.fileUpload.signedUrl, { method: "PUT", body: file });
      return data.fileUpload.publicUrl;
    },
    [createSignedUrl]
  );
}
