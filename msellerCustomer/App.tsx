import React from 'react';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import AppNavigator from './app/navigation/Navigation';

import {AppRegistry} from 'react-native';
import {ApolloProvider} from '@apollo/client';

import {client} from './app/services/apolloClient';

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <AppNavigator />
    </ApplicationProvider>
  </ApolloProvider>
);
AppRegistry.registerComponent('MyApplication', () => App);

export default App;
