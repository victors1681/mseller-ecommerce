import {
  Card,
  Layout,
  Radio,
  RadioGroup,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import * as Graphql from 'app/generated/graphql';
import {usePaymentGateways} from 'app/hooks';
import {LoadingIndicator} from 'app/modules/common';
import React from 'react';
import {CreditCardList} from './CreditCardList';
interface Props {
  onSelect: (
    paymentGateway: Graphql.Maybe<Graphql.PaymentGateway> | undefined,
  ) => void;
  paymentSelected: Graphql.Maybe<Graphql.PaymentGateway> | undefined;
}

export const PaymentGateway: React.FC<Props> = ({
  onSelect,
  paymentSelected,
}) => {
  const {getPaymentsGateways, data, isLoading} = usePaymentGateways();

  const payments = data?.paymentGateways?.nodes;
  const styles = useStyleSheet(themedStyle);

  const handleSelection = React.useCallback(
    (index: number) => {
      const selected = payments && payments[index];
      //callback
      onSelect && onSelect(selected);
    },
    [payments, onSelect],
  );

  /**
   * Get Initial Payments
   */
  React.useEffect(() => {
    getPaymentsGateways();
  }, [getPaymentsGateways]);

  /**
   * Select initial payment by default
   */
  React.useEffect(() => {
    if (payments?.length && !paymentSelected) {
      const selected = payments && payments[0];
      onSelect && onSelect(selected);
    }
  }, [payments?.length, paymentSelected, payments, onSelect]);

  const PaymentDetail = React.useCallback(
    indexSelected => {
      const selected = payments && payments[indexSelected];

      if (!selected) {
        return null;
      }

      if (selected.id === 'carnetpayment') {
        return (
          <Card disabled>
            <Text>{selected.description || ''}</Text>
            <CreditCardList />
          </Card>
        );
      }

      return (
        <Card disabled>
          <Text>{selected.description || ''}</Text>
        </Card>
      );
    },
    [payments],
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const indexSelected = () =>
    payments?.findIndex(i => i?.id === paymentSelected?.id);

  return (
    <Layout>
      <Text category="h6" style={styles.title}>
        Método de Pago
      </Text>
      <Card disabled>
        <Layout>
          <RadioGroup
            selectedIndex={indexSelected()}
            onChange={handleSelection}>
            {payments?.map(payment => (
              <Radio key={payment?.id}>{payment?.title || ''}</Radio>
            ))}
          </RadioGroup>
          {PaymentDetail(indexSelected())}
        </Layout>
      </Card>
    </Layout>
  );
};

export default PaymentGateway;

const themedStyle = StyleService.create({
  title: {
    paddingLeft: 15,
  },
});
