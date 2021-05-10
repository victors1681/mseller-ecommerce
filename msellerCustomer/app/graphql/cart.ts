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
      productCount
      itemCount
      nodes {
        quantity
        total
        key
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

export const REMOVE_ITEM = gql`
  ${CART_FRAGMENT}
  mutation RemoveItem($input: RemoveItemsFromCartInput!) {
    __typename
    removeItemsFromCart(input: $input) {
      cart {
        ...cartFields
      }
    }
  }
`;

export const UPDATE_QUANTITY = gql`
  ${CART_FRAGMENT}
  mutation UpdateItemQuantities($input: UpdateItemQuantitiesInput!) {
    __typename
    updateItemQuantities(input: $input) {
      cart {
        ...cartFields
      }
    }
  }
`;
