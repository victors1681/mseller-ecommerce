import React from 'react';
import {Image, ListRenderItemInfo, View} from 'react-native';
import {
  Button,
  Card,
  Layout,
  List,
  Radio,
  RadioGroup,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {CreditCardIcon, MoreVerticalIcon, getLogo} from './extra/icons';
import {PaymentCard} from './extra/data';
import {useNavigation} from '@react-navigation/core';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import {useCreditCard, useCustomer} from 'app/hooks';
import {Loading} from '../common';
import {Maybe, PaymentProfiles} from 'app/generated/graphql';

export const Payments = (): React.ReactElement => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const navigation = useNavigation();
  const styles = useStyleSheet(themedStyles);

  const {updateToken} = useCustomer();
  const {getCardNetCustomer, cardNetCustomerInfo} = useCreditCard();

  const creditCards =
    cardNetCustomerInfo?.data?.cardnetCustomer.paymentProfiles;
  React.useEffect(() => {
    updateToken();
    getCardNetCustomer({
      variables: {
        customerId: 17395,
      },
    });
  }, []);

  const onBuyButtonPress = (): void => {
    navigation && navigation.goBack();
  };

  const onPlaceholderCardPress = (): void => {
    navigation && navigation.navigate(ScreenLinks.CREDIT_CARD);
  };

  const renderHeader = (): React.ReactElement => (
    <React.Fragment>
      <Text category="h6">{`Método de pago seleccionado: ${
        selectedIndex + 1
      }`}</Text>
      <RadioGroup
        selectedIndex={selectedIndex}
        onChange={index => setSelectedIndex(index)}>
        <Radio>Efectivo</Radio>
        <Radio>Tarjeta de crédito</Radio>
      </RadioGroup>
    </React.Fragment>
  );
  const renderFooter = (): React.ReactElement => (
    <Card style={styles.placeholderCard} onPress={onPlaceholderCardPress}>
      <CreditCardIcon {...styles.creditCardIcon} />
      <Text appearance="hint" category="s1">
        Agregar Nueva Tarjeta
      </Text>
    </Card>
  );

  const renderCardItem = (
    info: ListRenderItemInfo<Maybe<Maybe<PaymentProfiles>>>,
  ): React.ReactElement => (
    <View style={info.item?.enabled ? styles.cardItem : styles.disabledCard}>
      <View style={styles.cardLogoContainer}>
        <Image style={styles.cardLogo} source={getLogo(info?.item?.brand)} />
        <Button
          style={styles.cardOptionsButton}
          appearance="ghost"
          status="control"
          accessoryLeft={MoreVerticalIcon}
        />
      </View>
      <Text style={styles.cardNumber} category="h6" status="control">
        {`**** **** **** ${info.item?.last4}`}
      </Text>
      <View style={styles.cardNameContainer}>
        <Text style={styles.cardDetailsLabel} category="p2" status="control">
          Titular
        </Text>
        <Text category="s1" status="control">
          {info.item?.cardOwner || ''}
        </Text>
      </View>
      <View style={styles.cardExpirationContainer}>
        <Text style={styles.cardDetailsLabel} category="p2" status="control">
          Fecha de expiración
        </Text>
        <Text category="s1" status="control">
          {info.item?.expiration || ''}
        </Text>
      </View>
    </View>
  );

  return (
    <React.Fragment>
      <List
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={creditCards}
        renderItem={renderCardItem}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          (cardNetCustomerInfo.isLoading && <Loading />) || null
        }
        // ListHeaderComponent={renderHeader}
      />
    </React.Fragment>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  cardItem: {
    margin: 8,
    height: 192,
    padding: 24,
    borderRadius: 4,
    backgroundColor: 'color-primary-default',
  },
  disabledCard: {
    margin: 8,
    height: 192,
    padding: 24,
    borderRadius: 4,
    backgroundColor: 'color-danger-600',
  },
  cardLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLogo: {
    height: 24,
    width: 75,
  },
  cardOptionsButton: {
    position: 'absolute',
    right: -16,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  cardNumber: {
    marginVertical: 24,
  },
  cardDetailsLabel: {
    marginVertical: 4,
  },
  cardNameContainer: {
    position: 'absolute',
    left: 24,
    bottom: 24,
  },
  cardExpirationContainer: {
    position: 'absolute',
    right: 24,
    bottom: 24,
  },
  placeholderCard: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 192,
    margin: 8,
    backgroundColor: 'background-basic-color-3',
  },
  creditCardIcon: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    fill: 'text-hint-color',
  },
  buyButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});

export default Payments;
