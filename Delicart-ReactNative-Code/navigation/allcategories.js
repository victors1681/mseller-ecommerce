import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import DrawerHeader from "../components/drawerHeader";
import { COLORS } from "../constants/Theme";
import AllCategories from "../screens/allCategories";
import Categories from "../screens/categories";
import { globalStyles } from "../styles/global";

const screens = {
  AllCategories: {
    screen: AllCategories,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <DrawerHeader title="Categories" navigation={navigation} />
        ),
        headerStyle: globalStyles.header,
      };
    },
  },
  Categories: {
    screen: Categories,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <DrawerHeader title="Categories" navigation={navigation} />
        ),
        headerStyle: globalStyles.header,
      };
    },
  },
};

const AllCategoriesStack = createStackNavigator(screens,{
  defaultNavigationOptions:{
    headerBackTitleVisible:false,
    headerTintColor: COLORS.DEFAULT,
  }
});

export default AllCategoriesStack;
