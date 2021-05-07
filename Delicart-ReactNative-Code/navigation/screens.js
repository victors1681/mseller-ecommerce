import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/login";
import Register from "../screens/register";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import Verification from "../screens/verification";
import Home from "../screens/home";
import Wishlist from "../screens/wishlist";
import Categories from "../screens/categories";
import Trackorder from "../screens/trackorder";
import Address from "../screens/address";
import Cart from "../screens/cart";
import Search from "../screens/search";
import Profile from "../screens/profile";
import PaymentMethod from "../screens/paymentMethod";
import Success from "../screens/success";
import ProductDetail from "../screens/productDetail";
import DrawerHeader from "../components/drawerHeader";
import Offers from "../screens/offers";
import AddAddress from "../screens/addAddress";

const screens = {
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <DrawerHeader title="" navigation={navigation} />,
        headerStyle: globalStyles.header,
      };
    },
  },
  Address: {
    screen: Address,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
      title: "Select Address",
    },
  },
  PaymentMethod: {
    screen: PaymentMethod,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
      title: "Select Payment Method",
    },
  },
  MyAccount: {
    screen: Profile,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
    },
  },

  ProductDetail: {
    screen: ProductDetail,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => (
          <DrawerHeader title="ProductDetail" navigation={navigation} />
        ),
        headerStyle: globalStyles.header,
      };
    },
    
  },
  Cart: {
    screen: Cart,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
      title: "Your Cart",
    },
  },
  Search: {
    screen: Search,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
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
  Whishlist: {
    screen: Wishlist,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
      title: "Wishlist",
    },
  },

  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false,
      swipeEnabled: false,
    },
    screenOptions: {
      swipeEnabled: false,
    },
  },
  Success: {
    screen: Success,
    navigationOptions: {
      headerShown: false,
    },
  },
  Register: {
    screen: Register,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
    },
  },
  Verification: {
    screen: Verification,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
    },
  },

  Offer: {
    screen: Offers,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
      title: "Offers",
    },
  },

  AddAddress: {
    screen: AddAddress,
    navigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerFont,
      title: "Add New Address",
    },
  }

};

const HomeStack = createStackNavigator(screens,{
  defaultNavigationOptions:{
    headerBackTitleVisible:false,
    headerTintColor: COLORS.DEFAULT,
  }
});

export default HomeStack;
