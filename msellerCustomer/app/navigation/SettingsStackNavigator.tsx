import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import AddressScreen from 'app/screens/AddressScreen';
import PaymentMethodScreen from 'app/screens/PaymentMethodScreen';
import {BackButtonAction} from 'app/modules/common';

const Stack = createStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenLinks.SETTINGS}
        component={SettingScreen}
        options={{
          headerTitle: 'Configuración',
        }}
      />
      <Stack.Screen
        name={ScreenLinks.PROFILE}
        component={ProfileScreen}
        options={{
          headerTitle: 'Perfíl',
          headerLeft: BackButtonAction,
        }}
      />
      <Stack.Screen
        name={ScreenLinks.PAYMENTS}
        component={PaymentMethodScreen}
        options={{
          headerTitle: 'Métodos de Pagos',
          headerLeft: BackButtonAction,
        }}
      />
      <Stack.Screen
        name={ScreenLinks.ADDRESS}
        options={{
          headerTitle: 'Dirección de envío',
          headerLeft: BackButtonAction,
        }}
        component={AddressScreen}
      />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
