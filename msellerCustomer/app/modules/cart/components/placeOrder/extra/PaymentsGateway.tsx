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

interface Props {
  onSelect: (
    paymentGateway: Graphql.Maybe<Graphql.PaymentGateway> | undefined,
  ) => void;
}

export const PaymentGateway: React.FC<Props> = ({onSelect}) => {
  const {getPaymentsGateways, data, isLoading} = usePaymentGateways();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const payments = data?.paymentGateways?.nodes;
  const styles = useStyleSheet(themedStyle);

  const handleSelection = React.useCallback(
    (index: number) => {
      console.log('CHANIGN', index);
      setSelectedIndex(index);
      const selected = payments && payments[index];

      //callback
      onSelect && onSelect(selected);
    },
    [payments, onSelect, setSelectedIndex],
  );

  React.useEffect(() => {
    getPaymentsGateways();
  }, [getPaymentsGateways]);

  const PaymentDetail = React.useCallback(() => {
    const selected = payments && payments[selectedIndex];

    if (!selected) {
      return null;
    }

    return (
      <Card disabled>
        <Text>{selected.description || ''}</Text>
      </Card>
    );
  }, [payments, selectedIndex]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Layout>
      <Text category="h6" style={styles.title}>
        Método de Pago
      </Text>
      <Card disabled>
        <Layout>
          <RadioGroup selectedIndex={selectedIndex} onChange={handleSelection}>
            {payments?.map(payment => (
              <Radio key={payment?.id}>{payment?.title || ''}</Radio>
            ))}
          </RadioGroup>
          {PaymentDetail()}
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
