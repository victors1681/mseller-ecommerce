import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
const Stack = createStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ScreenLinks.SETTINGS} component={SettingScreen} />
      <Stack.Screen name={ScreenLinks.PROFILE} component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
