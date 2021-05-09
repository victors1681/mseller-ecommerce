import * as React from 'react';
import {View, Text, Button} from 'react-native';
import {CartList} from '../components/cart/CartList';
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
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

const HeaderOnList = props => {
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
function CustomDrawerContent(props) {
  return (
    <Layout>
      <CartList
        navigation={props.navigation}
        listHeader={React.createElement(HeaderOnList, props)}
      />
    </Layout>
  );
}

const Drawer = createDrawerNavigator();

export const NavigationDrawer = () => {
  return (
    <Drawer.Navigator
      drawerPosition="right"
      // drawerType="back"
      // openByDefault={true}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Feed" component={TabNavigator} />
      <Drawer.Screen name="Notifications" component={Notifications} />
    </Drawer.Navigator>
  );
};
