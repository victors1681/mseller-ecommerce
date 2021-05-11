import {GET_ALL_PRODUCTS, GET_ALL_CATEGORIES} from 'app/graphql';
import {
  RootQueryToProductConnectionWhereArgs,
  RootQueryToProductConnection,
  RootQueryToProductCategoryConnection,
  Product,
  ProductIdTypeEnum,
} from 'app/generated/graphql';
import {
  useQuery,
  ApolloError,
  OperationVariables,
  ApolloQueryResult,
} from '@apollo/client';
import React from 'react';

interface QueryArgs {
  where: RootQueryToProductConnectionWhereArgs;
}
interface ProductResponseData {
  products: RootQueryToProductConnection;
}
interface SingleProductResponseData {
  product: Product;
}
interface CategoriesResponseData {
  productCategories?: RootQueryToProductCategoryConnection;
}

export interface ProductStore {
  handleSearch: (_search: string, _categoryId?: number) => void;
  product: {
    data: ProductResponseData | undefined;
    isLoading: boolean;
    error: ApolloError | undefined;
    refetch: (
      variables?: Partial<OperationVariables> | undefined,
    ) => Promise<ApolloQueryResult<ProductResponseData>>;
  };
  categories: {
    data: CategoriesResponseData | undefined;
    isLoading: boolean;
    error: ApolloError | undefined;
  };
}

/**
 * Hold all data and methods for the cart
 * @returns
 */

export const useProductStore = (): ProductStore => {
  const [search, setSearch] = React.useState<string>('');
  const [categoryId, setCategoryId] = React.useState<number | undefined>();

  const handleSearch = (_search: string, _categoryId?: number) => {
    setSearch(_search);
    setCategoryId(_categoryId);
  };

  /**
   * Products
   */
  const {
    loading: isProductLoading,
    data: productData,
    error: productError,
    refetch: productRefetch,
  } = useQuery<ProductResponseData, QueryArgs>(GET_ALL_PRODUCTS, {
    variables: {
      where: {categoryId, search},
    },
  });

  /**
   * Category
   */

  const {
    loading: categoriesLoading,
    data: categoriesData,
    error: categoriesError,
  } = useQuery<CategoriesResponseData>(GET_ALL_CATEGORIES);

  return {
    handleSearch,
    product: {
      data: productData,
      isLoading: isProductLoading,
      error: productError,
      refetch: productRefetch,
    },
    categories: {
      data: categoriesData,
      isLoading: categoriesLoading,
      error: categoriesError,
    },
  };
};
