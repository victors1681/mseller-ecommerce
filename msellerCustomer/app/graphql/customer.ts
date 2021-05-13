import {gql} from '@apollo/client';

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    __typename
    login(input: $input) {
      authToken
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
        email
        databaseId
        firstName
        isJwtAuthSecretRevoked
        jwtAuthExpiration
        jwtAuthToken
        jwtRefreshToken
        jwtUserSecret
        lastName
        locale
        sessionToken
      }
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    __typename
    registerCustomer(input: $input) {
      authToken
      refreshToken
      customer {
        email
        databaseId
        firstName
        isJwtAuthSecretRevoked
        jwtAuthExpiration
        jwtAuthToken
        jwtRefreshToken
        jwtUserSecret
        lastName
        locale
        wooSessionToken
      }
    }
  }
`;

export const GET_CUSTOMER_INFO = gql`
  query CustomerInfo {
    databaseId
    email
    firstName
    lastName
    username
    isJwtAuthSecretRevoked
    jwtAuthToken
    jwtRefreshToken
    jwtAuthExpiration
    customer {
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
  }
`;
