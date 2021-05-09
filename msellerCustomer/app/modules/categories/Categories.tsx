import React from 'react';
import {Spinner, Text} from '@ui-kitten/components';
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useProduct} from 'app/hooks';

export default function Categories() {
  const {
    handleSearch,
    categories: {error: categoriesError, isLoading, data},
  } = useProduct();

  const navigation = useNavigation();
  const {productCategories} = data || {};

  const navigateToProducts = (categoryId?: number) => {
    handleSearch('', categoryId);
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
