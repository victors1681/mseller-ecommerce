import React from 'react';
import {ListRenderItemInfo, View} from 'react-native';
import * as GraphQlTypes from 'app/generated/graphql';
import {useOrders} from 'app/hooks/useOrders';
import moment from 'moment';
import {Loading, Error, Empty} from '../common';
import {
  List,
  ListItem,
  StyleService,
  useStyleSheet,
  Text,
} from '@ui-kitten/components';
import {useFocusEffect} from '@react-navigation/core';

export const Orders = () => {
  const {getOrders, data, error, isLoading} = useOrders();
  const styles = useStyleSheet(themedStyle);

  useFocusEffect(
    React.useCallback(() => {
      getOrders();
    }, [getOrders]),
  );

  const orders = data?.orders.nodes;

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }
  if (!orders?.length) {
    return <Empty message="Aún no cuenta con ninguna orden" />;
  }

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

  const renderItem = (info: ListRenderItemInfo<GraphQlTypes.Order>) => (
    <ListItem
      title={`#${info.item.orderNumber} - ${moment(info.item.date)
        .locale('en-ES')
        .fromNow()}`}
      description={`${info.item.status}`}
      accessoryRight={() => renderItemAPrice(info?.item.total)}
    />
  );

  return (
    <View>
      <List data={orders} renderItem={renderItem} />
    </View>
  );
};

export default Orders;

const themedStyle = StyleService.create({
  controlContainer: {
    borderRadius: 4,
    margin: 4,
    padding: 4,
    minWidth: 95,
    backgroundColor: '#3366FF',
  },
  controlText: {
    textAlign: 'center',
  },
  status: {},
});
