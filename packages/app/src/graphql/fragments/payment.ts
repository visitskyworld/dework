import gql from "graphql-tag";

export const network = gql`
  fragment PaymentNetwork on PaymentNetwork {
    id
    slug
    name
    type
    config
    sortKey
  }
`;

export const token = gql`
  fragment PaymentToken on PaymentToken {
    id
    exp
    type
    name
    symbol
    address
    identifier
    usdPrice
    networkId
    visibility
    imageUrl
  }
`;

export const paymentMethod = gql`
  fragment PaymentMethod on PaymentMethod {
    id
    type
    address
    network {
      ...PaymentNetwork
    }
  }

  ${network}
`;

export const payment = gql`
  fragment Payment on Payment {
    id
    status
    data
    paymentMethod {
      ...PaymentMethod
    }
    network {
      ...PaymentNetwork
    }
  }

  ${paymentMethod}
  ${network}
`;
