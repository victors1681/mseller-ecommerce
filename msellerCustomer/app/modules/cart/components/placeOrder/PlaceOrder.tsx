import React from 'react';
import {Alert, ListRenderItemInfo, View} from 'react-native';
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
  Spinner,
} from '@ui-kitten/components';
import {CheckoutResponse, useCart, useCustomer, useOrders} from 'app/hooks';
import * as GraphQlTypes from 'app/generated/graphql';
import {useNavigation} from '@react-navigation/core';
import {PaymentGateway} from './extra/PaymentsGateway';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import {ApolloError} from '@apollo/client';
import {getDefaultCreditCard} from 'app/utils/creditCardTokenHandler';
import Toast from 'react-native-toast-message';
import {PAYMENT_GATEWAYS} from 'app/modules/cart/components/placeOrder/extra/PaymentsGateway';
/**
 * Custom Hook
 * @returns
 */
const usePlaceOrder = () => {
  const [payment, setPayment] = React.useState<
    GraphQlTypes.Maybe<GraphQlTypes.PaymentGateway> | undefined
  >();
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [termChecked, setTermChecked] = React.useState(false);
  const [customerNote, setCustomerNote] = React.useState('');
  const navigation = useNavigation();

  const {cart, isLoading} = useCart();
  const {createOrder, createOrderInfo} = useOrders();
  const {customer} = useCustomer();

  const products = cart?.contents?.nodes || [];

  const handleCustomerNote = (values: string) => setCustomerNote(values);

  const gotoCongrats = React.useCallback(
    (orderId: GraphQlTypes.Maybe<number> | undefined) => {
      navigation && navigation.navigate(ScreenLinks.CONGRATS, {orderId});
    },
    [navigation],
  );

  const gotoHome = () => {
    navigation && navigation.goBack();
  };

  const handleOrderCreation = React.useCallback(async () => {
    setSubmitting(true);
    if (!customer || !payment) {
      console.error('Customer not found.. is not logged');
      setSubmitting(false);
      return;
    }

    const TrxToken = await getDefaultCreditCard();
    if (!TrxToken && payment?.id === PAYMENT_GATEWAYS.CARTNET) {
      console.error('Error al optener la tarjeta guardada');
      Toast.show({
        type: 'error',
        text1: 'No cuenta con tarjeta de crédito vinculada.',
      });
      setSubmitting(false);
      return;
    }

    const response = await createOrder({
      paymentMethod: payment?.id,
      metaData: [{key: 'TrxToken', value: TrxToken || ''}],
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
      customerNote,
    });

    interface ResponseInterface {
      data: CheckoutResponse;
    }

    const isCreated = (arg: any): arg is ResponseInterface => {
      return arg.data !== undefined;
    };
    const isError = (arg: any): arg is ApolloError => {
      return arg.message !== undefined;
    };

    if (isCreated(response)) {
      setSubmitting(false);
      gotoCongrats(response.data?.checkout?.order?.databaseId);
    } else if (isError(response)) {
      //error
      setSubmitting(false);
      Alert.alert('Error al crear la orden', response.message);
      console.error(response.message);
    }
  }, [customer, payment, createOrder, customerNote, gotoCongrats]);

  return {
    payment,
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
    isSubmitting,
  };
};

/**
 * Screen View
 */

export default (): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);

  const [visible, setVisible] = React.useState(false);

  const {
    cart,
    payment,
    setPayment,
    products,
    termChecked,
    setTermChecked,
    handleOrderCreation,
    customerNote,
    gotoHome,
    createOrderInfo,
    isCartLoading,
    isSubmitting,
  } = usePlaceOrder();

  const handlePaymentSelection = (
    value: GraphQlTypes.Maybe<GraphQlTypes.PaymentGateway> | undefined,
  ) => {
    setPayment(value);
  };

  const AdditionalData = () => {
    const Texts = (): any => {
      return (
        <Text>
          He leído y acepto los
          <Text status="primary"> términos y condiciones</Text> de esta
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

  const renderFooter = () => (
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
      <PaymentGateway
        onSelect={handlePaymentSelection}
        paymentSelected={payment}
      />
      <AdditionalData />
    </Layout>
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
  if (createOrderInfo.loading || isSubmitting) {
    return (
      <View style={styles.wrapper}>
        <Spinner />
      </View>
    );
  }

  const renderItem = (info: ListRenderItemInfo<GraphQlTypes.CartItem>) => (
    <ListItem
      title={`${info?.item?.product?.node?.name || ''}`}
      description={`${info?.item?.product?.node?.shortDescription || ''}`}
      accessoryLeft={() => renderItemAccessory(info?.item?.quantity)}
      accessoryRight={() => renderItemAPrice(info?.item.total)}
    />
  );

  return (
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
