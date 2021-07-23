import {gql} from '@apollo/client';

export const ORDER_FRAGMENT = gql`
  fragment orderFields on Order {
    currency
    databaseId
    customerNote
    customerUserAgent
    date
    dateCompleted
    datePaid
    discountTax(format: FORMATTED)
    discountTotal(format: FORMATTED)
    hasBillingAddress
    hasDownloadableItem
    hasShippingAddress
    lineItems {
      nodes {
        databaseId
        orderId
        product {
          sku
          databaseId
          image {
            sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
          }
          name
          onSale
          status
          ... on SimpleProduct {
            id
            name
            price(format: FORMATTED)
          }
        }
        subtotal
        quantity
        subtotalTax
        total
        taxes {
          subtotal
          total
        }
      }
    }
    status
    subtotal(format: FORMATTED)
    taxLines {
      edges {
        node {
          databaseId
          isCompound
          label
          orderId
          rateCode
          shippingTaxTotal
          taxTotal
        }
      }
    }
    total
    totalTax
    transactionId
    shippingTotal
    shippingTax
    pricesIncludeTax
    paymentMethodTitle
    paymentMethod
    orderNumber
    needsShippingAddress
    needsProcessing
    needsPayment
  }
`;

export const GET_ORDERS = gql`
  ${ORDER_FRAGMENT}
  query Orders {
    orders {
      nodes {
        ...orderFields
      }
    }
  }
`;

export const GET_ORDER = gql`
  ${ORDER_FRAGMENT}
  query Order($id: ID) {
    order(id: $id, idType: DATABASE_ID) {
      ...orderFields
    }
  }
`;

export const GET_PAYMENT_GATEWAY = gql`
  query PaymentGateway {
    paymentGateways {
      nodes {
        icon
        description
        id
        title
      }
    }
  }
`;

export const CREATE_ORDER = gql`
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
