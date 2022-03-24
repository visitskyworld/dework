import { createApolloClient } from "@dewo/app/graphql/apollo";
import {
  GetOrganizationQuery,
  GetOrganizationQueryVariables,
} from "@dewo/app/graphql/types";
import * as Queries from "@dewo/app/graphql/queries";
import { uuidFromBase62 } from "@dewo/app/util/uuid";
import { GetServerSideProps, NextPage } from "next";

const Page: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = createApolloClient(ctx);
  const { organizationSlug } = ctx.params as {
    organizationSlug: string;
  };
  const encodedId = organizationSlug.split("-").pop()!;
  const uuid = uuidFromBase62(encodedId);

  try {
    const { data } = await apolloClient.query<
      GetOrganizationQuery,
      GetOrganizationQueryVariables
    >({
      query: Queries.organization,
      variables: { organizationId: uuid },
    });

    if (data?.organization) {
      return {
        redirect: {
          destination:
            data.organization.permalink +
            (ctx.resolvedUrl.split(organizationSlug)[1] || ""),
          permanent: true,
        },
      };
    }
  } catch (e) {}

  return {
    notFound: true,
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
};

export default Page;
