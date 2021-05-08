import {gql} from '@apollo/client';

export const CART_FRAGMENT = gql`
  fragment cartFields on Cart {
    contentsTax
    discountTax
    discountTotal
    isEmpty
    subtotal
    subtotalTax
    total
    totalTax
    contents {
      nodes {
        quantity
        total
        product {
          node {
            image {
              sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
            }
            name
            databaseId
            id
            shortDescription(format: RAW)
          }
        }
      }
    }
  }
`;

export const GET_CART = gql`
  ${CART_FRAGMENT}
  query Cart {
    cart(recalculateTotals: true) {
      ...cartFields
    }
  }
`;

export const ADD_TO_CART = gql`
  ${CART_FRAGMENT}
  mutation($input: AddToCartInput!) {
    __typename
    addToCart(input: $input) {
      cart {
        ...cartFields
      }
    }
  }
`;
