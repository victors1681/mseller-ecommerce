import {GET_ORDERS, GET_ORDER, CHECKOUT} from 'app/graphql';
import {
  RootQueryToOrderConnection,
  Order,
  CheckoutPayload,
  CheckoutInput,
} from 'app/generated/graphql';
import {
  ApolloError,
  FetchResult,
  LazyQueryResult,
  MutationResult,
  OperationVariables,
  QueryLazyOptions,
  useLazyQuery,
  useMutation,
} from '@apollo/client';

export interface OrdersResponseData {
  orders: RootQueryToOrderConnection;
}

interface OrderResponseData {
  order: Order;
}
export interface CheckoutResponse {
  checkout: CheckoutPayload;
}

interface CheckoutArgs {
  input: CheckoutInput;
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
    input: CheckoutInput,
  ) => Promise<
    | FetchResult<CheckoutResponse, Record<string, any>, Record<string, any>>
    | ApolloError
    | undefined
  >;
  createOrderInfo: MutationResult<CheckoutResponse>;
  getOrder: (id: string) => Promise<void>;
  orderInfo: LazyQueryResult<OrderResponseData, OperationVariables>;
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
  ] = useLazyQuery<OrdersResponseData>(GET_ORDERS, {
    fetchPolicy: 'network-only',
  });

  const [selectOrder, orderInfo] = useLazyQuery<OrderResponseData>(GET_ORDER);

  const getOrder = async (id: string) => {
    try {
      const response = await selectOrder({variables: {id}});
      return response;
    } catch (err) {
      console.error(err);
    }
  };

  const [newOrder, createOrderInfo] = useMutation<
    CheckoutResponse,
    CheckoutArgs
  >(CHECKOUT);

  const createOrder = async (input: CheckoutInput) => {
    try {
      return await newOrder({
        variables: {
          input,
        },
      });
    } catch (err) {
      console.error(err);
      return error;
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
    getOrder,
    orderInfo,
  };
};
