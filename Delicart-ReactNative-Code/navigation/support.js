import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import DrawerHeader from "../components/drawerHeader";

import Support from "../screens/support";
import { globalStyles } from "../styles/global";

const screens = {
  CustomerSupport: {
    screen: Support,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <DrawerHeader title="Customer Support" navigation={navigation} />
        ),
        headerStyle: globalStyles.header,
      };
    },
  },
};

const SupportStack = createStackNavigator(screens);

export default SupportStack;
