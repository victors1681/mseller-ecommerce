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
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {ScreenLinks} from 'app/navigation/ScreenLinks';

export const Orders = () => {
  const navigation = useNavigation();
  const {getOrders, data, error, isLoading} = useOrders();
  const styles = useStyleSheet(themedStyle);

  const onItemPress = (orderId?: string | null): void => {
    navigation && navigation.navigate(ScreenLinks.ORDER_DETAIL, {orderId});
  };

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
      onPress={() => onItemPress(info.item.orderNumber)}
      title={`#${info.item.orderNumber} - ${moment(info.item.date).fromNow()}`}
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
