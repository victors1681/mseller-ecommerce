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
import PlaceOrderScreen from 'app/screens/PlaceOrderScreen';
import CongratsScreen from 'app/screens/CongratsScreen';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import {BackButtonAction} from 'app/modules/common';
const Stack = createStackNavigator();

const HomeStackNavigator = ({navigation}: any) => {
  const {cart} = useCart();
  const productCount = cart?.contents?.productCount;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenLinks.HOME}
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
      <Stack.Screen
        name={ScreenLinks.PRODUCTS}
        options={{
          headerTitle: 'Productos',
          headerLeft: BackButtonAction,
        }}
        component={Products}
      />
      <Stack.Screen
        name={ScreenLinks.PRODUCTS_DETAILS}
        options={{
          headerTitle: 'Detalle del Producto',
          headerLeft: BackButtonAction,
        }}
        component={ProductDetail}
      />
      <Stack.Screen
        name={ScreenLinks.SHOPPING_CART}
        options={{
          headerTitle: 'Carrito de Compras',
          headerLeft: BackButtonAction,
        }}
        component={ShoppingCartScreen}
      />
      <Stack.Screen
        name={ScreenLinks.ADDRESS}
        options={{
          headerTitle: 'Dirección de envío',
          headerLeft: BackButtonAction,
        }}
        component={AddressScreen}
      />

      <Stack.Screen
        name={ScreenLinks.PLACE_ORDER}
        component={PlaceOrderScreen}
        options={{
          headerTitle: 'Tu Orden',
        }}
      />
      <Stack.Screen
        name={ScreenLinks.CONGRATS}
        component={CongratsScreen}
        options={{
          headerLeft: () => null,
          headerTitle: 'Felicidades',
        }}
      />
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
