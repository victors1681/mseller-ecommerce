import {GET_ORDERS, CREATE_ORDER} from 'app/graphql';
import {
  RootQueryToOrderConnection,
  CreateOrderInput,
} from 'app/generated/graphql';
import {
  ApolloError,
  FetchResult,
  MutationResult,
  OperationVariables,
  QueryLazyOptions,
  useLazyQuery,
  useMutation,
} from '@apollo/client';

interface OrdersResponseData {
  orders: RootQueryToOrderConnection;
}

interface CreateOrderResponse {
  orders: RootQueryToOrderConnection;
}

interface CreateOrderArgs {
  input: CreateOrderInput;
}

export interface OrdersStore {
  getOrders: (
    options?: QueryLazyOptions<OperationVariables> | undefined,
  ) => void;
  called: boolean;
  data: OrdersResponseData | undefined;
  isLoading: boolean;
  error: ApolloError | undefined;
  createOrder: (
    input: CreateOrderInput,
  ) => Promise<
    | FetchResult<CreateOrderResponse, Record<string, any>, Record<string, any>>
    | undefined
  >;
  createOrderInfo: MutationResult<CreateOrderResponse>;
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

  const [newOrder, createOrderInfo] = useMutation<
    CreateOrderResponse,
    CreateOrderArgs
  >(CREATE_ORDER);

  const createOrder = async (input: CreateOrderInput) => {
    try {
      return await newOrder({
        variables: {
          input,
        },
      });
    } catch (err) {
      console.error(error);
    }
  };

  return {
    called,
    getOrders,
    isLoading: loading,
    data,
    error,
    createOrder,
    createOrderInfo,
  };
};
