import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Language from "../screens/language";
import { globalStyles } from "../styles/global";

import DrawerHeader from "../components/drawerHeader";

const screens = {
  Language: {
    screen: Language,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <DrawerHeader title="Language" navigation={navigation} />
        ),
        headerStyle: globalStyles.header,
      };
    },
  },
};

const LanguageStack = createStackNavigator(screens);

export default LanguageStack;
