import React from 'react';
import {CartItem, Cart} from '../../generated/graphql'; // Import
import {
  Spinner,
  List,
  StyleService,
  Text,
  useStyleSheet,
  Divider,
} from '@ui-kitten/components';
import {View, Dimensions, ListRenderItemInfo} from 'react-native';

import {useIsDrawerOpen} from '@react-navigation/drawer';
import {CartItemRow} from './CartItemRow';
import {useCart} from 'app/hooks/useCart';
interface Data {
  cart?: Cart;
}
interface Props {
  listHeader?: React.ComponentType<any> | React.ReactElement | null;
  listFooter?: React.ComponentType<any> | React.ReactElement | null;
}
export const CartList: React.FC<Props> = ({listHeader, listFooter}) => {
  const styles = useStyleSheet(themedStyles);
  const isDrawerOpen = useIsDrawerOpen();
  //const navigation = useNavigation();

  const {cart, refetch, isLoading, error} = useCart();

  React.useEffect(() => {
    if (isDrawerOpen) {
      refetch();
    }
  }, [isDrawerOpen]);

  /**
   * Perform on update
   */

  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <Spinner />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.wrapper}>
        <Text>An error occurred {JSON.stringify(error)}</Text>
      </View>
    );
  }
  if (cart?.contents?.nodes?.length === 0) {
    return (
      <View style={styles.wrapper}>
        <Text>No tiene productos por comprar</Text>
      </View>
    );
  }

  const renderProductItem = (
    info: ListRenderItemInfo<CartItem>,
  ): React.ReactElement => {
    return <CartItemRow info={info} />;
  };

  return (
    <List
      ListHeaderComponent={listHeader}
      ListFooterComponent={listFooter}
      contentContainerStyle={styles.CartList}
      data={cart?.contents?.nodes}
      numColumns={1}
      renderItem={renderProductItem}
      ItemSeparatorComponent={Divider}
      refreshing={isLoading}
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
