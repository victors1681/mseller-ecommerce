import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ProfileScreen from '../screens/ProfileScreen';
import {StyleSheet} from 'react-native';
const Stack = createStackNavigator();

const ProfileStackNavigator = ({navigation}: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Perfil" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  image: {width: 200, height: 30},
});

export default ProfileStackNavigator;
