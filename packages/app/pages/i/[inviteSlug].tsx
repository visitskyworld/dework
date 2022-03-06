import { GetServerSideProps } from "next";
import { uuidFromBase62 } from "@dewo/app/util/uuid";
import {
  GetInviteQuery,
  GetInviteQueryVariables,
} from "@dewo/app/graphql/types";
import { createApolloClient } from "@dewo/app/graphql/apollo";
import * as Queries from "@dewo/app/graphql/queries";
import { message } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { inviteSlug } = ctx.params as { inviteSlug: string };
  const inviteId = uuidFromBase62(inviteSlug);
  const apolloClient = createApolloClient(ctx);

  try {
    const { data } = await apolloClient.query<
      GetInviteQuery,
      GetInviteQueryVariables
    >({
      query: Queries.invite,
      variables: { inviteId: inviteId! },
    });

    if (data?.invite) {
      const { organization, project, id } = data.invite;
      if (!!project) {
        return {
          redirect: {
            destination: `${project.permalink}?inviteId=${id}`,
            permanent: false,
          },
        };
      }
      if (!!organization) {
        return {
          redirect: {
            destination: `${organization.permalink}?inviteId=${id}`,
            permanent: false,
          },
        };
      }
    }
  } catch (e) {}

  return { props: {} };
};

export default () => {
  const router = useRouter();

  useEffect(() => {
    message.error("Invalid invite. Please check URL or ask for a new one.");
    router.replace("/");
  }, [router]);

  return null;
};
