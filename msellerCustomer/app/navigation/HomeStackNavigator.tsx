import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../screens/HomeScreen';
import Products from '../screens/ProductsScreen';
import ProductDetail from '../screens/ProductDetailScreen';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useCart} from 'app/hooks';
import {IconWithBadge} from 'app/modules/common/IconWithBadge';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';
import AddressScreen from '../screens/AddressScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = ({navigation}: any) => {
  const {cart} = useCart();
  const productCount = cart?.contents?.productCount;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle,
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.toggleDrawer()}>
              <IconWithBadge number={productCount as number} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
    </Stack.Navigator>
  );
};

const headerTitle = () => {
  return (
    <Image
      style={styles.image}
      source={require('app/assets/images/logo-mseller-dark.png')}
      resizeMode="contain"
    />
  );
};
const styles = StyleSheet.create({
  image: {width: 200, height: 30},
});

export default HomeStackNavigator;
