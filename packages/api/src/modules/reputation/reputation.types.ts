export namespace Reputation {
  export interface Response {
    address: string;
    tasks: {
      name: string;
      permalink: string;
      points: number | null;
      date: string;
      reward: {
        amount: string;
        token: {
          address: string;
          network: {
            slug: string;
          };
        };
      } | null;
      project: {
        name: string;
        permalink: string;
        organization: {
          name: string;
          permalink: string;
        };
      };
      tags: { label: string }[];
    }[];
  }
}
