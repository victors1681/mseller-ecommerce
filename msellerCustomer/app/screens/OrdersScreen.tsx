import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Divider, Text} from '@ui-kitten/components';
import {Orders} from 'app/modules/orders';
export const OrdersScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.categoryHeader}>
        <Text category="s2">Categorías</Text>
      </View>
      <Divider />
      <Text>Orders</Text>
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
