import React, {useCallback} from 'react';
import {ListRenderItemInfo, View} from 'react-native';
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
  Modal,
  ListItem,
} from '@ui-kitten/components';
import {useCart, usePaymentGateways} from 'app/hooks';
import {CloseIcon} from './extra/icons';
import * as GraphQlTypes from 'app/generated/graphql';
import {TicketIcon} from 'app/modules/common/Icons';
import {LoadingIndicator, LoadingIndicatorWhite} from 'app/modules/common';
import {useNavigation} from '@react-navigation/core';
import {PaymentGateway} from './extra/PaymentsGateway';
export default (): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);
  const [products, setProducts] = React.useState<
    GraphQlTypes.Maybe<GraphQlTypes.Maybe<GraphQlTypes.CartItem>[]> | undefined
  >();

  const [visible, setVisible] = React.useState(false);
  const [isDirty, setDirty] = React.useState(false);
  const [coupon, setCoupon] = React.useState('');

  /**
   * Cart Hook
   */
  const {
    cart,
    removeItems,
    updateItems,
    isLoading,
    applyCoupon,
    removeCoupon,
    applyCouponInfo,
  } = useCart();

  const navigation = useNavigation();

  const gotoHome = () => {
    navigation && navigation.goBack();
  };

  const goNext = () => {
    navigation && navigation.navigate('Address');
  };

  React.useEffect(() => {
    //if (!products) {
    setProducts(cart?.contents?.nodes);
    //}
  }, [cart?.contents?.nodes?.length, cart?.total]);

  /**
   * Apply coupon
   */
  const handleApplyCoupon = React.useCallback(async (): Promise<void> => {
    const response = await applyCoupon(coupon.toLowerCase());
    console.log('Error', response);
    if (!response) {
      setVisible(false);
    }
  }, [applyCoupon, coupon]);

  /**
   * Remove coupon
   */
  const handleRemoveCoupon = React.useCallback(
    async (currentCoupon): Promise<void> => {
      await removeCoupon([currentCoupon.toLowerCase()]);
    },
    [removeCoupon],
  );

  const getCouponAmount = useCallback(() => {
    return cart?.appliedCoupons?.map(d => {
      return (
        <Text key={d?.code} status="success" category="s1">{`-${
          d?.discountAmount || '-'
        }`}</Text>
      );
    });
  }, [cart]);

  const getCouponLabel = useCallback(() => {
    return cart?.appliedCoupons?.map(d => {
      return (
        <Layout key={`label-${d?.code}`} style={styles.couponWrapper}>
          <Button
            appearance="ghost"
            status="basic"
            style={[styles.couponButton]}
            accessoryLeft={CloseIcon as any}
            onPress={() => d?.code && handleRemoveCoupon(d.code)}
          />
          <Text category="s1">{`Cupón:${d?.code || '-'}`}</Text>
        </Layout>
      );
    });
  }, [
    cart?.appliedCoupons,
    handleRemoveCoupon,
    styles.couponButton,
    styles.couponWrapper,
  ]);

  const renderFooter = React.useCallback(
    () => (
      <Layout>
        <Layout style={styles.couponCardWrapper}>
          {getCouponLabel()}
          {getCouponAmount()}
        </Layout>
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
        <PaymentGateway />
      </Layout>
    ),
    [
      cart?.discountTotal,
      cart?.subtotal,
      cart?.subtotalTax,
      cart?.total,
      getCouponAmount,
      getCouponLabel,
      styles.couponCardWrapper,
      styles.footer,
    ],
  );

  const renderItemAccessory = (
    quantity: GraphQlTypes.Maybe<number> | undefined,
  ) => {
    return (
      <View style={styles.controlContainer}>
        <Text style={styles.controlText} status="control" category="c2">
          {`${quantity}` || ''}
        </Text>
      </View>
    );
  };
  const renderItemAPrice = (
    quantity: GraphQlTypes.Maybe<string> | undefined,
  ) => {
    return (
      <View style={styles.controlContainer}>
        <Text style={styles.controlText} status="control" category="c2">
          {quantity || ''}
        </Text>
      </View>
    );
  };
  const renderItem = (info: ListRenderItemInfo<GraphQlTypes.CartItem>) => (
    <ListItem
      title={`${info?.item?.product?.node?.name}`}
      description={`${info?.item?.product?.node?.shortDescription}`}
      accessoryLeft={() => renderItemAccessory(info?.item?.quantity)}
      accessoryRight={() => renderItemAPrice(info?.item.total)}
    />
  );

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
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
      />

      <Button onPress={goNext} style={styles.checkoutButton} size="medium">
        PROCESAR ORDEN
      </Button>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Card disabled={true} style={styles.modalCard}>
          <Button
            style={[styles.iconButton, styles.removeButton]}
            appearance="ghost"
            status="basic"
            accessoryLeft={CloseIcon as any}
            onPress={() => setVisible(false)}
          />
          <Text category="h6" style={styles.marginHeader}>
            Agregar Cupón
          </Text>
          <Text>{applyCouponInfo.error?.message}</Text>
          <Input style={styles.margin} onChangeText={t => setCoupon(t)} />
          <Button
            onPress={handleApplyCoupon}
            disabled={applyCouponInfo.loading || coupon.length === 0}
            accessoryLeft={
              applyCouponInfo.loading && (LoadingIndicatorWhite as any)
            }>
            APLICAR CUPÓN
          </Button>
        </Card>
      </Modal>
    </Layout>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
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
  controlContainer: {
    borderRadius: 4,
    margin: 4,
    padding: 4,
    minWidth: 25,
    backgroundColor: '#3366FF',
  },
  controlText: {
    textAlign: 'center',
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
