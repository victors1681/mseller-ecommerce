import {
  Card,
  Layout,
  StyleService,
  Text,
  Button,
  useStyleSheet,
} from '@ui-kitten/components';
import * as Graphql from 'app/generated/graphql';
import {useCreditCard} from 'app/hooks';
import {Error, Loading} from 'app/modules/common';
import {CreditCardIcon, Check} from './icons';
import React from 'react';
import {expirationCardFormat} from 'app/utils';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveDefaultCreditCard = async (
  value: Graphql.Maybe<string> | undefined,
) => {
  if (value) {
    await AsyncStorage.setItem('TrxToken', value);
  }
};

const getDefaultCreditCard = async () => {
  const toke = await AsyncStorage.getItem('TrxToken');
  return toke;
};
export const CreditCardList: React.FC = () => {
  //Store the creditCard token in the customer context api
  const [creditCardSelected, setCreditCardSelection] = React.useState<
    Graphql.Maybe<string> | undefined
  >();

  const styles = useStyleSheet(themedStyle);
  const {
    getCardNetCustomer,
    cardNetCustomerInfo: {isLoading, data, error},
  } = useCreditCard();

  const selectDefaultCreditCard = React.useCallback(async () => {
    if (!creditCardSelected && data?.paymentProfiles?.length) {
      //Try to get the default card saved if not select the first one

      const token = await getDefaultCreditCard();
      if (token) {
        const tokenFound = data?.paymentProfiles.find(c => c?.token === token);
        if (tokenFound) {
          setCreditCardSelection(tokenFound.token);
        }
      } else {
        const firstCreditCard = data?.paymentProfiles[0];
        if (firstCreditCard) {
          setCreditCardSelection(firstCreditCard.token);
        }
      }
    }
  }, [creditCardSelected, data?.paymentProfiles, setCreditCardSelection]);
  /**
   * Select the first creditcard token is there any
   */
  React.useEffect(() => {
    selectDefaultCreditCard();
  }, [
    creditCardSelected,
    data?.paymentProfiles,
    data?.paymentProfiles?.length,
    selectDefaultCreditCard,
    setCreditCardSelection,
  ]);

  const handleSelection = (token: Graphql.Maybe<string> | undefined) => {
    setCreditCardSelection(token);
    saveDefaultCreditCard(token);
  };

  const selectedCard = React.useCallback(
    () => data?.paymentProfiles?.find(c => c?.token === creditCardSelected),
    [creditCardSelected, data?.paymentProfiles],
  );

  const CreditCards = () =>
    data?.paymentProfiles?.map(c => {
      const selectedToken = selectedCard()?.token;
      return (
        <Card
          key={c?.token}
          status={(selectedToken === c?.token ? 'primary' : null) as any}
          style={styles.cardLayout}
          onPress={() => handleSelection(c?.token)}>
          <View style={styles.cardRow}>
            <CreditCardIcon style={styles.icon} />
            <View>
              <Text category="s1">{c?.cardOwner || ''}</Text>
              <View style={styles.cardRow}>
                <Text>{c?.last4 || ''}</Text>
                <Text style={styles.cardTextSpace}>|</Text>
                <Text style={styles.cardTextSpace}>
                  {expirationCardFormat(c?.expiration) || ''}
                </Text>
              </View>
            </View>
            <View style={styles.cardCheckIconContainer}>
              {selectedToken === c?.token && <Check style={styles.checkIcon} />}
            </View>
          </View>
        </Card>
      );
    });

  React.useEffect(() => {
    console.log('LOADING PAYMENTTTTTTSS');
    getCardNetCustomer();
  }, []);

  return (
    <Layout style={styles.layout}>
      {error && <Error error={error} />}
      {isLoading && <Loading />}
      {CreditCards()}
      <Button status="success">Agregar Tarjeta</Button>
    </Layout>
  );
};

export default CreditCardList;

const themedStyle = StyleService.create({
  layout: {
    paddingTop: 10,
  },
  title: {
    paddingLeft: 15,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  cardLayout: {
    marginVertical: 8,
    wight: '100%',
  },
  cardTextSpace: {
    paddingLeft: 10,
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    wight: '100%',
  },
  cardCheckIconContainer: {
    flex: 1,
    wight: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  checkIcon: {
    right: 10,
    width: 25,
    height: 25,
  },
});
