import {gql} from '@apollo/client';

export const GET_ALL_CATEGORIES = gql`
  query Category {
    productCategories {
      nodes {
        id
        name
        image {
          mediaItemUrl
          sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
        }
        description
        count
        databaseId
      }
    }
  }
`;
