import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
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
    </Stack.Navigator>
  );
};

export default SignUpStackNavigator;
