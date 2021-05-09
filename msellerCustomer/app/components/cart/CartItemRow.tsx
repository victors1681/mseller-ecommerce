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

interface Props {
  info: ListRenderItemInfo<CartItemInterface>;
}
export const CartItemRow: React.FC<Props> = ({info}): React.ReactElement => {
  const {item} = info;
  const product = info?.item.product?.node as
    | Product
    | SimpleProduct
    | undefined;

  const {removeItem} = useCart();
  const decrementButtonEnabled = (): boolean => {
    return (item?.quantity || 0) > 1;
  };

  const onRemoveButtonPress = (key: string) => (): void => {
    removeItem(key);
  };

  const onMinusButtonPress = (): void => {};

  const onPlusButtonPress = (): void => {};

  return (
    <ListItem style={[styles.container]}>
      <Image
        style={styles.image}
        source={{uri: product?.image?.sourceUrl || ''}}
      />
      <View style={styles.detailsContainer}>
        <Text category="s2">{product?.name || ''}</Text>
        <Text appearance="hint" category="c1">
          {product?.shortDescription || ''}
        </Text>
        <Text category="c1">{product?.price || ''}</Text>
        <View style={styles.amountContainer}>
          <Button
            style={[styles.iconButton, styles.amountButton]}
            size="tiny"
            accessoryLeft={MinusIcon}
            onPress={onMinusButtonPress}
            disabled={!decrementButtonEnabled()}
          />
          <Text style={styles.amount} category="s2">
            {`${item?.quantity || 0}`}
          </Text>
          <Button
            style={[styles.iconButton, styles.amountButton]}
            size="tiny"
            accessoryLeft={PlusIcon}
            onPress={onPlusButtonPress}
          />
        </View>
      </View>
      <Button
        style={[styles.iconButton, styles.removeButton]}
        appearance="ghost"
        status="basic"
        accessoryLeft={CloseIcon}
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
