import {
  LOGIN,
  REGISTER_CUSTOMER,
  UPDATE_CUSTOMER,
  GET_CUSTOMER_INFO,
  REFRESH_TOKEN,
} from 'app/graphql';
import {
  Customer,
  LoginInput,
  LoginPayload,
  RefreshJwtAuthTokenInput,
  RefreshJwtAuthTokenPayload,
  RegisterCustomerInput,
  RegisterCustomerPayload,
  UpdateCustomerInput,
  UpdateCustomerPayload,
  UpdateItemQuantitiesPayload,
} from 'app/generated/graphql'; // Import
import {
  useMutation,
  useLazyQuery,
  ApolloError,
  OperationVariables,
  ApolloQueryResult,
  MutationResult,
  QueryLazyOptions,
  FetchResult,
} from '@apollo/client';
import React from 'react';
import {saveToken, updateToken, getToken, resetToken} from 'app/utils';
import {Alert} from 'react-native';

interface Data {
  customer?: Customer;
}

interface UpdateQuantitiesResponse {
  updateItemQuantities: UpdateItemQuantitiesPayload;
}

interface LoginInputArg {
  input: LoginInput;
}
interface LoginData {
  login: LoginPayload;
}

interface RegisterCustomerArg {
  input: RegisterCustomerInput;
}
interface RegisterCustomerData {
  registerCustomer: RegisterCustomerPayload;
}

interface UpdateCustomerArg {
  input: UpdateCustomerInput;
}
interface UpdateCustomerData {
  updateCustomer: UpdateCustomerPayload;
}

interface RefreshTokenArg {
  input: RefreshJwtAuthTokenInput;
}
interface RefreshTokenData {
  refreshJwtAuthToken: RefreshJwtAuthTokenPayload;
}

export interface CustomerStore {
  isCustomerLogged: boolean;
  fetchCustomer: (
    options?: QueryLazyOptions<OperationVariables> | undefined,
  ) => void;
  customer: Customer | undefined;
  isLoading: boolean;
  data: Data | undefined;
  error: ApolloError | undefined;
  refetch:
    | ((
        variables?: Partial<OperationVariables> | undefined,
      ) => Promise<ApolloQueryResult<Data>>)
    | undefined;
  login: (
    input: LoginInput,
  ) => Promise<
    FetchResult<LoginData, Record<string, any>, Record<string, any>> | undefined
  >;
  loginInfo: MutationResult<LoginData>;
  updateToken: () => Promise<void>;
  registerCustomer: (
    input: RegisterCustomerInput,
  ) => Promise<
    | FetchResult<
        RegisterCustomerData,
        Record<string, any>,
        Record<string, any>
      >
    | undefined
  >;
  registerCustomerInfo: MutationResult<RegisterCustomerData>;
  updateCustomer: (input: UpdateCustomerInput) => Promise<void>;
  updateCustomerInfo: MutationResult<UpdateCustomerData>;
  performLogout: () => Promise<void>;
}

/**
 * Hold all data and methods for the Customer
 * @returns
 */

export const useCustomerStore = (): CustomerStore => {
  const [customer, setCustomer] = React.useState<Customer | undefined>(
    {} as Customer,
  );
  const [isCustomerLogged, setCustomerStatus] = React.useState(false);

  const [
    fetchCustomer,
    {loading: isLoading, data, error, refetch, networkStatus},
  ] = useLazyQuery<Data>(GET_CUSTOMER_INFO, {
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!isLoading) {
      setCustomer(data?.customer);
      console.log('Customer', data?.customer);
      setCustomerStatus(!!data?.customer?.databaseId);
    }
  }, [isLoading, networkStatus]);

  const [login, loginInfo] = useMutation<LoginData, LoginInputArg>(LOGIN);
  const [refreshToken] = useMutation<RefreshTokenData, RefreshTokenArg>(
    REFRESH_TOKEN,
  );
  const [registerCustomer, registerCustomerInfo] = useMutation<
    RegisterCustomerData,
    RegisterCustomerArg
  >(REGISTER_CUSTOMER);
  const [updateCustomer, updateCustomerInfo] = useMutation<
    UpdateCustomerData,
    UpdateCustomerArg
  >(UPDATE_CUSTOMER);

  /**
   * Perform Login Mutation
   */

  const performLogin = async (
    input: LoginInput,
  ): Promise<
    FetchResult<LoginData, Record<string, any>, Record<string, any>> | undefined
  > => {
    try {
      const response = await login({
        variables: {
          input,
        },
        context: {
          Headers: {
            Authorization: '',
          },
        },
      });

      //save authorization token
      const authToken = response.data?.login?.authToken;
      const refreshToken = response.data?.login?.refreshToken;
      const sessionToken = response.data?.login?.sessionToken;

      if (authToken && refreshToken && sessionToken) {
        saveToken({authToken, refreshToken, sessionToken});
      }
      return response;
    } catch (err) {
      const error = err as Error;
      Alert.alert(error.message);
      console.log('error', err);
    }
  };

  /**
   * update user token
   */

  const performUpdateToken = async (): Promise<void> => {
    const tokenValues = await getToken();
    if (tokenValues?.refreshToken) {
      const response = await refreshToken({
        variables: {
          input: {
            jwtRefreshToken: tokenValues.refreshToken,
          },
        },
      });
      if (response.data?.refreshJwtAuthToken?.authToken) {
        updateToken(response.data?.refreshJwtAuthToken.authToken);
      }
    }
  };

  const performRegistration = async (
    input: RegisterCustomerInput,
  ): Promise<
    | FetchResult<
        RegisterCustomerData,
        Record<string, any>,
        Record<string, any>
      >
    | undefined
  > => {
    try {
      const response = await registerCustomer({
        variables: {
          input,
        },
        context: {
          Headers: {
            Authorization: '',
          },
        },
      });

      //save authorization token
      const authToken = response.data?.registerCustomer?.authToken;
      const refreshToken = response.data?.registerCustomer?.refreshToken;
      const sessionToken =
        response.data?.registerCustomer?.customer?.sessionToken;

      if (authToken && refreshToken && sessionToken) {
        saveToken({authToken, refreshToken, sessionToken});
      }
      return response;
    } catch (err) {
      const error = err as Error;
      Alert.alert(error.message);
      console.log('error', err);
      //Send event if the account is not successfully created with the email address
    }
  };

  const performUpdate = async (input: UpdateCustomerInput): Promise<void> => {
    try {
      const response = await updateCustomer({
        variables: {
          input,
        },
      });

      setCustomer(response.data?.updateCustomer?.customer as Customer);
    } catch (err) {
      console.error(err);
    }
  };

  const performLogout = () => resetToken();

  return {
    isCustomerLogged,
    fetchCustomer,
    customer,
    isLoading,
    data,
    error,
    refetch,
    login: performLogin,
    loginInfo,
    updateToken: performUpdateToken,
    registerCustomer: performRegistration,
    registerCustomerInfo,
    updateCustomer: performUpdate,
    updateCustomerInfo,
    performLogout,
  };
};
