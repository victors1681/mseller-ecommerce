import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ListItem, ListItemProps, Text} from '@ui-kitten/components';
import * as GraphQlTypes from 'app/generated/graphql';
import {Product} from 'app/generated/graphql';
import {getSourceImage} from 'app/utils';
import {isSimpleProduct, isVariableProduct} from 'app/utils/typeGuards';

export type OrderItemProps = ListItemProps & {
  index: number;
  item: GraphQlTypes.LineItem;
  isLoading: boolean;
};

export const OrderItem = (props: OrderItemProps): React.ReactElement => {
  const {style, item, ...listItemProps} = props;

  const product = item.product as GraphQlTypes.Product;
  const simpleNode = isSimpleProduct(item.product)
    ? item.product
    : isVariableProduct(item.product)
    ? item.product
    : null;

  return (
    <ListItem {...listItemProps} style={[styles.container, style]}>
      <Image
        style={styles.image}
        source={getSourceImage(product?.image?.sourceUrl as string)}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title} category="s1">
          {product.name || ''}
        </Text>
        {product.shortDescription && (
          <Text appearance="hint" category="p2">
            {product.shortDescription || ''}
          </Text>
        )}
        <Text style={styles.price} category="s2">
          {simpleNode?.price || '-'}
        </Text>
        <View style={styles.amountContainer}>
          <Text>{item.quantity || ''}</Text>
        </View>
      </View>
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
  title: {
    marginRight: 20,
  },
  price: {
    marginTop: 3,
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
