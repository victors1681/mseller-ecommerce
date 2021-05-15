import {gql} from '@apollo/client';

export const GET_ORDERS = gql`
  query Orders {
    orders {
      nodes {
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
    }
  }
`;
