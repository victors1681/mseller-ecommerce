import React from 'react';
import {StyleSheet, View} from 'react-native';
import {CartHeader, CartList, CartFooterTotal} from './';
import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';

interface Props {
  navigation: DrawerNavigationHelpers;
}

export const CartDrawerLayout: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CartHeader navigation={navigation} />
      </View>
      <View style={styles.content}>
        <CartList />
      </View>
      <View style={styles.bottom}>
        <CartFooterTotal />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0,
  },
  content: {
    flex: 1,
    height: 500,
  },
  bottom: {
    height: 120,
    flex: 0,
  },
  button: {
    margin: 4,
  },
});
