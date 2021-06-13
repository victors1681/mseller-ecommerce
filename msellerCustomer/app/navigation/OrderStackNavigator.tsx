import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import OrdersScreen from '../screens/OrdersScreen';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
const Stack = createStackNavigator();

const OrderStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ScreenLinks.ORDERS} component={OrdersScreen} />
    </Stack.Navigator>
  );
};

export default OrderStackNavigator;
