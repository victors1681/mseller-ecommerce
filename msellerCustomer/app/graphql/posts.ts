import {gql} from '@apollo/client';

export const GET_PROMO_POSTS = gql`
  query PromoPosts($where: RootQueryToPostConnectionWhereArgs) {
    posts(where: $where) {
      nodes {
        title
        status
        date
        featuredImage {
          node {
            sourceUrl(size: LARGE)
          }
        }
      }
    }
  }
`;
