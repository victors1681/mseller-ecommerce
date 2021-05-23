import React from 'react';
import {ListRenderItemInfo, Modal} from 'react-native';
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
import {CartItem} from './extra/cart-item.component';
import {useCart} from 'app/hooks';
import * as GraphQlTypes from 'app/generated/graphql';
import {TicketIcon} from 'app/modules/common/Icons';
export default (): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);
  const [products, setProducts] = React.useState<
    GraphQlTypes.CartItem[] | undefined | null
  >();

  const [productsToDelete, setProductsToDelete] = React.useState<string[]>([]);
  const [visible, setVisible] = React.useState(false);

  /**
   * Cart Hook
   */
  const {cart, removeItems, updateItems} = useCart();

  React.useEffect(() => {
    if (!products) {
      setProducts(cart?.contents?.nodes);
    }
  }, [cart]);

  const onItemChange = (key: string, quantity: number) => {
    // console.log(products);
    const test = products?.reduce((acc, current) => {
      if (current.key === key) {
        return [...acc, {...current, quantity}];
      }
      console.log(acc);
      return [...acc, current];
    }, []);

    console.log(test);

    setProducts(prev => {
      return prev?.reduce((acc, current) => {
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
        return prev?.reduce((acc, current) => {
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
    },
    [setProducts, setProductsToDelete],
  );

  const handleUpdateCart = React.useCallback(async () => {
    //Remove Items
    await removeItems(productsToDelete);

    //Update quantities
    const items = products?.map(
      item =>
        ({
          key: item.key,
          quantity: item.quantity || 0,
        } as GraphQlTypes.CartItemQuantityInput),
    );

    if (items) {
      await updateItems(items);
    }
  }, [products, productsToDelete, removeItems, updateItems]);

  const renderFooter = (): React.ReactElement => (
    <Layout>
      <Button
        style={styles.updateButton}
        appearance="outline"
        size="small"
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
          <Text category="s1">{`${cart?.subtotal}`}</Text>
          <Text category="s1">{`${cart?.discountTotal}`}</Text>
          <Text category="s1">{`${cart?.subtotalTax}`}</Text>
          <Text category="s1">{`${cart?.total || 0}`}</Text>
        </Layout>
      </Layout>
    </Layout>
  );

  const renderProductItem = (
    info: ListRenderItemInfo<GraphQlTypes.CartItem>,
  ): React.ReactElement => (
    <CartItem
      style={styles.item}
      index={info.index}
      item={info.item}
      onProductChange={onItemChange}
      onRemove={onItemRemove}
    />
  );

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
        accessoryLeft={TicketIcon}
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
