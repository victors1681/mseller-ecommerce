import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import {StyleSheet} from 'react-native';
const Stack = createStackNavigator();

const SettingsStackNavigator = ({navigation}: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="settings" component={SettingScreen} />
      <Stack.Screen name="profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  image: {width: 200, height: 30},
});

export default SettingsStackNavigator;
