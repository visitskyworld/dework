import gql from "graphql-tag";

export const getTaskNFT = gql`
  query GetTaskNFTMetadataQuery($tokenId: Int!) {
    nft: getTaskNFT(tokenId: $tokenId) {
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
        name
        doneAt
        project {
          organization {
            name
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
  }
`;
