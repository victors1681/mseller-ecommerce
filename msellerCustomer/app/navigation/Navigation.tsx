import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {NavigationDrawer} from './Drawer';
import {navigationRef, isReadyRef} from './RootNavigation';
import {CartProvider} from 'app/modules/cart/context';
import {ProductProvider} from 'app/modules/product/context';
import {CustomerProvider} from 'app/modules/customer/context';
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
      <CustomerProvider>
        <ProductProvider>
          <CartProvider>
            <NavigationDrawer />
          </CartProvider>
        </ProductProvider>
      </CustomerProvider>
    </NavigationContainer>
  );
};
export default AppNavigator;
