import React from 'react';
import {ProductCategory, SimpleProduct, Product} from 'app/generated/graphql'; // Import
import {CartIcon} from './extra/icons';
import {useCart, useProduct} from 'app/hooks';
import {Loading, Error} from 'app/modules/common';
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
import {getSourceImage} from 'app/utils';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
type FullProduct = SimpleProduct | ProductCategory | Product;

export const ProductList: React.FC = () => {
  const styles = useStyleSheet(themedStyles);
  const navigation = useNavigation();

  const {addItem, isLoading: isCartLoading} = useCart();

  const {
    product: {isLoading, data, error: categoriesError},
  } = useProduct();

  const products = data?.products;

  if (isLoading) {
    return <Loading />;
  }
  if (categoriesError) {
    return <Error error={categoriesError} />;
  }
  if (!products) {
    return <Text>None</Text>;
  }

  const onItemPress = (productId: number): void => {
    navigation &&
      navigation.navigate(ScreenLinks.PRODUCTS_DETAILS, {productId});
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
      source={getSourceImage(info.item.image?.sourceUrl as string)}
    />
  );

  const renderProductItem = (
    info: ListRenderItemInfo<Product>,
  ): React.ReactElement => (
    <Card
      style={styles.productItem}
      header={() => renderItemHeader(info)}
      footer={() => renderItemFooter(info)}
      onPress={() => onItemPress(info.item.databaseId)}>
      <Text category="s1">{info.item.name || ''}</Text>
      <Text appearance="hint" category="c1">
        {info?.item?.shortDescription || ''}
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
