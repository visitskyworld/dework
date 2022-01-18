import { useMutation } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import { PostFeedbackToDiscordMutationVariables } from "@dewo/app/graphql/types";
import { useCallback } from "react";
import { PostFeedbackToDiscordMutation } from "../../graphql/types";

export function usePostFeedbackToDiscord(): (
  input: PostFeedbackToDiscordMutationVariables
) => Promise<boolean> {
  const [postFeedback] = useMutation<
    PostFeedbackToDiscordMutation,
    PostFeedbackToDiscordMutationVariables
  >(Mutations.postFeedbackToDiscord);
  return useCallback(
    async (input) => {
      const res = await postFeedback({ variables: input });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.messageSent;
    },
    [postFeedback]
  );
}
