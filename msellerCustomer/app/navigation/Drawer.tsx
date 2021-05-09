import * as React from 'react';
import {View, Text} from 'react-native';
import {CartList} from '../components/cart/CartList';
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';

import TabNavigator from './TabNavigator';
import {Layout} from '@ui-kitten/components';

function Notifications() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

const HeaderOnList = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
  return (
    <View {...props}>
      <DrawerItemList {...props} />

      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.toggleDrawer()}
      />
    </View>
  );
};
function CustomDrawerContent(
  props: DrawerContentComponentProps<DrawerContentOptions>,
) {
  return (
    <Layout>
      <CartList listHeader={React.createElement(HeaderOnList, props)} />
    </Layout>
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
