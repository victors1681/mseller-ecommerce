import React from 'react';
import {Text, View} from 'react-native';
import {useOrders} from 'app/hooks/useOrders';
import {Loading, Error} from '../common';

export const Orders = () => {
  const {data, error, isLoading} = useOrders();

  const orders = data?.orders.nodes;

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }
  if (!orders?.length) {
    return <Text>None</Text>;
  }

  return (
    <View>
      <Text>test</Text>
    </View>
  );
};

export default Orders;
