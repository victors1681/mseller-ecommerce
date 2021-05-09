import * as React from 'react';
import {View, Text} from 'react-native';
import {CartDrawerLayout} from '../modules/cart';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';

import TabNavigator from './TabNavigator';

import {SafeAreaView} from 'react-native-safe-area-context';

function Notifications() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

function CustomDrawerContent(
  props: DrawerContentComponentProps<DrawerContentOptions>,
) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <CartDrawerLayout navigation={props.navigation} />
    </SafeAreaView>
  );
}

const Drawer = createDrawerNavigator();

export const NavigationDrawer = () => {
  return (
    <Drawer.Navigator
      drawerPosition="right"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Feed" component={TabNavigator} />
      <Drawer.Screen name="Notifications" component={Notifications} />
    </Drawer.Navigator>
  );
};
