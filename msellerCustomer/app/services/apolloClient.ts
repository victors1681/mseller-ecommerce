import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sessionStorage = setContext(async () => {
  try {
    //get session
    const wooSession = await AsyncStorage.getItem('woo-session');
    const setSession = async (value: string) => {
      console.log('Setting the session ', value);
      await AsyncStorage.setItem('woo-session', value);
    };
    return {wooSession, setSession};
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
  const {wooSession} = operation.getContext();
  console.log('OPPPPPPP', wooSession);
  if (wooSession) {
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

const httpLink = new HttpLink({
  uri: 'http://localhost:8088/graphql',
});

// Initialize Apollo Client
export const client = new ApolloClient({
  link: ApolloLink.from([
    sessionStorage,
    middleware.concat(afterware.concat(httpLink)),
  ]),
  cache: new InMemoryCache(),
});
