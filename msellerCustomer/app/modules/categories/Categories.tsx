import React from 'react';
import {Card, Spinner, Text, StyleService} from '@ui-kitten/components';
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useProduct} from 'app/hooks';
import {ProductCategory} from 'app/generated/graphql';

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
  const renderItemHeader = (item?: ProductCategory): React.ReactElement => (
    <ImageBackground
      style={styles.itemHeader}
      source={{uri: item?.image?.sourceUrl || ''}}
    />
  );

  interface CategoryCardProps {
    item: ProductCategory;
  }
  const CategoryCard = ({item}: CategoryCardProps) => {
    return (
      <Card
        style={styles.categoryItem}
        onPress={() => navigateToProducts(item?.databaseId)}
        header={() => renderItemHeader(item)}>
        <View>
          <Text style={styles.cardText} category="s2">
            {item.name || ''}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={productCategories?.nodes}
        renderItem={({item}) => <CategoryCard item={item as ProductCategory} />}
        //Setting the number of column
        numColumns={3}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
}

const styles = StyleService.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  itemHeader: {
    height: 80,
  },
  cardText: {
    textAlign: 'center',
  },
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItem: {
    flex: 1,
    margin: 2,
    maxWidth: Dimensions.get('window').width / 3 - 8,

    //backgroundColor: 'background-basic-color-1',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
