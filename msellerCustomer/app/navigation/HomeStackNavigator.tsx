import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../screens/HomeScreen';
import Products from '../screens/ProductsScreen';
import {Icon, useTheme} from '@ui-kitten/components';
import {TouchableOpacity, View, StyleSheet, Image} from 'react-native';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

const HomeStackNavigator = ({navigation}) => {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: () => {
            return (
              <Image
                style={{width: 200, height: 30}}
                source={require('app/assets/images/logo-mseller-dark.png')}
                resizeMode="contain"
              />
            );
          },
          //title: 'Productos',
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.toggleDrawer()}>
              <View style={{paddingLeft: 20, paddingRight: 20}}>
                <Icon
                  fill={theme['color-primary-default']}
                  name="shopping-cart-outline"
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Products" component={Products} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
