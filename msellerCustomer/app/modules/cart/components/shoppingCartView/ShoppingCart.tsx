import React from 'react';
import {ListRenderItemInfo, Modal, View} from 'react-native';
import {
  Button,
  Card,
  Divider,
  Input,
  Layout,
  List,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {CartItem} from './extra/CartItem';
import {useCart} from 'app/hooks';
import * as GraphQlTypes from 'app/generated/graphql';
import {TicketIcon} from 'app/modules/common/Icons';
import {LoadingIndicator} from 'app/modules/common';
import {useNavigation} from '@react-navigation/core';

export default (): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);
  const [products, setProducts] = React.useState<
    GraphQlTypes.Maybe<GraphQlTypes.Maybe<GraphQlTypes.CartItem>[]> | undefined
  >();

  const [productsToDelete, setProductsToDelete] = React.useState<string[]>([]);
  const [visible, setVisible] = React.useState(false);
  const [isDirty, setDirty] = React.useState(false);

  /**
   * Cart Hook
   */
  const {cart, removeItems, updateItems, isLoading} = useCart();
  const navigation = useNavigation();

  const gotoHome = () => {
    navigation && navigation.goBack();
  };

  React.useEffect(() => {
    if (!products) {
      setProducts(cart?.contents?.nodes);
    }
  }, [cart?.contents?.nodes?.length]);

  const onItemChange = (key: string, quantity: number) => {
    setDirty(true);
    setProducts(prev => {
      return prev?.reduce((acc: any, current: any) => {
        if (current.key === key) {
          return [...acc, {...current, quantity}];
        }
        return [...acc, current];
      }, []);
    });
  };

  const onItemRemove = React.useCallback(
    (item: GraphQlTypes.Product): void => {
      let deleteProducts: string[] = [];
      setProducts(prev => {
        return prev?.reduce((acc: any, current: any) => {
          if (current.product?.node?.id === item.id) {
            const key = current?.key || '';
            if (key) {
              deleteProducts.push(key);
            }
            return acc; // script the item to remove
          }
          return [...acc, current];
        }, []);
      });
      setProductsToDelete(deleteProducts);
      setDirty(true);
    },
    [setProducts, setProductsToDelete],
  );

  const handleUpdateCart = React.useCallback(async () => {
    //Remove Items
    await removeItems(productsToDelete);
    setProductsToDelete([]);
    setDirty(false);
    //Update quantities
    const items = products?.map(
      item =>
        ({
          key: item?.key,
          quantity: item?.quantity || 0,
        } as GraphQlTypes.CartItemQuantityInput),
    );

    if (items) {
      await updateItems(items);
    }
  }, [products, productsToDelete, removeItems, updateItems]);

  const renderFooter = React.useCallback(
    () => (
      <Layout>
        <Button
          style={styles.updateButton}
          appearance="outline"
          size="small"
          accessoryLeft={isLoading && (LoadingIndicator as any)}
          disabled={isLoading || !isDirty}
          onPress={handleUpdateCart}>
          ACTUALIZAR CARRITO
        </Button>

        <Divider />
        <Layout style={styles.footer}>
          <Layout>
            <Text category="s1">SubTotal:</Text>
            <Text category="s1">Descuento:</Text>
            <Text category="s1">Impuestos:</Text>
            <Text category="s1">Total:</Text>
          </Layout>
          <Layout>
            <Text category="s1">{`${cart?.subtotal || '-'}`}</Text>
            <Text category="s1">{`${cart?.discountTotal || '-'}`}</Text>
            <Text category="s1">{`${cart?.subtotalTax || '-'}`}</Text>
            <Text category="s1">{`${cart?.total || '-'}`}</Text>
          </Layout>
        </Layout>
      </Layout>
    ),
    [
      cart?.discountTotal,
      cart?.subtotal,
      cart?.subtotalTax,
      cart?.total,
      handleUpdateCart,
      isDirty,
      isLoading,
      styles.footer,
      styles.updateButton,
    ],
  );

  const renderProductItem = (
    info: ListRenderItemInfo<GraphQlTypes.CartItem>,
  ): React.ReactElement => {
    return (
      <CartItem
        style={styles.item}
        index={info.index}
        item={info.item}
        isLoading={isLoading}
        onProductChange={onItemChange}
        onRemove={onItemRemove}
      />
    );
  };

  if (products?.length === 0 && !isDirty) {
    return (
      <View style={styles.wrapper}>
        <Text>No tiene productos seleccionados</Text>
        <Button onPress={gotoHome}>Ir al Catálogo</Button>
      </View>
    );
  }

  return (
    <Layout style={styles.container} level="2">
      <List
        data={products}
        renderItem={renderProductItem}
        ListFooterComponent={renderFooter}
      />
      <Button
        style={styles.checkoutButton}
        appearance="outline"
        size="medium"
        accessoryLeft={TicketIcon as any}
        onPress={() => setVisible(true)}>
        AGREGAR CUPÓN
      </Button>

      <Button style={styles.checkoutButton} size="medium">
        PROCESAR ORDEN
      </Button>
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Card disabled={visible}>
          <Text>Welcome to UI Kitten 😻</Text>
          <Input />
          <Button onPress={() => setVisible(false)}>DISMISS</Button>
        </Card>
      </Modal>
    </Layout>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  footer: {
    background: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 0.5,
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  checkoutButton: {
    marginHorizontal: 16,
    marginVertical: 5,
  },
  updateButton: {
    marginHorizontal: 16,
    marginVertical: 15,
  },
});
