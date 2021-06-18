import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Orders} from 'app/modules/orders';
export const OrdersScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Orders />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  categoryHeader: {
    margin: 10,
    marginTop: 20,
  },
  autoComplete: {
    marginLeft: 10,
    marginRight: 10,
  },
});

export default OrdersScreen;
