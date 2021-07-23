import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Layout, ListItem, ListItemProps, Text} from '@ui-kitten/components';
import * as GraphQlTypes from 'app/generated/graphql';
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
      <Layout style={styles.detailsContainer}>
        <Text style={styles.title} category="s1">
          {product.name || ''}
        </Text>
        <Layout style={styles.row}>
          <View style={styles.amountContainer}>
            <Text category="p1">{item.quantity || ''}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text appearance="hint">x</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.price} category="p1">
              {simpleNode?.price || '-'}
            </Text>
          </View>
          <View style={styles.total}>
            <Text style={styles.price} category="p1">
              {item.total || '-'}
            </Text>
          </View>
        </Layout>
      </Layout>
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
    textAlign: 'right',
  },
  row: {
    paddingTop: 15,
    flexDirection: 'row',
  },
  amountContainer: {
    paddingRight: 5,
  },
  total: {
    flex: 1,
    marginRight: 10,
  },
});
