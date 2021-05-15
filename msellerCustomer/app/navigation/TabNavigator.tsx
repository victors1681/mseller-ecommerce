import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Text,
} from '@ui-kitten/components';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackNavigator from '../navigation/HomeStackNavigator';
import OrderStackNavigator from '../navigation/OrderStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';
import {StoreIcon, ProfileIcon, OrderIcon} from 'app/modules/common/Icons';

const {Navigator, Screen} = createBottomTabNavigator();

const OrdersScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text category="h1">ORDERS</Text>
  </View>
);

export const BottomNavigationAccessoriesShowcase = ({navigation, state}) => {
  return (
    <BottomNavigation
      style={styles.bottomNavigation}
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title="Productos" icon={StoreIcon} />
      <BottomNavigationTab title="Ordenes" icon={OrderIcon} />
      <BottomNavigationTab title="Perfil" icon={ProfileIcon} />
    </BottomNavigation>
  );
};

const TabNavigator = () => (
  <Navigator
    tabBar={props => <BottomNavigationAccessoriesShowcase {...props} />}>
    <Screen name="Home" component={HomeStackNavigator} />
    <Screen name="Orders" component={OrderStackNavigator} />
    <Screen name="Settings" component={SettingsStackNavigator} />
  </Navigator>
);

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});
export default TabNavigator;
