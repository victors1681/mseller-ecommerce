import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Divider, Layout} from '@ui-kitten/components';
import {ProductList} from '../modules/product';
import {useRoute} from '@react-navigation/core';
import {SearchBar} from 'app/modules/product/components/searchBar';

export const ProductsScreen = () => {
  const {params} = useRoute<any>();
  const categoryId = params?.categoryId;

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar />
      <Layout style={styles.searchBar}>
        <SearchBar categoryId={categoryId} />
      </Layout>
      <Divider />
      <Layout style={styles.content}>
        <ProductList />
      </Layout>
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
});
