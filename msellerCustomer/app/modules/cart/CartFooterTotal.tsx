import React from 'react';
import {Text, Layout, Button, Divider} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';

import {useCart} from 'app/hooks/useCart';

export const CartFooterTotal = () => {
  const {cart} = useCart();

  return (
    <Layout style={styles.wrapper}>
      <Divider />
      <Layout style={styles.container}>
        <Layout>
          <Text category="c2">SubTotal:</Text>
        </Layout>
        <Layout style={styles.layout}>
          <Text category="label">{cart?.subtotal || ''}</Text>
        </Layout>
      </Layout>
      <Divider />
      <Button style={styles.button} appearance="outline" size="small">
        Ver Carrito
      </Button>
      <Button style={styles.button} appearance="filled" size="small">
        Ordenar
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 250,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 12,
    paddingBottom: 12,
  },
  layout: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  button: {
    margin: 4,
  },
});
