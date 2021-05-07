import React from "react";
import { createStackNavigator } from "react-navigation-stack";

import DrawerHeader from "../components/drawerHeader";
import AddAddress from "../screens/addAddress";
import Profile from "../screens/profile";
import { globalStyles } from "../styles/global";

const screens = {
  Offers: {
    screen: Profile,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <DrawerHeader title="My Account" navigation={navigation} />
        ),
        headerStyle: globalStyles.header,
      };
    },
  },
  AddAddress: {
    screen: AddAddress,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
      title: "Add New Address",
    },
  },
};

const OfferStack = createStackNavigator(screens);

export default OfferStack;
