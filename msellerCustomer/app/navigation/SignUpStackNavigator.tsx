import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

const SignUpStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="signUpStack"
        component={SignUpScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="signIn"
        component={SignInScreen}
      />
    </Stack.Navigator>
  );
};

export default SignUpStackNavigator;
