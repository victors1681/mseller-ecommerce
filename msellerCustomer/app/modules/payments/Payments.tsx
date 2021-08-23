import React from 'react';
import {
  Alert,
  Image,
  ListRenderItemInfo,
  TouchableHighlight,
  View,
} from 'react-native';
import {
  Button,
  Card,
  List,
  MenuItem,
  OverflowMenu,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {
  CreditCardIcon,
  MoreVerticalIcon,
  getLogo,
  DeleteIcon,
  CheckIcon,
  CheckDefaultIcon,
} from './extra/icons';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import {useCreditCard} from 'app/hooks';
import {Loading} from '../common';
import {Maybe, PaymentProfiles} from 'app/generated/graphql';
import {
  getDefaultCreditCard,
  saveDefaultCreditCard,
} from 'app/utils/creditCardTokenHandler';
import Toast from 'react-native-toast-message';
import DialogInput from 'react-native-dialog-input';

export const Payments = (): React.ReactElement => {
  const navigation = useNavigation();
  const styles = useStyleSheet(themedStyles);
  const [creditCardSelected, setCreditCardSelection] = React.useState<
    Maybe<string> | undefined
  >();
  const [activationCardModal, setActivationCardModal] = React.useState<
    Maybe<Maybe<PaymentProfiles>> | undefined
  >();

  const [menuVisible, setMenuVisible] = React.useState<{
    [key: number]: boolean;
  }>({});

  const showMenu = (id: any) => {
    setMenuVisible(prev => ({...prev, [id]: true}));
  };

  const hideMenu = (id: any) => {
    setMenuVisible(prev => ({...prev, [id]: false}));
  };
  const {
    getCardNetCustomer,
    cardNetCustomerInfo,
    removeCreditCard,
    activateCreditCard,
    activationInfo,
  } = useCreditCard();

  const creditCards = cardNetCustomerInfo?.data?.paymentProfiles;

  const selectDefaultCreditCard = React.useCallback(async () => {
    if (!creditCardSelected && creditCards && creditCards.length) {
      //Try to get the default card saved if not select the first one

      const token = await getDefaultCreditCard();
      if (token) {
        const tokenFound = creditCards.find(c => c?.token === token);
        if (tokenFound) {
          setCreditCardSelection(tokenFound.token);
        }
      } else {
        const firstCreditCard = creditCards[0];
        if (firstCreditCard) {
          setCreditCardSelection(firstCreditCard.token);
        }
      }
    }
  }, [creditCardSelected, creditCards, setCreditCardSelection]);

  React.useEffect(() => {
    selectDefaultCreditCard();
  }, [selectDefaultCreditCard, creditCards?.length]);

  useFocusEffect(
    React.useCallback(() => {
      /**
       * If cardNetCustomerId exist fetch the creditcars
       */
      getCardNetCustomer();
    }, []),
  );

  const isLoading = activationInfo.loading || cardNetCustomerInfo.isLoading;

  const performCreditCardRemoval = async (
    cardInfo: Maybe<Maybe<PaymentProfiles>>,
  ) => {
    const paymentProfileId = cardInfo?.paymentProfileId;
    if (paymentProfileId) {
      const response = await removeCreditCard(paymentProfileId);

      if (response) {
        Toast.show({
          type: 'success',
          text1: 'Tarjeta de Crédito Elimidana',
        });
      }
    }
  };

  const createTwoButtonAlert = (cardInfo: Maybe<Maybe<PaymentProfiles>>) => {
    const actions = [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {text: 'Si', onPress: () => performCreditCardRemoval(cardInfo)},
    ] as any;

    Alert.alert(
      'Eliminar Tarjeta',
      `Seguro que deseas eliminar la tarjeta termial en ${cardInfo?.last4}`,
      actions,
    );
  };
  const onPlaceholderCardPress = (): void => {
    navigation && navigation.navigate(ScreenLinks.CREDIT_CARD);
  };

  const renderFooter = (): React.ReactElement => (
    <Card style={styles.placeholderCard} onPress={onPlaceholderCardPress}>
      <CreditCardIcon {...styles.creditCardIcon} />
      <Text appearance="hint" category="s1">
        Agregar Nueva Tarjeta
      </Text>
    </Card>
  );

  const renderToggleButton = (id: Maybe<number> | undefined) => (
    <Button
      style={styles.cardOptionsButton}
      appearance="ghost"
      status="control"
      accessoryLeft={MoreVerticalIcon}
      onPress={() => showMenu(id)}
    />
  );

  const handleSelection = (token: Maybe<string> | undefined) => {
    setCreditCardSelection(token);
    saveDefaultCreditCard(token);
  };

  const selectedCard = React.useCallback(
    () => creditCards?.find(c => c?.token === creditCardSelected),
    [creditCardSelected, creditCards],
  );

  const activationCardModalView = React.useCallback(() => {
    return (
      <DialogInput
        isDialogVisible={!!activationCardModal}
        title={'Activación de tarjeta de crédito'}
        message={`Activar tarjeta No. ${
          activationCardModal && activationCardModal.last4
        }`}
        hintInput={'Código de activación'}
        cancelText="Cancelar"
        submitText="Activar"
        submitInput={(inputText: string) => {
          if (activationCardModal && activationCardModal.token) {
            activateCreditCard({
              token: activationCardModal.token,
              activationCode: inputText,
            });
            setActivationCardModal(undefined);
          }
        }}
        closeDialog={() => {
          setActivationCardModal(undefined);
        }}
        modalStyle={styles.modal}
      />
    );
  }, [activateCreditCard, activationCardModal, styles.modal]);

  const renderCardItem = (
    info: ListRenderItemInfo<Maybe<Maybe<PaymentProfiles>>>,
  ): React.ReactElement => {
    const selectedToken = selectedCard()?.token;
    const profileId = info.item?.paymentProfileId || 0;
    return (
      <>
        {/* {isError && <Error error={isError} />} */}
        {activationCardModalView()}
        <TouchableHighlight
          onPress={() => handleSelection(info.item?.token)}
          underlayColor="white">
          <View
            style={[
              info.item?.enabled ? styles.cardItem : styles.disabledCard,
              selectedToken !== info.item?.token && styles.opacity,
            ]}>
            <View style={styles.cardLogoContainer}>
              <Image
                style={styles.cardLogo as any}
                source={getLogo(info?.item?.brand)}
              />
              <View style={styles.cardCheckIconContainer}>
                {selectedToken === info.item?.token && (
                  <CheckDefaultIcon style={styles.checkIcon} />
                )}
              </View>
              <OverflowMenu
                anchor={() => renderToggleButton(info.item?.paymentProfileId)}
                visible={menuVisible[profileId] || false}
                onBackdropPress={() => hideMenu(info.item?.paymentProfileId)}>
                <MenuItem
                  accessoryLeft={CheckIcon}
                  title="Activar"
                  onPress={() => {
                    setActivationCardModal(info.item);
                    hideMenu(info.item?.paymentProfileId);
                  }}
                />
                <MenuItem
                  accessoryLeft={DeleteIcon}
                  title="Eliminar"
                  onPress={() => {
                    createTwoButtonAlert(info.item);
                    hideMenu(info.item?.paymentProfileId);
                  }}
                />
              </OverflowMenu>
            </View>
            <Text style={styles.cardNumber} category="h6" status="control">
              {`**** **** **** ${info.item?.last4}`}
            </Text>
            <View style={styles.cardNameContainer}>
              <Text
                style={styles.cardDetailsLabel}
                category="p2"
                status="control">
                Titular
              </Text>
              <Text category="s1" status="control">
                {info.item?.cardOwner || ''}
              </Text>
            </View>
            <View style={styles.cardExpirationContainer}>
              <Text
                style={styles.cardDetailsLabel}
                category="p2"
                status="control">
                Fecha de expiración
              </Text>
              <Text category="s1" status="control">
                {info.item?.expiration || ''}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </>
    );
  };

  return (
    <React.Fragment>
      {isLoading && <Loading fullScreen />}
      <List
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={creditCards}
        renderItem={renderCardItem}
        ListFooterComponent={renderFooter}
      />
    </React.Fragment>
  );
};

const themedStyles = StyleService.create({
  modal: {
    backgroundColor: '#35353575',
  },
  opacity: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  modalButtonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  modalButtonlayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  cardCheckIconContainer: {
    flex: 1,
    wight: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  checkIcon: {
    marginRight: 50,
    width: 25,
    height: 25,
  },
});

export default Payments;
