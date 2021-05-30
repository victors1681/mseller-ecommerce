import React from 'react';
import {Text, View} from 'react-native';
import {
  Button,
  Layout,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components';
import {KeyboardAvoidingView} from './extra/3rd-party';
import {useNavigation} from '@react-navigation/core';
import {Formik, FormikHelpers} from 'formik';
import {addressSchema} from './extra/addressSchema';
import {CustomInput, CustomButtonGroup} from 'app/modules/common/form';
import {LoadingIndicator} from 'app/modules/common';
import {useCustomer, useOrders} from 'app/hooks';

export const Congrats = (): React.ReactElement => {
  const navigation = useNavigation();
  const styles = useStyleSheet(themedStyles);
  const {getOrder, orderInfo} = useOrders();

  const gotoPlaceOrder = React.useCallback((): void => {
    navigation && navigation.navigate('PlaceOrder');
  }, [navigation]);

  console.log('orderInfo', orderInfo.error);

  React.useEffect(() => {
    console.log('Fetching order');
    getOrder('87');
  }, []);

  return (
    <View>
      <Text>Recibimos tu Orden</Text>
      <Text>{orderInfo.data?.order.total}</Text>
    </View>
  );
};

const themedStyles = StyleService.create({
  logo: {
    height: 50,
    marginBottom: 30,
  },
});
