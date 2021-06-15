import React from 'react';
import {ScrollView} from 'react-native';
import {
  Button,
  Card,
  Layout,
  StyleService,
  useStyleSheet,
  Text,
} from '@ui-kitten/components';
import {useNavigation, useRoute} from '@react-navigation/core';

import {ImageOverlay} from './extra/ImageOverlay';
import moment from 'moment';
import {useOrders} from 'app/hooks';
import {ScreenLinks} from 'app/navigation/ScreenLinks';

export const Congrats = (): React.ReactElement => {
  const navigation = useNavigation();
  const route = useRoute();
  const styles = useStyleSheet(themedStyles);
  const {getOrder, orderInfo} = useOrders();

  const goToMyOrders = React.useCallback((): void => {
    navigation && navigation.navigate(ScreenLinks.HOME);
    navigation && navigation.navigate(ScreenLinks.ORDERS);
  }, [navigation]);

  const {orderId} = route.params as any;

  const order = orderInfo.data?.order;

  React.useEffect(() => {
    getOrder(orderId);
  }, [orderId]);

  const renderBookingFooter = (): React.ReactElement => (
    <Layout>
      <Layout style={styles.itemLayout}>
        <Text style={styles.rentLabel} category="p2">
          Método de Pago
        </Text>
        <Text style={styles.priceLabel} category="h6">
          {order?.paymentMethodTitle || ''}
        </Text>
      </Layout>
      <Button style={styles.button} onPress={goToMyOrders}>
        Mis Ordenes
      </Button>
    </Layout>
  );

  return (
    <ScrollView style={styles.container}>
      <ImageOverlay
        style={styles.image as any}
        source={require('app/assets/images/shopping_completed.jpg')}
      />
      <Card
        style={styles?.bookingCard}
        appearance="filled"
        disabled={true}
        footer={renderBookingFooter}>
        <Text style={styles?.title || ''} category="h6">
          Orden Recibida #{`${order?.orderNumber}`}
        </Text>
        <Layout style={styles.innerCardWrapper}>
          <Layout style={styles.itemLayout}>
            <Text style={styles.rentLabel} category="p2">
              Total de la orden
            </Text>
            <Text style={styles.priceLabel} category="h6">
              {order?.total || ''}
            </Text>
          </Layout>
          <Layout style={styles.itemLayout}>
            <Text style={styles.rentLabel} category="p2">
              Fecha
            </Text>
            <Text style={styles.priceLabel} category="s1">
              {moment(order?.date).format('LLL') || ''}
            </Text>
          </Layout>
        </Layout>
      </Card>
    </ScrollView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'background-basic-color-2',
  },
  button: {
    margin: 20,
  },
  innerCardWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  itemLayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 360,
  },
  bookingCard: {
    marginTop: -80,
    margin: 16,
  },
  title: {
    width: '65%',
  },
  rentLabel: {
    marginTop: 24,
  },
  priceLabel: {
    marginTop: 8,
  },
  cardRight: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  detailsList: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginVertical: 8,
  },
  detailItem: {
    marginHorizontal: 4,
    borderRadius: 16,
  },
  optionList: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginVertical: 8,
  },
  optionItem: {
    marginHorizontal: 4,
    paddingHorizontal: 0,
  },
  description: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionLabel: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  imagesList: {
    padding: 8,
    backgroundColor: 'background-basic-color-2',
  },
  imageItem: {
    width: 180,
    height: 120,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});
