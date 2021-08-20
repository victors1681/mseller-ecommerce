import {gql} from '@apollo/client';

export const CARTNET_CUSTOMER_FRAGMENT = gql`
  fragment customerFields on CardNetCustomer {
    additionalData
    billingAddress
    captureURL
    commerceCustomerId
    created
    customerId
    docNumber
    documentTypeId
    email
    enabled
    firstName
    lastName
    owner
    paymentProfiles {
      brand
      cardOwner
      enabled
      expiration
      last4
      issuerBank
      paymentMediaId
      paymentProfileId
      token
      type
    }
    phoneNumber
    plans
    shippingAddress
    uRL
    uniqueID
  }
`;

export const GET_CARDNET_CUSTOMER = gql`
  ${CARTNET_CUSTOMER_FRAGMENT}
  query CardnetCustomer($customerId: Int) {
    cardnetCustomer(customerId: $customerId) {
      ...customerFields
    }
  }
`;

export const DELETE_CREDIT_CARD = gql`
  ${CARTNET_CUSTOMER_FRAGMENT}
  mutation DeleteCreditCard($input: DeleteCardnetPaymentProfileInput!) {
    deleteCardnetPaymentProfile(input: $input) {
      customer {
        ...customerFields
      }
    }
  }
`;

export const CREATE_PURCHASE = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      orderId
      order {
        customerUserAgent
        date
        id
        databaseId
      }
    }
  }
`;
