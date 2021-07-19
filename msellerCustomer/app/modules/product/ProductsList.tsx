import React from 'react';
import {ProductCategory, SimpleProduct, Product} from 'app/generated/graphql'; // Import
import {CartIcon} from './extra/icons';
import {useCart, useProduct} from 'app/hooks';
import {Loading, Error, Empty} from 'app/modules/common';
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

const MAX_TITLE_LENGTH = 30;
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
    return <Empty message="Productos no encontrados" />;
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
        {item.purchasable && (
          <Button
            key={item.id}
            style={styles.iconButton}
            size="small"
            disabled={isCartLoading}
            accessoryLeft={(isCartLoading ? LoadingIndicator : CartIcon) as any}
            onPress={() => addItem(info.item.databaseId, 1)}>
            Agregar
          </Button>
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

  const isSimpleProduct = (item: any): item is SimpleProduct => {
    return item?.price !== undefined;
  };

  const getPrice = (info: any) => {
    if (isSimpleProduct(info.item)) {
      return info.item.price;
    }
    return '-';
  };

  const renderProductItem = (
    info: ListRenderItemInfo<Product>,
  ): React.ReactElement => {
    const name =
      (info?.item?.name?.length || 0) > MAX_TITLE_LENGTH
        ? `${info.item.name?.substring(0, MAX_TITLE_LENGTH)}...`
        : info.item.name;

    return (
      <Card
        style={styles.productItem}
        header={() => renderItemHeader(info)}
        footer={() => renderItemFooter(info)}
        onPress={() => onItemPress(info.item.databaseId)}>
        <Text category="label">
          {`${getPrice(info)} -` || ''}{' '}
          <Text category="c1">{`${name}` || ''}</Text>
        </Text>
      </Card>
    );
  };

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
    margin: 5,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  iconButton: {
    paddingHorizontal: 0,
    width: '100%',
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductList;
