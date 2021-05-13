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
  useQuery,
  ApolloError,
  OperationVariables,
  ApolloQueryResult,
  MutationResult,
} from '@apollo/client';
import React from 'react';
import {saveToken, updateToken, getToken} from 'app/utils';

interface Data {
  Customer?: Customer;
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
  customer: Customer | undefined;
  isLoading: boolean;
  data: Data | undefined;
  error: ApolloError | undefined;
  refetch: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloQueryResult<Data>>;
  login: (input: LoginInput) => Promise<void>;
  loginInfo: MutationResult<LoginData>;
  updateToken: () => Promise<void>;
  registerCustomer: (input: RegisterCustomerInput) => Promise<void>;
  registerCustomerInfo: MutationResult<RegisterCustomerData>;
  updateCustomer: (input: UpdateCustomerInput) => Promise<void>;
  updateCustomerInfo: MutationResult<UpdateCustomerData>;
}

/**
 * Hold all data and methods for the Customer
 * @returns
 */

export const useCustomerStore = (): CustomerStore => {
  const [customer, setCustomer] = React.useState<Customer | undefined>(
    {} as Customer,
  );

  const {loading: isLoading, data, error, refetch} = useQuery<Data>(
    GET_CUSTOMER_INFO,
  );

  React.useEffect(() => {
    if (!isLoading) {
      setCustomer(data?.Customer);
    }
  }, [isLoading, data]);

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

  const performLogin = async (input: LoginInput): Promise<void> => {
    try {
      const response = await login({
        variables: {
          input,
        },
      });

      //save authorization token
      const authToken = response.data?.login?.authToken;
      const refreshToken = response.data?.login?.refreshToken;
      const sessionToken = response.data?.login?.sessionToken;

      if (authToken && refreshToken && sessionToken) {
        saveToken({authToken, refreshToken, sessionToken});
      }
    } catch (err) {
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
  ): Promise<void> => {
    try {
      const response = await registerCustomer({
        variables: {
          input,
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
    } catch (err) {
      console.log('error', err);
    }
  };

  const performUpdate = async (input: UpdateCustomerInput): Promise<void> => {
    const response = await updateCustomer({
      variables: {
        input,
      },
    });

    setCustomer(response.data?.updateCustomer?.customer as Customer);
  };

  return {
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
  };
};
