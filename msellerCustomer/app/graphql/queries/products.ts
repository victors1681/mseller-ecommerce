import {gql} from '@apollo/client';

export const GET_ALL_PRODUCTS = gql`
  query Products($where: RootQueryToProductConnectionWhereArgs) {
    products(where: $where) {
      nodes {
        description(format: RENDERED)
        id
        image {
          sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
        }
        name
        onSale
        menuOrder
        reviewCount
        shortDescription(format: RAW)
        status
        databaseId
        averageRating
        purchasable
        purchaseNote
        catalogVisibility
        dateOnSaleFrom
        dateOnSaleTo
        totalSales
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          dateOnSaleFrom
          dateOnSaleTo
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;
