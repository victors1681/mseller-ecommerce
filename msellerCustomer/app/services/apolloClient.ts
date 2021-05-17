import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import {REFRESH_TOKEN} from 'app/graphql/customer';
import {onError} from '@apollo/client/link/error';
import {fromPromise} from '@apollo/client/link/utils/fromPromise';
import {setContext} from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken, TokenResponse, saveToken} from 'app/utils';

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

  if (tokenData) {
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
  uri: 'http://192.168.1.210:8088/graphql',
});

let isRefreshing = false;
let pendingRequests: any = [];

const resolvePendingRequests = () => {
  pendingRequests.map((callback: any) => callback());
  pendingRequests = [];
};

const errorLink = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions!.category) {
          case 'user':
            let _forward;
            const {tokenData} = operation.getContext();
            const tokenInfo = tokenData as TokenResponse;
            if (!isRefreshing && tokenData) {
              isRefreshing = true;

              _forward = fromPromise(
                client
                  .mutate({
                    mutation: REFRESH_TOKEN,
                    variables: {
                      input: {jwtRefreshToken: tokenInfo.refreshToken},
                    },
                    context: {
                      headers: {},
                    },
                  })
                  .then(({data: {refreshToken}}) => {
                    console.error('TOKEN UPDATED YEAHHHH', refreshToken);
                    saveToken(refreshToken);
                    return true;
                  })
                  .then(() => {
                    console.log('resolving next promise');
                    resolvePendingRequests();
                    return true;
                  })
                  .catch(err => {
                    console.error('error refreshing token', err);
                    pendingRequests = [];
                    return false;
                  })
                  .finally(() => {
                    console.log('Completing refreshing without been resolved');
                    isRefreshing = false;
                  }),
              );
            } else {
              console.log('Next Promise');
              _forward = fromPromise(
                new Promise(resolve => {
                  pendingRequests.push(() => resolve());
                }),
              );
            }

            return _forward && _forward.flatMap(() => forward(operation));
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
