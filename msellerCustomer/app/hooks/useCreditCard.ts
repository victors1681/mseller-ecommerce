import React from 'react';
import {
  GET_CARDNET_CUSTOMER,
  DELETE_CREDIT_CARD,
  ACTIVATE_CREDIT_CARD,
} from 'app/graphql';
import {
  CardNetCustomer,
  RootQueryCardnetCustomerArgs,
  DeleteCardnetPaymentProfilePayload,
  DeleteCardnetPaymentProfileInput,
  ActivateCardnetPaymentPayload,
  ActivateCardnetPaymentInput,
} from 'app/generated/graphql';
import {
  ApolloError,
  FetchResult,
  MutationResult,
  QueryLazyOptions,
  useLazyQuery,
  useMutation,
} from '@apollo/client';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';

export interface CardNetCustomerData {
  cardnetCustomer: CardNetCustomer;
}

export interface DeleteCardnetPaymentProfileResponse {
  deleteCardnetPaymentProfile: DeleteCardnetPaymentProfilePayload;
}

export interface DeleteCardnetPaymentProfileArg {
  input: DeleteCardnetPaymentProfileInput;
}

export interface CardNetActivatePaymentData {
  activateCardnetPayment: ActivateCardnetPaymentPayload;
}

export interface CardNetActivatePaymentArg {
  input: ActivateCardnetPaymentInput;
}
export interface CreditCard {
  getCardNetCustomer: (
    options?: QueryLazyOptions<RootQueryCardnetCustomerArgs> | undefined,
  ) => void;
  cardNetCustomerInfo: {
    data: CardNetCustomer | undefined;
    isLoading: boolean;
    error: ApolloError | undefined;
  };
  called: boolean;
  removeCreditCard: (
    paymentProfileId: number,
  ) => Promise<
    | ApolloError
    | FetchResult<
        DeleteCardnetPaymentProfileResponse,
        Record<string, any>,
        Record<string, any>
      >
    | undefined
  >;
  removeCreditCardInfo: MutationResult<DeleteCardnetPaymentProfileResponse>;
  activateCreditCard: (input: ActivateCardnetPaymentInput) => Promise<any>;
  activationInfo: MutationResult<CardNetActivatePaymentData>;
}

/**
 * Hold all data and methods for the Carnet Credit Card
 * @returns
 */

export const useCreditCard = (): CreditCard => {
  /**
   * Credit Card Customer
   */
  const [customerData, setCustomerData] = React.useState<
    CardNetCustomer | undefined
  >();

  const [getCreditCardCustomer, {called, loading, data, error}] = useLazyQuery<
    CardNetCustomerData,
    RootQueryCardnetCustomerArgs
  >(GET_CARDNET_CUSTOMER, {
    fetchPolicy: 'network-only',
  });

  const getCardNetCustomer = async () => {
    try {
      await getCreditCardCustomer();
    } catch (err) {
      console.error(err);
      Alert.alert(JSON.stringify(err));
      return err;
    }
  };

  /**
   * Having Customer data in a dynamic state helps to update the state if new credit card gets added or removed.
   */
  React.useEffect(() => {
    if (data && data.cardnetCustomer) {
      setCustomerData(data.cardnetCustomer);
    }
  }, [data && data.cardnetCustomer]);

  const [removeCarnetCreditCard, removeCreditCardInfo] = useMutation<
    DeleteCardnetPaymentProfileResponse,
    DeleteCardnetPaymentProfileArg
  >(DELETE_CREDIT_CARD);

  const removeCreditCard = async (paymentProfileId: number) => {
    try {
      const response = await removeCarnetCreditCard({
        variables: {
          input: {
            paymentProfileId,
          },
        },
      });
      if (response.data?.deleteCardnetPaymentProfile) {
        //Updating customer state
        setCustomerData(
          response.data.deleteCardnetPaymentProfile.customer as CardNetCustomer,
        );
        Toast.show({
          type: 'success',
          text1: 'Tarjeta Eliminada!',
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: err?.message,
      });
      return err;
    }
  };

  const [enableCarnetCreditCard, activationInfo] = useMutation<
    CardNetActivatePaymentData,
    CardNetActivatePaymentArg
  >(ACTIVATE_CREDIT_CARD);

  const activateCreditCard = async (input: ActivateCardnetPaymentInput) => {
    try {
      const response = await enableCarnetCreditCard({
        variables: {
          input,
        },
      });
      if (response.data?.activateCardnetPayment) {
        //Updating customer state
        setCustomerData(
          response.data.activateCardnetPayment.customer as CardNetCustomer,
        );
        Toast.show({
          type: 'success',
          text1: 'Tarjeta activada!',
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: err?.message,
      });
      return err;
    }
  };

  return {
    called,
    getCardNetCustomer,
    cardNetCustomerInfo: {
      isLoading: loading,
      data: customerData,
      error,
    },
    removeCreditCard,
    removeCreditCardInfo,
    activateCreditCard,
    activationInfo,
  };
};
