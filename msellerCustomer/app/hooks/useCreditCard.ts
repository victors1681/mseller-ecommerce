import {GET_CARDNET_CUSTOMER, CREATE_ORDER, GET_ORDER} from 'app/graphql';
import {
  CardNetCustomer,
  RootQueryCardnetCustomerArgs,
  CreateOrderInput,
  Order,
  CreateOrderPayload,
} from 'app/generated/graphql';
import {
  ApolloError,
  FetchResult,
  MutationResult,
  QueryLazyOptions,
  useLazyQuery,
  useMutation,
} from '@apollo/client';

export interface CardNetCustomerData {
  cardnetCustomer: CardNetCustomer;
}

interface OrderResponseData {
  order: Order;
}
export interface CreateOrderResponse {
  createOrder: CreateOrderPayload;
}

interface CreateOrderArgs {
  input: CreateOrderInput;
}

export interface OrdersStore {
  getCardNetCustomer: (
    options?: QueryLazyOptions<RootQueryCardnetCustomerArgs> | undefined,
  ) => void;
  cardNetCustomerInfo: {
    data: CardNetCustomerData | undefined;
    isLoading: boolean;
    error: ApolloError | undefined;
  };
  called: boolean;

  createOrder: (
    input: CreateOrderInput,
  ) => Promise<
    | FetchResult<CreateOrderResponse, Record<string, any>, Record<string, any>>
    | ApolloError
    | undefined
  >;
  createOrderInfo: MutationResult<CreateOrderResponse>;
}

/**
 * Hold all data and methods for the cart
 * @returns
 */

export const useCreditCard = (): OrdersStore => {
  /**
   * Orders
   */
  const [getCardNetCustomer, {called, loading, data, error}] = useLazyQuery<
    CardNetCustomerData,
    RootQueryCardnetCustomerArgs
  >(GET_CARDNET_CUSTOMER, {
    fetchPolicy: 'network-only',
  });

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
      console.error(err);
      return error;
    }
  };

  return {
    called,
    getCardNetCustomer,
    cardNetCustomerInfo: {
      isLoading: loading,
      data,
      error,
    },
    createOrder,
    createOrderInfo,
  };
};
