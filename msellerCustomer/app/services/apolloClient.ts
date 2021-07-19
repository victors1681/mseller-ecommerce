import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {fromPromise} from '@apollo/client/link/utils/fromPromise';
import {setContext} from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken, TokenResponse, resetToken, updateToken} from 'app/utils';
import isEmpty from 'lodash/isEmpty';
import Config from 'react-native-config';

const SERVER_URL = __DEV__ ? Config.DEV_GRAPHQL_URL : Config.PROD_GRAPHQL_URL;

const sessionStorage = setContext(async () => {
  try {
    //get session
    const wooSession = await AsyncStorage.getItem('woo-session');
    const tokenData = await getToken();

    const setSession = async (value: string) => {
      await AsyncStorage.setItem('woo-session', value);
    };
    return {wooSession, setSession, tokenData};
  } catch (e) {
    console.error('session', e);
  }
});

/**
 * Middleware operation
 * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink((operation, forward) => {
  /**
   * If session data exist in local storage, set value as session header.
   */
  const {wooSession, tokenData} = operation.getContext();

  if (!isEmpty(tokenData)) {
    const info = tokenData as TokenResponse;
    operation.setContext(() => ({
      headers: {
        'woocommerce-session': `Session ${wooSession}`,
        Authorization: info.authToken ? `Bearer ${info.authToken}` : '',
      },
    }));
  } else if (wooSession) {
    operation.setContext(() => ({
      headers: {
        'woocommerce-session': `Session ${wooSession}`,
      },
    }));
  }

  return forward(operation);
});

/**
 * Afterware operation
 * This catches the incoming session token and stores it in localStorage, for future GraphQL requests.
 */
export const afterware = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    /**
     * Check for session header and update session in local storage accordingly.
     */
    const context = operation.getContext();
    const {
      response: {headers},
      wooSession,
      setSession,
    } = context;
    const session = headers.get('woocommerce-session');

    if (session) {
      if (wooSession !== session) {
        setSession(session); //sync woocommerce-session & woo-session to have same value
      }
    }

    return response;
  });
});
//Android is not working with localhost, use ip instead
const httpLink = new HttpLink({
  uri: SERVER_URL,
});

let isRefreshing = false;
let pendingRequests: any = [];

const resolvePendingRequests = () => {
  pendingRequests.map((callback: any) => callback());
  pendingRequests = [];
};

/**
 * Use a regular fetch to refresh the token due client mutation issue.
 * @param operation
 * @param forward
 * @returns
 */
const getTokenTest = async (operation: any, forward: any) => {
  try {
    const {tokenData, headers: oldHeaders} = operation.getContext();
    const tokenInfo = tokenData as TokenResponse;

    if (!tokenInfo) {
      await resolvePendingRequests();
      return forward(operation);
    }

    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `mutation RefreshToken {
      refreshJwtAuthToken(input: {
       jwtRefreshToken: "${tokenInfo.refreshToken}"
      }) {
        authToken
      }
    }`,
      }),
    });

    const jsonResponse = await response.json();
    if (jsonResponse && jsonResponse.data.refreshJwtAuthToken) {
      const {
        data: {
          refreshJwtAuthToken: {authToken},
        },
      } = jsonResponse;
      await updateToken(authToken);
      operation.setContext({
        headers: {
          ...oldHeaders,
          authorization: `Bearer ${authToken}`,
        },
      });
    } else {
      //Invalid Refresh Token:
      await resetToken();
    }
    await resolvePendingRequests();

    return forward(operation);
  } catch (err) {
    console.error('Error Refreshing token user not authenticated', err);
    pendingRequests = [];
    return false;
  }
};

const errorLink = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions!.category) {
          case 'auth':
            let _forward;
            const {tokenData} = operation.getContext();

            if (!isRefreshing && tokenData) {
              isRefreshing = true;

              _forward = fromPromise(getTokenTest(operation, forward));
            } else {
              console.log('Next Promise');
              _forward = fromPromise(
                new Promise(resolve => {
                  pendingRequests.push(() => resolve());
                }),
              );

              //Allow to keep performing task if the token doesn't exist
              // updating the cart on anonymous mode
              _forward = fromPromise(getTokenTest(operation, forward));
            }
            _forward.flatMap(() => {
              return forward(operation);
            });

            return _forward;
          default:
            console.log(
              `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`,
            );
        }
      }
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  },
);
// Initialize Apollo Client
export const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    sessionStorage,
    middleware.concat(afterware.concat(httpLink)),
  ]),
  cache: new InMemoryCache(),
});
