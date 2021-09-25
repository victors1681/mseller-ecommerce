import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RecoveryPasswordScreen from '../screens/RecoveryPasswordScreen';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
const Stack = createStackNavigator();

const SignUpStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false, headerTitle: 'Iniciar sesión'}}
        name={ScreenLinks.SIGN_UP_STACK}
        component={SignUpScreen}
      />
      <Stack.Screen
        options={{headerShown: false, headerTitle: 'Iniciar sesión'}}
        name={ScreenLinks.SIGN_IN}
        component={SignInScreen}
      />
      <Stack.Screen
        options={{headerShown: false, headerTitle: 'Recovery Password'}}
        name={ScreenLinks.RECOVERY_PASSWORD}
        component={RecoveryPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default SignUpStackNavigator;
