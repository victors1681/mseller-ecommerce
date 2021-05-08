import React from 'react';
import {useQuery} from '@apollo/client';
import {CartItem, Cart} from '../../generated/graphql'; // Import
import {GET_CART, ADD_TO_CART} from '../../graphql/cart';
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
import {useNavigation, Navigation} from '@react-navigation/core';

interface Data {
  cart?: Cart;
}
interface Props {
  navigation: Navigation;
}
export const CartList: React.FC<Props> = ({navigation}) => {
  const styles = useStyleSheet(themedStyles);
  //const navigation = useNavigation();

  const {loading: isLoading, data, error: categoriesError} = useQuery<Data>(
    GET_CART,
    {fetchPolicy: 'no-cache'},
  ); // Use the type here for type safety

  const {cart} = data || {};

  console.log('data CART query', data, isLoading);

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
  if (cart.contents?.nodes?.length === 0) {
    return (
      <View style={styles.wrapper}>
        <Text>No tiene productos por comprar</Text>
      </View>
    );
  }

  const onItemPress = (index: number): void => {
    navigation && navigation.navigate('ProductDetails3');
  };

  const renderItemHeader = (
    info: ListRenderItemInfo<CartItem>,
  ): React.ReactElement => (
    <ImageBackground
      style={styles.itemHeader}
      source={{uri: info.item.product?.node?.image?.sourceUrl || ''}}
    />
  );

  const renderProductItem = (
    info: ListRenderItemInfo<CartItem>,
  ): React.ReactElement => (
    <Card
      style={styles.productItem}
      header={() => renderItemHeader(info)}
      onPress={() => onItemPress(info.index)}>
      <Text category="s1">{info.item.product?.node?.name || ''}</Text>
      <Text appearance="hint" category="c1">
        {info.item.quantity || '0'}
      </Text>
    </Card>
  );

  return (
    <List
      contentContainerStyle={styles.CartList}
      data={cart.contents?.nodes}
      numColumns={1}
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
  CartList: {
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
});

export default CartList;
