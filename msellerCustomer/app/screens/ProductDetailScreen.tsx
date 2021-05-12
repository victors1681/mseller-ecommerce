import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {ProductDetail} from 'app/modules/product/components/detail';
export const ProductsScreen = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.scrollView}>
        <ProductDetail />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  searchBar: {
    height: 60,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 0,
  },
});
