import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import DrawerHeader from "../components/drawerHeader";
import About from "../screens/about";
import { globalStyles } from "../styles/global";

const screens = {
  AboutUs: {
    screen: About,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <DrawerHeader title="About Us" navigation={navigation} />
        ),
        headerStyle: globalStyles.header,
      };
    },
  },
};

const AboutStack = createStackNavigator(screens);

export default AboutStack;
