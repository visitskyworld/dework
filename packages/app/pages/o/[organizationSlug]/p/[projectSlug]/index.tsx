import { createApolloClient } from "@dewo/app/graphql/apollo";
import {
  GetProjectQuery,
  GetProjectQueryVariables,
} from "@dewo/app/graphql/types";
import { uuidFromBase62 } from "@dewo/app/util/uuid";
import { GetServerSideProps, NextPage } from "next";
import * as Queries from "@dewo/app/graphql/queries";

const Page: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = createApolloClient(ctx);
  const { projectSlug } = ctx.params as {
    projectSlug: string;
  };
  const encodedId = projectSlug.split("-").pop()!;
  const uuid = uuidFromBase62(encodedId);

  try {
    const { data } = await apolloClient.query<
      GetProjectQuery,
      GetProjectQueryVariables
    >({ query: Queries.getProject, variables: { projectId: uuid } });

    if (data?.project) {
      return {
        redirect: {
          destination:
            data.project.permalink +
            (ctx.resolvedUrl.split(projectSlug)[1] || ""),
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
