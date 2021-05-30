import {GET_ORDERS, CREATE_ORDER, GET_ORDER} from 'app/graphql';
import {
  RootQueryToOrderConnection,
  CreateOrderInput,
  Order,
  CreateOrderPayload,
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

interface OrdersResponseData {
  orders: RootQueryToOrderConnection;
}

interface OrderResponseData {
  order: Order;
}
interface CreateOrderResponse {
  createOrder: CreateOrderPayload;
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
  ] = useLazyQuery<OrdersResponseData>(GET_ORDERS);

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
    getOrder,
    orderInfo,
  };
};
