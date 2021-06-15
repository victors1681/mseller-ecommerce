import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import AddressScreen from 'app/screens/AddressScreen';
const Stack = createStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ScreenLinks.SETTINGS} component={SettingScreen} />
      <Stack.Screen name={ScreenLinks.PROFILE} component={ProfileScreen} />
      <Stack.Screen
        name={ScreenLinks.ADDRESS}
        options={{
          headerTitle: 'Dirección de envío',
        }}
        component={AddressScreen}
      />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
