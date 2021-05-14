import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import OrdersScreen from '../screens/OrdersScreen';
import {StyleSheet} from 'react-native';

const Stack = createStackNavigator();

const OrderStackNavigator = ({navigation}: any) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Ordenes" component={OrdersScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  image: {width: 200, height: 30},
});

export default OrderStackNavigator;
