import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {
  Button,
  Input,
  ListItem,
  ListItemProps,
  Text,
} from '@ui-kitten/components';
import {CloseIcon, MinusIcon, PlusIcon} from './icons';
import * as GraphQlTypes from 'app/generated/graphql';
import {Product} from 'app/generated/graphql';
import {getSourceImage} from 'app/utils';

export type CartItemProps = ListItemProps & {
  index: number;
  item: GraphQlTypes.CartItem;
  onProductChange: (key: string, quantity: number) => void;
  onRemove: (product: Product, index: number) => void;
};

export const CartItem = (props: CartItemProps): React.ReactElement => {
  const {
    style,
    item,
    index,
    onProductChange,
    onRemove,
    ...listItemProps
  } = props;

  const product = item.product?.node as GraphQlTypes.Product;
  const nodeSimple = item.product?.node as GraphQlTypes.SimpleProduct;

  const decrementButtonEnabled = (): boolean => {
    return item.quantity > 1;
  };

  const onRemoveButtonPress = (): void => {
    onRemove(product, index);
  };

  const onMinusButtonPress = React.useCallback(() => {
    onProductChange(item.key, (item.quantity || 0) - 1);
  }, [item, item.key]);

  const onPlusButtonPress = React.useCallback(() => {
    onProductChange(item.key, (item.quantity || 0) + 1);
  }, [item, item.key]);

  const onChangeInput = (qty: string) => {
    const value = parseInt(qty) || 0;
    onProductChange(item.key, value);
  };

  return (
    <ListItem {...listItemProps} style={[styles.container, style]}>
      <Image
        style={styles.image}
        source={getSourceImage(product?.image?.sourceUrl as string)}
      />
      <View style={styles.detailsContainer}>
        <Text category="s1">{product.name || ''}</Text>
        <Text appearance="hint" category="p2">
          {product.shortDescription || ''}
        </Text>
        <Text category="s2">{nodeSimple.price || ''}</Text>
        <View style={styles.amountContainer}>
          <Button
            style={[styles.iconButton, styles.amountButton]}
            size="tiny"
            accessoryLeft={MinusIcon}
            onPress={onMinusButtonPress}
            disabled={!decrementButtonEnabled()}
          />
          <Input
            style={styles.input}
            value={`${item.quantity}`}
            onChangeText={onChangeInput}
          />
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
        onPress={onRemoveButtonPress}
      />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  image: {
    width: 120,
    height: 144,
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
    borderRadius: 50,
  },
  input: {
    minWidth: 60,
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
    margin: 10,
  },
});
