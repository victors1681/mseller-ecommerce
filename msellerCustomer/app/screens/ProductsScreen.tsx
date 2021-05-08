import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Input,
} from '@ui-kitten/components';
import {ProductList} from '../components/productsList';
import {useRoute} from '@react-navigation/core';
const SearchIcon = style => <Icon {...style} name="search" />;

const SearchBar = ({handleSearch}) => (
  <Input
    style={styles.searchBar}
    placeholder="Search"
    accessoryRight={SearchIcon}
    onChangeText={handleSearch}
  />
);
export const ProductsScreen = () => {
  const {params} = useRoute<any>();
  const [search, setSearch] = React.useState('');
  const {categoryId} = params;

  const handleSearch = (value: string) => setSearch(value);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Divider />
        <SearchBar handleSearch={handleSearch} />
        <ProductList categoryId={categoryId} search={search} />
        <Layout
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text category="h1">Products</Text>
        </Layout>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    padding: 8,
  },
  container: {
    backgroundColor: 'red',
  },
});

export default ProductsScreen;
