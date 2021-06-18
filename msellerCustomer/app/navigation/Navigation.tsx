import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {NavigationDrawer} from './Drawer';
import {navigationRef, isReadyRef} from './RootNavigation';
import {CartProvider} from 'app/modules/cart/context';
import {ProductProvider} from 'app/modules/product/context';
import {CustomerProvider} from 'app/modules/customer/context';
import SignUpStackNavigator from 'app/navigation/SignUpStackNavigator';
import {createStackNavigator} from '@react-navigation/stack';
import {ScreenLinks} from 'app/navigation/ScreenLinks';

const RootStack = createStackNavigator();
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
            <RootStack.Navigator mode="modal" headerMode="none">
              <RootStack.Screen name="Main" component={NavigationDrawer} />
              <RootStack.Screen
                options={{headerShown: false}}
                name={ScreenLinks.SIGN_UP}
                component={SignUpStackNavigator}
              />
            </RootStack.Navigator>
          </CartProvider>
        </ProductProvider>
      </CustomerProvider>
    </NavigationContainer>
  );
};
export default AppNavigator;
