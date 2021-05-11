import {GET_PRODUCT} from 'app/graphql';
import {
  RootQueryToProductConnection,
  RootQueryToProductCategoryConnection,
  Product,
  ProductIdTypeEnum,
} from 'app/generated/graphql';
import {useQuery, ApolloError} from '@apollo/client';

interface ProductResponseData {
  products: RootQueryToProductConnection;
}
interface QuerySingleProductArgs {
  id: string | number;
  idType: ProductIdTypeEnum;
}
interface SingleProductResponseData {
  product: Product;
}
interface CategoriesResponseData {
  productCategories?: RootQueryToProductCategoryConnection;
}

export interface ProductStore {
  data: SingleProductResponseData | undefined;
  isLoading: boolean;
  error: ApolloError | undefined;
}

/**
 * Hold all data and methods for the cart
 * @returns
 */

export const useProductDetail = ({
  productId,
}: {
  productId: number;
}): ProductStore => {
  /**
   * Product
   */
  const {loading, data, error} = useQuery<
    SingleProductResponseData,
    QuerySingleProductArgs
  >(GET_PRODUCT, {
    variables: {
      id: productId,
      idType: ProductIdTypeEnum.DatabaseId,
    },
  });

  return {
    isLoading: loading,
    data,
    error,
  };
};
