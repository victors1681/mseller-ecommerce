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
import FRMessaging from '../services/FRMessaging';
import CreditCardScreen from 'app/screens/CreditCardScreen';
import AboutUsScreen from 'app/screens/AboutUsScreen';
import Toast from 'react-native-toast-message';
const RootStack = createStackNavigator();

export const AppNavigator = () => {
  const messaging = React.useMemo(() => new FRMessaging(navigationRef), []);

  React.useEffect(() => {
    //Ask for user permission to allow push notifications
    messaging.requestUserPermission();

    const msg = messaging.subscribeMessage();
    return () => {
      msg;
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
                options={{headerShown: false, headerTitle: 'Registro'}}
                name={ScreenLinks.SIGN_UP}
                component={SignUpStackNavigator}
              />
              <RootStack.Screen
                options={{
                  headerTitle: 'Registro de Tarjeta',
                }}
                name={ScreenLinks.CREDIT_CARD}
                component={CreditCardScreen}
              />
              <RootStack.Screen
                options={{
                  headerTitle: 'About Us',
                }}
                name={ScreenLinks.ABOUT_US}
                component={AboutUsScreen}
              />
            </RootStack.Navigator>
          </CartProvider>
        </ProductProvider>
      </CustomerProvider>
      <Toast ref={ref => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};
export default AppNavigator;
