import gql from "graphql-tag";

export const getTaskNFT = gql`
  query GetTaskNFTMetadataQuery($tokenId: Int!, $contractId: String!) {
    nft: getTaskNFT(tokenId: $tokenId, contractId: $contractId) {
      id
      tokenId
      permalink
      assignee {
        ...User
      }
      owner {
        ...User
      }
      task {
        id
        name
        doneAt
        project {
          organization {
            name
            permalink
            imageUrl
          }
        }
      }
    }
  }

  fragment User on User {
    username
    imageUrl
    threepids {
      source
      threepid
    }
    paymentMethods {
      type
      address
    }
  }
`;
