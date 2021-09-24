import {
  LOGIN,
  REGISTER_CUSTOMER,
  UPDATE_CUSTOMER,
  GET_CUSTOMER_INFO,
  REFRESH_TOKEN,
  LOGOUT,
} from 'app/graphql';
import {
  Customer,
  LoginInput,
  LoginPayload,
  LogoutInput,
  LogoutPayload,
  Maybe,
  RefreshJwtAuthTokenInput,
  RefreshJwtAuthTokenPayload,
  RegisterCustomerInput,
  RegisterCustomerPayload,
  Scalars,
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
import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';
interface Data {
  customer?: Customer;
}

interface UpdateQuantitiesResponse {
  updateItemQuantities: UpdateItemQuantitiesPayload;
}

interface LoginInputArg {
  input: LoginInput;
}

interface LogoutInputArg {
  input: LogoutInput;
}

interface LoginData {
  login: LoginPayload;
}
interface LogoutData {
  logout: LogoutPayload;
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
  updateCustomer: (
    input: UpdateCustomerInput,
  ) => Promise<
    | FetchResult<UpdateCustomerData, Record<string, any>, Record<string, any>>
    | undefined
  >;
  updateCustomerInfo: MutationResult<UpdateCustomerData>;
  performLogout: (
    input: LogoutInput,
  ) => Promise<
    | FetchResult<LogoutData, Record<string, any>, Record<string, any>>
    | undefined
  >;
  logoutInfo: MutationResult<LogoutData>;
  creditCardSelected: Maybe<Scalars['String']> | undefined;
  setCreditCardSelection: React.Dispatch<
    React.SetStateAction<Maybe<Scalars['String']> | undefined>
  >;
}

/**
 * Hold all data and methods for the Customer
 * @returns
 */

export const useCustomerStore = (): CustomerStore => {
  const [customer, setCustomer] = React.useState<Customer | undefined>(
    {} as Customer,
  );
  const [creditCardSelected, setCreditCardSelection] = React.useState<
    Maybe<Scalars['String']> | undefined
  >();
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
      setCustomerStatus(!!data?.customer?.databaseId);
    }
  }, [isLoading, networkStatus]);

  const [login, loginInfo] = useMutation<LoginData, LoginInputArg>(LOGIN);
  const [logout, logoutInfo] = useMutation<LogoutData, LogoutInputArg>(LOGOUT);

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
      crashlytics().recordError(error);
      Toast.show({
        type: 'error',
        text1: error?.message,
      });
      console.log('error', err);
    }
  };

  const performLogout = async (
    input: LogoutInput,
  ): Promise<
    | FetchResult<LogoutData, Record<string, any>, Record<string, any>>
    | undefined
  > => {
    try {
      const response = await logout({
        variables: {
          input,
        },
      });

      resetToken();
      return response;
    } catch (err) {
      const error = err as Error;
      crashlytics().recordError(error);
      Toast.show({
        type: 'error',
        text1: error?.message,
      });
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
      console.log('Update Token', response);
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
      const authToken = response.data?.registerCustomer?.customer?.jwtAuthToken;
      const refreshToken =
        response.data?.registerCustomer?.customer?.jwtRefreshToken;
      const sessionToken =
        response.data?.registerCustomer?.customer?.sessionToken;

      if (authToken && refreshToken && sessionToken) {
        saveToken({authToken, refreshToken, sessionToken});
      }
      return response;
    } catch (err) {
      const error = err as Error;
      crashlytics().recordError(error);
      Toast.show({
        type: 'error',
        text1: error?.message,
      });
      console.log('error', err);
      //Send event if the account is not successfully created with the email address
    }
  };

  const performUpdate = async (
    input: UpdateCustomerInput,
  ): Promise<
    | FetchResult<UpdateCustomerData, Record<string, any>, Record<string, any>>
    | undefined
  > => {
    try {
      const response = await updateCustomer({
        variables: {
          input: {id: customer && customer.id, ...input},
        },
      });

      setCustomer(response.data?.updateCustomer?.customer as Customer);
      return response;
    } catch (err) {
      const error = err as Error;
      crashlytics().recordError(error);
      console.error(err);
    }
  };

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
    logoutInfo,
    creditCardSelected,
    setCreditCardSelection,
  };
};
