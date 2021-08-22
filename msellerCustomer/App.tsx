import React from 'react';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import AppNavigator from './app/navigation/Navigation';

import {AppRegistry} from 'react-native';
import {ApolloProvider} from '@apollo/client';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {client} from './app/services/apolloClient';
import 'moment/locale/es';
import mapping from './custom-mapping.json';

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
      <AppNavigator />
    </ApplicationProvider>
  </ApolloProvider>
);
AppRegistry.registerComponent('MyApplication', () =>
  gestureHandlerRootHOC(App),
);

export default App;
