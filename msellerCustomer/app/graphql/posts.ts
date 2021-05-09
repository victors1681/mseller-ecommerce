import {gql} from '@apollo/client';

export const GET_PROMO_POSTS = gql`
  query PromoPosts {
    posts(where: {categoryName: "promo", status: PUBLISH}) {
      nodes {
        title
        status
        date
        featuredImage {
          node {
            sourceUrl(size: MEDIUM)
          }
        }
      }
    }
  }
`;
