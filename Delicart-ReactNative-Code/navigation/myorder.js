import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import DrawerHeader from "../components/drawerHeader";
import { COLORS } from "../constants/Theme";
import Myorders from "../screens/myorders";
import OrderDetail from "../screens/orderDetail";

import Trackorder from "../screens/trackorder";
import { globalStyles } from "../styles/global";

const screens = {
  Myorders: {
    screen: Myorders,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <DrawerHeader title="My Orders" navigation={navigation} />
        ),
        headerStyle: globalStyles.header,
      };
    },
  },
  Trackorder: {
    screen: Trackorder,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
      title: "Track Order",
    },
  },
  OrderDetail: {
    screen: OrderDetail,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
      title: "Order Details",
    },
  },
};

const MyordersStack = createStackNavigator(screens,{
  defaultNavigationOptions:{
    headerBackTitleVisible:false,
    headerTintColor: COLORS.DEFAULT,
  }
});

export default MyordersStack;
