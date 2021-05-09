import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {NavigationDrawer} from './Drawer';
import {navigationRef, isReadyRef} from './RootNavigation';
import {CartProvider} from 'app/components/cart/context';
export const AppNavigator = () => {
  React.useEffect(() => {
    return () => {
      (isReadyRef as React.MutableRefObject<boolean>).current = false;
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        (isReadyRef as React.MutableRefObject<boolean>).current = true;
      }}>
      <CartProvider>
        <NavigationDrawer />
      </CartProvider>
    </NavigationContainer>
  );
};
export default AppNavigator;
