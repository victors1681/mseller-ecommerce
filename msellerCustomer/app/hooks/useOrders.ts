import {GET_ORDERS} from 'app/graphql';
import {RootQueryToOrderConnection} from 'app/generated/graphql';
import {
  ApolloError,
  OperationVariables,
  QueryLazyOptions,
  useLazyQuery,
} from '@apollo/client';

interface OrdersResponseData {
  orders: RootQueryToOrderConnection;
}

export interface OrdersStore {
  getOrders: (
    options?: QueryLazyOptions<OperationVariables> | undefined,
  ) => void;
  called: boolean;
  data: OrdersResponseData | undefined;
  isLoading: boolean;
  error: ApolloError | undefined;
}

/**
 * Hold all data and methods for the cart
 * @returns
 */

export const useOrders = (): OrdersStore => {
  /**
   * Orders
   */
  const [
    getOrders,
    {called, loading, data, error},
  ] = useLazyQuery<OrdersResponseData>(GET_ORDERS);

  return {
    called,
    getOrders,
    isLoading: loading,
    data,
    error,
  };
};
