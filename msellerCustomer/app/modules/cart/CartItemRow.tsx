import React from 'react';
import {Image, StyleSheet, View, ListRenderItemInfo} from 'react-native';
import {Button, ListItem, Text} from '@ui-kitten/components';
import {CloseIcon, MinusIcon, PlusIcon} from './extra/icons';

import {
  CartItem as CartItemInterface,
  SimpleProduct,
  Product,
} from 'app/generated/graphql';
import {useCart} from 'app/hooks/useCart';
import {getSourceImage} from 'app/utils';
interface Props {
  info: ListRenderItemInfo<CartItemInterface>;
}
export const CartItemRow: React.FC<Props> = ({info}): React.ReactElement => {
  const {item} = info;
  const product = info?.item.product?.node as Product;
  const nodeSimple = info?.item.product?.node as SimpleProduct;

  const {removeItem, updateItem, updateItemInfo} = useCart();

  const {loading: isLoading} = updateItemInfo;
  const [qty, setQty] = React.useState<number>(item.quantity || 0);

  const decrementButtonEnabled = (): boolean => {
    return (item?.quantity || 0) > 1;
  };

  const onRemoveButtonPress = (key: string) => (): void => {
    removeItem(key);
  };

  React.useEffect(() => {
    if (item.quantity !== qty) {
      updateItem(item.key, qty);
    }
  }, [qty, item]);

  const onMinusButtonPress = (): void => {
    setQty(prev => prev - 1);
  };

  const onPlusButtonPress = (): void => {
    setQty(prev => prev + 1);
  };

  return (
    <ListItem style={[styles.container]}>
      <Image
        style={styles.image}
        source={getSourceImage(product?.image?.sourceUrl as string)}
      />
      <View style={styles.detailsContainer}>
        <Text category="s2">{product?.name || ''}</Text>
        <Text appearance="hint" category="c1">
          {product?.shortDescription || ''}
        </Text>
        <Text category="c1">{nodeSimple?.price || ''}</Text>
        <View style={styles.amountContainer}>
          <Button
            style={[styles.iconButton, styles.amountButton]}
            size="tiny"
            accessoryLeft={MinusIcon as any}
            onPress={onMinusButtonPress}
            disabled={!decrementButtonEnabled() || isLoading}
          />
          <Text style={styles.amount} category="s2">
            {`${qty}`}
          </Text>
          <Button
            style={[styles.iconButton, styles.amountButton]}
            size="tiny"
            accessoryLeft={PlusIcon as any}
            onPress={onPlusButtonPress}
            disabled={isLoading}
          />
        </View>
      </View>
      <Button
        style={[styles.iconButton, styles.removeButton]}
        appearance="ghost"
        status="basic"
        accessoryLeft={CloseIcon as any}
        onPress={onRemoveButtonPress(item.key)}
      />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 100,
  },
  image: {
    width: 54,
    height: 54,
    margin: 5,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    padding: 16,
  },
  amountContainer: {
    position: 'absolute',
    flexDirection: 'row',
    left: 16,
    bottom: 16,
  },
  amountButton: {
    borderRadius: 12,
  },
  amount: {
    textAlign: 'center',
    width: 40,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});
