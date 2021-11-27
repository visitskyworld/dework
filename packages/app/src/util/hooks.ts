import { useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import { MeQuery, User } from "../graphql/types";

export function useUser(skip: boolean = false): User | undefined {
  const { data } = useQuery<MeQuery>(Queries.me, { skip });
  return data?.me;
}
