import React from 'react';
import {StyleSheet} from 'react-native';
import {BottomNavigation, BottomNavigationTab} from '@ui-kitten/components';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackNavigator from '../navigation/HomeStackNavigator';
import OrderStackNavigator from '../navigation/OrderStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';
import {StoreIcon, ProfileIcon, OrderIcon} from 'app/modules/common/Icons';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
const {Navigator, Screen} = createBottomTabNavigator();

export const BottomNavigationAccessoriesShowcase = ({
  navigation,
  state,
}: any) => {
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
    <Screen name={ScreenLinks.HOME} component={HomeStackNavigator} />
    <Screen name={ScreenLinks.ORDERS} component={OrderStackNavigator} />
    <Screen name={ScreenLinks.SETTINGS} component={SettingsStackNavigator} />
  </Navigator>
);

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});
export default TabNavigator;
