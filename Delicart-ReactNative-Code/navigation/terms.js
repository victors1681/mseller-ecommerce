import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import DrawerHeader from "../components/drawerHeader";
import TermsCondition from "../screens/terms";
import { globalStyles } from "../styles/global";

const screens = {
  Terms: {
    screen: TermsCondition,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <DrawerHeader title="Terms & Conditions" navigation={navigation} />
        ),
        headerStyle: globalStyles.header,
      };
    },
  },
};

const TermsStack = createStackNavigator(screens);

export default TermsStack;
