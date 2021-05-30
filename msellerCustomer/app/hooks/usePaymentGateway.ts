import {GET_PAYMENT_GATEWAY} from 'app/graphql';
import {RootQueryToPaymentGatewayConnection} from 'app/generated/graphql';
import {
  ApolloError,
  OperationVariables,
  QueryLazyOptions,
  useLazyQuery,
} from '@apollo/client';

interface PaymentGatewaysResponseData {
  paymentGateways: RootQueryToPaymentGatewayConnection;
}

export interface PaymentGatewaysStore {
  getPaymentsGateways: (
    options?: QueryLazyOptions<OperationVariables> | undefined,
  ) => void;
  called: boolean;
  data: PaymentGatewaysResponseData | undefined;
  isLoading: boolean;
  error: ApolloError | undefined;
}

/**
 * Hold all data and methods for the cart
 * @returns
 */

export const usePaymentGateways = (): PaymentGatewaysStore => {
  /**
   * PaymentGateways
   */
  const [
    getPaymentsGateways,
    {called, loading, data, error},
  ] = useLazyQuery<PaymentGatewaysResponseData>(GET_PAYMENT_GATEWAY);

  return {
    called,
    getPaymentsGateways,
    isLoading: loading,
    data,
    error,
  };
};
