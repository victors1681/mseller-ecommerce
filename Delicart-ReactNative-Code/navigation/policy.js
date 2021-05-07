import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import DrawerHeader from "../components/drawerHeader";
import PrivacyPolicy from "../screens/privacyPolicy";
import { globalStyles } from "../styles/global";

const screens = {
  PrivacyPolicy: {
    screen: PrivacyPolicy,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <DrawerHeader title="Privacy Policy" navigation={navigation} />
        ),
        headerStyle: globalStyles.header,
      };
    },
  },
};

const PolicyStack = createStackNavigator(screens);

export default PolicyStack;
