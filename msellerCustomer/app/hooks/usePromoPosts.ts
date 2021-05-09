import {GET_PROMO_POSTS} from 'app/graphql';
import React from 'react';
import {
  RootQueryToPostConnectionWhereArgs,
  RootQueryToPostConnection,
  PostStatusEnum,
  Post,
} from 'app/generated/graphql';
import {useQuery} from '@apollo/client';

interface PostsResult {
  posts: RootQueryToPostConnection;
}
interface QueryArgs {
  where: RootQueryToPostConnectionWhereArgs;
}
export const usePromoPosts = () => {
  const [images, setImages] = React.useState([] as string[]);

  const {loading, data, error} = useQuery<PostsResult, QueryArgs>(
    GET_PROMO_POSTS,
    {
      variables: {
        where: {categoryName: 'promo', status: PostStatusEnum.Publish},
      },
    },
  );

  const filterImage = () => {
    const nodes = (data?.posts.nodes as Post[]) || [];
    const imagesList = nodes.reduce((acc: string[], current: Post) => {
      if (current?.featuredImage?.node?.sourceUrl) {
        return [...acc, current?.featuredImage?.node?.sourceUrl];
      }
      return acc;
    }, []);

    setImages(imagesList);
  };

  React.useEffect(() => {
    if (!loading) {
      filterImage();
    }
  }, [loading, data?.posts.nodes?.length]);

  return {loading, data, error, images};
};
