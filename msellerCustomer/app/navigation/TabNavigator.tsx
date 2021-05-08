import React from 'react';
import {StyleSheet} from 'react-native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  Layout,
  Text,
} from '@ui-kitten/components';
import {View, Button} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackNavigator from '../navigation/HomeStackNavigator';
const PersonIcon = props => <Icon {...props} name="cube-outline" />;

const BellIcon = props => <Icon {...props} name="file-text-outline" />;

const EmailIcon = props => <Icon {...props} name="person-outline" />;

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
      <BottomNavigationTab title="Productos" icon={PersonIcon} />
      <BottomNavigationTab title="Ordenes" icon={BellIcon} />
      <BottomNavigationTab title="Perfil" icon={EmailIcon} />
    </BottomNavigation>
  );
};

const TabNavigator = () => (
  <Navigator
    tabBar={props => <BottomNavigationAccessoriesShowcase {...props} />}>
    <Screen name="Home" component={HomeStackNavigator} />
    <Screen name="Orders" component={OrdersScreen} />
    <Screen name="Acc" component={OrdersScreen} />
  </Navigator>
);

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});
export default TabNavigator;
