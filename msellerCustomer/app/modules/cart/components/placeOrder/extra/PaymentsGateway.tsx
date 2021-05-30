import {
  Card,
  Layout,
  Radio,
  RadioGroup,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {usePaymentGateways} from 'app/hooks';
import {LoadingIndicator} from 'app/modules/common';
import React from 'react';

interface Props {}

export const PaymentGateway: React.FC = () => {
  const {getPaymentsGateways, data, isLoading} = usePaymentGateways();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const styles = useStyleSheet(themedStyle);

  React.useEffect(() => {
    getPaymentsGateways();
  }, [getPaymentsGateways]);

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
          <RadioGroup
            selectedIndex={selectedIndex}
            onChange={index => setSelectedIndex(index)}>
            {data?.paymentGateways.nodes?.map(payment => (
              <Radio>{payment?.title || ''}</Radio>
            ))}
          </RadioGroup>
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
