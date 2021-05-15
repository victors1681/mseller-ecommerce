import {GET_ORDERS} from 'app/graphql';
import {RootQueryToOrderConnection} from 'app/generated/graphql';
import {useQuery, ApolloError} from '@apollo/client';

interface OrdersResponseData {
  orders: RootQueryToOrderConnection;
}

export interface OrdersStore {
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
  const {loading, data, error} = useQuery<OrdersResponseData>(GET_ORDERS);

  return {
    isLoading: loading,
    data,
    error,
  };
};
