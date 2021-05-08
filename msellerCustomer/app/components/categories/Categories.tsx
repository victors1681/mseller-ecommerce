import React from 'react';
import {useQuery} from '@apollo/client';
import {RootQueryToProductCategoryConnection} from '../../generated/graphql'; // Import
import {GET_ALL_CATEGORIES} from '../../graphql/queries/categories';
import {Spinner, Text} from '@ui-kitten/components';
import {
  StyleSheet,
  FlatList,
  View,
  SafeAreaView,
  Image,
  TouchableHighlight,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';

interface Data {
  productCategories?: RootQueryToProductCategoryConnection;
}
export default function Categories() {
  const {loading: isLoading, data, error: categoriesError} = useQuery<Data>(
    GET_ALL_CATEGORIES,
  ); // Use the type here for type safety

  const navigation = useNavigation();
  const {productCategories} = data || {};

  const navigateToProducts = (categoryId?: number) => {
    navigation.navigate('Products', {categoryId});
  };

  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <Spinner />
      </View>
    );
  }
  if (categoriesError) {
    return (
      <View style={styles.wrapper}>
        <Text>An error occurred {JSON.stringify(categoriesError)}</Text>
      </View>
    );
  }
  if (!productCategories) {
    return <Text>None</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={productCategories?.nodes}
        renderItem={({item}) => (
          <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
            <Text>{item?.name || ''}</Text>
            <TouchableHighlight
              onPress={() => navigateToProducts(item?.databaseId)}>
              <Image
                style={styles.imageThumbnail}
                source={{uri: item?.image?.sourceUrl || ''}}
              />
            </TouchableHighlight>
          </View>
        )}
        //Setting the number of column
        numColumns={3}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
});
