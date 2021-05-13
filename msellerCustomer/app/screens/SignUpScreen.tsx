import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {SignUp} from 'app/modules/customer/signUp';
export const ProductsScreen = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.scrollView}>
        <SignUp />
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
