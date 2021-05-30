import React from 'react';
import {ListRenderItemInfo, View} from 'react-native';
import {
  Button,
  Card,
  Layout,
  List,
  StyleService,
  Text,
  useStyleSheet,
  Modal,
  ListItem,
  CheckBox,
} from '@ui-kitten/components';
import {useCart, useCustomer, useOrders} from 'app/hooks';
import * as GraphQlTypes from 'app/generated/graphql';
import {useNavigation} from '@react-navigation/core';
import {PaymentGateway} from './extra/PaymentsGateway';

/**
 * Custom Hook
 * @returns
 */
const usePlaceOrder = () => {
  const [payment, setPayment] = React.useState<
    GraphQlTypes.Maybe<GraphQlTypes.PaymentGateway> | undefined
  >();
  const [termChecked, setTermChecked] = React.useState(false);
  const [customerNote, setCustomerNote] = React.useState('');
  const navigation = useNavigation();

  const {cart, isLoading} = useCart();
  const {createOrder, createOrderInfo} = useOrders();
  const {customer} = useCustomer();

  const products = cart?.contents?.nodes;

  const handleCustomerNote = (values: string) => setCustomerNote(values);

  const goNext = () => {
    navigation && navigation.navigate('Address');
  };

  const gotoHome = () => {
    navigation && navigation.goBack();
  };

  const handleOrderCreation = React.useCallback(async () => {
    if (!customer) {
      console.error('Customer not found.. is not logged');
      return;
    }

    const getItems = (): GraphQlTypes.Maybe<
      GraphQlTypes.Maybe<GraphQlTypes.LineItemInput>[]
    > => {
      return products?.map(p => ({
        name: p?.product?.node?.name,
        productId: p?.product?.node?.databaseId,
        quantity: p?.quantity,
        subtotal: p?.subtotal,
        total: p?.total,
      })) as GraphQlTypes.Maybe<
        GraphQlTypes.Maybe<GraphQlTypes.LineItemInput>[]
      >;
    };

    const getCodes = () =>
      cart?.appliedCoupons?.length
        ? cart?.appliedCoupons?.map(c => c?.code || '')
        : [];

    const response = await createOrder({
      customerId: customer.databaseId,
      coupons: getCodes(),
      paymentMethod: payment?.id,
      paymentMethodTitle: payment?.title,
      shipping: {
        address1: customer.shipping?.address1,
        address2: customer.shipping?.address2,
        city: customer.shipping?.city,
        company: customer.shipping?.company,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.shipping?.phone,
        state: customer.shipping?.state,
      },
      lineItems: getItems(),
      customerNote,
    });

    if (response) {
      console.log('SAVED');
    } else {
      console.error('error');
    }
  }, [payment, customer, cart, createOrder]);

  return {
    gotoHome,
    handleOrderCreation,
    createOrderInfo,
    products,
    isCartLoading: isLoading,
    cart,
    setPayment,
    termChecked,
    setTermChecked,
    handleCustomerNote,
    customerNote,
  };
};

export default (): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);

  const [visible, setVisible] = React.useState(false);

  const {
    cart,
    setPayment,
    products,
    termChecked,
    setTermChecked,
    handleOrderCreation,
    handleCustomerNote,
    customerNote,
    gotoHome,
    createOrderInfo,
    isCartLoading,
  } = usePlaceOrder();

  const handlePaymentSelection = React.useCallback(
    (value: GraphQlTypes.Maybe<GraphQlTypes.PaymentGateway> | undefined) => {
      setPayment(value);
    },
    [setPayment],
  );

  const AdditionalData = ({customerNote}) => {
    const Texts = (): any => {
      return (
        <Text>
          He leído y acepto los
          <Text status="primary">términos y condiciones</Text> de esta
          aplicación.
        </Text>
      );
    };
    return (
      <Card>
        <Text style={styles.additionalTitle} category="h6">
          Datos Adicionales
        </Text>
        {/* <Input
          placeholder="Observación del pedido"
          value={customerNote}
          numberOfLines={4}
          multiline={true}
          onChangeText={handleCustomerNote}
        /> */}
        <Layout style={styles.terms}>
          <Text>
            Sus datos personales se utilizarán para procesar su pedido,
            respaldar su experiencia en este sitio web y para otros fines
            descritos en nuestra [política de privacidad].
          </Text>
          <CheckBox
            style={styles.terms}
            checked={termChecked}
            onChange={nextChecked => setTermChecked(nextChecked)}>
            {Texts()}
          </CheckBox>
        </Layout>
      </Card>
    );
  };

  const renderFooter = React.useCallback(
    () => (
      <Layout>
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
        <PaymentGateway onSelect={handlePaymentSelection} />
        <AdditionalData customerNote={customerNote} />
      </Layout>
    ),
    [
      customerNote,
      handlePaymentSelection,
      cart?.discountTotal,
      cart?.subtotal,
      cart?.subtotalTax,
      cart?.total,
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

  if (products?.length === 0) {
    return (
      <View style={styles.wrapper}>
        <Text>No tiene productos seleccionados</Text>
        <Button onPress={gotoHome}>Ir al Catálogo</Button>
      </View>
    );
  }

  const renderItem = (info: ListRenderItemInfo<GraphQlTypes.CartItem>) => (
    <ListItem
      title={`${info?.item?.product?.node?.name}`}
      description={`${info?.item?.product?.node?.shortDescription}`}
      accessoryLeft={() => renderItemAccessory(info?.item?.quantity)}
      accessoryRight={() => renderItemAPrice(info?.item.total)}
    />
  );

  return React.useMemo(
    () => (
      <Layout style={styles.container} level="2">
        <List
          removeClippedSubviews={false}
          extraData={{customerNote}}
          data={products}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
        />

        <Button
          onPress={handleOrderCreation}
          style={styles.checkoutButton}
          disabled={createOrderInfo.loading || isCartLoading}
          size="medium">
          PROCESAR ORDEN
        </Button>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}
        />
      </Layout>
    ),
    [termChecked],
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
  },
  additionalTitle: {
    marginVertical: 10,
  },
  terms: {
    marginVertical: 10,
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
