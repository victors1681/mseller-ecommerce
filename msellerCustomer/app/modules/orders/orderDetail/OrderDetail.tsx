import React from 'react';
import {ListRenderItemInfo} from 'react-native';
import {
  Button,
  Divider,
  Layout,
  List,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {OrderItem} from './extra/OderItem';
import {useOrders} from 'app/hooks';
import * as GraphQlTypes from 'app/generated/graphql';
import {Empty, Loading, Error} from 'app/modules/common';
import {useNavigation, useRoute} from '@react-navigation/core';
import {ScreenLinks} from 'app/navigation/ScreenLinks';

export const OrderDetail = (): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);
  const route = useRoute();
  const {orderInfo, getOrder} = useOrders();

  const {loading: isLoading, error, data} = orderInfo;

  const {orderId} = route.params as any;

  const navigation = useNavigation();

  const handleBack = () => {
    navigation && navigation.navigate(ScreenLinks.HOME);
  };

  React.useEffect(() => {
    getOrder(orderId);
  }, [orderId]);

  const order = data?.order;
  console.log('order', error, order);

  const renderFooter = React.useCallback(
    () => (
      <Layout>
        <Divider />
        <Layout style={styles.footer}>
          <Layout>
            <Text category="s1">SubTotal:</Text>
            <Text category="s1">Descuento:</Text>
            <Text category="s1">Impuestos:</Text>
            <Text category="s1">Total:</Text>
          </Layout>
          <Layout>
            <Text category="s1">{`${order?.subtotal || '-'}`}</Text>
            <Text category="s1">{`${order?.discountTotal || '-'}`}</Text>
            <Text category="s1">{`${order?.totalTax || '-'}`}</Text>
            <Text category="s1">{`${order?.total || '-'}`}</Text>
          </Layout>
        </Layout>
        <Button
          style={styles.backButton}
          appearance="outline"
          status="info"
          onPress={handleBack}>
          REGRESAR AL CATÁLOGO DE PRODUCTOS
        </Button>
      </Layout>
    ),
    [order, isLoading],
  );

  const renderProductItem = (
    info: ListRenderItemInfo<GraphQlTypes.LineItem>,
  ): React.ReactElement => {
    return (
      <OrderItem
        style={styles.item}
        index={info.index}
        item={info.item}
        isLoading={isLoading}
      />
    );
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }
  if (!order) {
    return (
      <Empty
        enableBtn={false}
        message={`No se encontró la orden #${orderId}`}
      />
    );
  }

  return (
    <Layout style={styles.container} level="2">
      <List
        data={order.lineItems?.nodes}
        renderItem={renderProductItem}
        ListFooterComponent={renderFooter}
      />
      footer
    </Layout>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  couponWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponButton: {
    height: 5,
    width: 5,
    margin: 0,
    padding: 0,
  },
  containerModal: {
    borderRadius: 4,
    padding: 16,
    width: 320,
  },
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCard: {
    minWidth: 240,
  },
  margin: {
    marginBottom: 10,
  },
  marginHeader: {
    marginBottom: 10,
    marginTop: 30,
    textAlign: 'center',
  },
  iconButton: {
    paddingHorizontal: 0,
    margin: 0,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
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
  couponCardWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingRight: 16,
    width: '100%',
    borderColor: 'background-basic-color-3',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    alignItems: 'center',
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
