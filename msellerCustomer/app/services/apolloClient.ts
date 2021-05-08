import {ApolloClient, InMemoryCache} from '@apollo/client';

// Initialize Apollo Client
export const client = new ApolloClient({
  uri: 'http://localhost:8088/graphql',
  cache: new InMemoryCache(),
});
