import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {SignIn} from 'app/modules/signIn';

export const ProductsScreen = () => {
  return <SignIn />;
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
