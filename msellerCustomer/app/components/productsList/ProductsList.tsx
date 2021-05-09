import React from 'react';
import {useQuery} from '@apollo/client';
import {
  RootQueryToProductConnection,
  RootQueryToProductConnectionWhereArgs,
  ProductCategory,
  SimpleProduct,
} from 'app/generated/graphql'; // Import
import {CartIcon} from './extra/icons';
import {GET_ALL_PRODUCTS} from 'app/graphql/products';
import {useCart} from 'app/hooks';

import {
  Spinner,
  Button,
  Card,
  List,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {
  View,
  Dimensions,
  ListRenderItemInfo,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';

interface Data {
  products?: RootQueryToProductConnection;
}
interface QueryArgs {
  where: RootQueryToProductConnectionWhereArgs;
}
interface Props {
  categoryId: number;
  search: string;
}

type FullProduct = SimpleProduct | ProductCategory;

export const ProductList: React.FC<Props> = ({categoryId, search}) => {
  const styles = useStyleSheet(themedStyles);
  const navigation = useNavigation();

  const {addItem, isLoading: isCartLoading} = useCart();
  const {loading: isLoading, data, error: categoriesError} = useQuery<
    Data,
    QueryArgs
  >(GET_ALL_PRODUCTS, {
    variables: {
      where: {categoryId, search},
    },
  }); // Use the type here for type safety

  const {products} = data || {};

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
  if (!products) {
    return <Text>None</Text>;
  }

  const onItemPress = (productId: number): void => {
    navigation && navigation.navigate('ProductDetails', {productId});
  };

  const LoadingIndicator = () => (
    <View style={[styles.indicator]}>
      <Spinner size="small" />
    </View>
  );

  const renderItemFooter = (
    info: ListRenderItemInfo<FullProduct>,
  ): React.ReactElement => {
    const item = info.item as SimpleProduct;

    return (
      <View style={styles.itemFooter}>
        <Text category="s1">{item.price || ''}</Text>
        {item.purchasable && (
          <Button
            style={styles.iconButton}
            size="small"
            disabled={isCartLoading}
            accessoryLeft={(isCartLoading ? LoadingIndicator : CartIcon) as any}
            onPress={() => addItem(info.item.databaseId, 1)}
          />
        )}
      </View>
    );
  };

  const renderItemHeader = (
    info: ListRenderItemInfo<FullProduct>,
  ): React.ReactElement => (
    <ImageBackground
      style={styles.itemHeader}
      source={{uri: info.item.image?.sourceUrl || ''}}
    />
  );

  const renderProductItem = (
    info: ListRenderItemInfo<FullProduct>,
  ): React.ReactElement => (
    <Card
      style={styles.productItem}
      header={() => renderItemHeader(info)}
      footer={() => renderItemFooter(info)}
      onPress={() => onItemPress(info.item.databaseId)}>
      <Text category="s1">{info.item.name || ''}</Text>
      <Text appearance="hint" category="c1">
        {info.item.id}
      </Text>
    </Card>
  );

  return (
    <List
      contentContainerStyle={styles.productList}
      data={products.nodes}
      numColumns={2}
      renderItem={renderProductItem}
    />
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  productItem: {
    flex: 1,
    margin: 8,
    maxWidth: Dimensions.get('window').width / 2 - 24,
    backgroundColor: 'background-basic-color-1',
  },
  itemHeader: {
    height: 140,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductList;
