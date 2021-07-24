import {gql} from '@apollo/client';

export const CUSTOMER_FRAGMENT = gql`
  fragment customerFields on Customer {
    id
    databaseId
    email
    firstName
    lastName
    username
    isJwtAuthSecretRevoked
    metaData {
      id
      key
      value
    }
    billing {
      address1
      address2
      city
      company
      country
      email
      firstName
      lastName
      phone
      postcode
      state
    }
    shipping {
      address1
      address2
      city
      country
      company
      email
      firstName
      lastName
      phone
      postcode
      state
    }
    orders {
      nodes {
        currency
        date
        dateCompleted
        datePaid
        needsPayment
        status
        subtotal(format: FORMATTED)
        total(format: FORMATTED)
        totalTax(format: FORMATTED)
        transactionId
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    __typename
    login(input: $input) {
      authToken
      refreshToken
      sessionToken
      customer {
        id
        email
        firstName
        lastName
        username
      }
      user {
        id
        name
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($input: RefreshJwtAuthTokenInput!) {
    __typename
    refreshJwtAuthToken(input: $input) {
      authToken
    }
  }
`;

export const REGISTER_CUSTOMER = gql`
  mutation RegisterCustomer($input: RegisterCustomerInput!) {
    __typename
    registerCustomer(input: $input) {
      authToken
      refreshToken
      customer {
        id
        email
        databaseId
        firstName
        lastName
        isJwtAuthSecretRevoked
        jwtAuthExpiration
        jwtAuthToken
        jwtRefreshToken
        jwtUserSecret
        lastName
        sessionToken
      }
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  ${CUSTOMER_FRAGMENT}
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    __typename
    updateCustomer(input: $input) {
      customer {
        ...customerFields
      }
    }
  }
`;

export const GET_CUSTOMER_INFO = gql`
  ${CUSTOMER_FRAGMENT}
  query CustomerInfo {
    customer {
      ...customerFields
    }
  }
`;

export const GET_VIEWER = gql`
  query Viewer {
    viewer {
      id
    }
  }
`;
