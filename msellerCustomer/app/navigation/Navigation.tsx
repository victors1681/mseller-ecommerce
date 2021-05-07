import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {NavigationDrawer} from './Drawer';

export const AppNavigator = () => (
  <NavigationContainer>
    <NavigationDrawer />
  </NavigationContainer>
);

export default AppNavigator;
