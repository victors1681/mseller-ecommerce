import React, { useState } from "react";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { DrawerItem } from "@react-navigation/drawer";
import { createAppContainer } from "react-navigation";
import HomeStack from "./screens";
import MyordersStack from "./myorder";
import OfferStack from "./offer";
import AllCategoriesStack from "./allcategories";
import AboutStack from "./about";
import TermsStack from "./terms";
import PolicyStack from "./policy";
import SupportStack from "./support";
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { globalStyles } from "../styles/global";
import Constants from "expo-constants";
import { COLORS } from "../constants/Theme";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Api from "../services/Api";
import { store } from "../styles/shared";


const RootDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Entypo name="home" size={20} color={tintColor} />
        ),
      },
    },
    AllCategories: {
      screen: AllCategoriesStack,
      navigationOptions: {
        title: "Shop By Category",
        drawerIcon: ({ tintColor }) => (
          <FontAwesome name="shopping-bag" size={20} color={tintColor} />
        ),
      },
    },
    MyOrders: {
      screen: MyordersStack,
      navigationOptions: ({ navigation }) => {
        return {
          drawerIcon: ({ tintColor }) => (
            <FontAwesome name="shopping-cart" size={20} color={tintColor} />
          ),
        };
      },
    },
    Support: {
      screen: SupportStack,
      navigationOptions: {
        title: "Customer Supports",
        drawerIcon: ({ tintColor }) => (
          <MaterialCommunityIcons
            name="call-split"
            size={20}
            color={tintColor}
          />
        ),
      },
    },
    Profile: {
      screen: OfferStack,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <FontAwesome name="user" size={20} color={tintColor} />
        ),
      },
    },

    About: {
      screen: AboutStack,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Entypo name="info-with-circle" size={20} color={tintColor} />
        ),
      },
    },
    Term: {
      screen: TermsStack,
      navigationOptions: {
        title: "Terms & Conditions",
        drawerIcon: ({ tintColor }) => (
          <Octicons name="checklist" size={20} color={tintColor} />
        ),
      },
    },
    PrivacyPolicy: {
      screen: PolicyStack,
      navigationOptions: {
        title: "Privacy Policy",
        drawerIcon: ({ tintColor }) => (
          <Ionicons name="md-list-box" size={20} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: "Home",
    contentComponent: CustomDrawerContent,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    edgeWidth: 10,
    drawerToggleRoute: "DrawerToggle",
    contentOptions: {
      inactiveBackgroundColor: COLORS.WHITE,
      activeBackgroundColor: COLORS.WHITE,
      activeTintColor: COLORS.PRIMARY,
      inactiveTintColor: COLORS.DEFAULT,
    },
  }
);

export default createAppContainer(RootDrawerNavigator);

function CustomDrawerContent(props) {
  const a = new Api();
  const text = store.useState((s) => s.name) || "Guest";
  return (
    <View style={[globalStyles.container, styles.mainContain]}>
      <TouchableWithoutFeedback>
        <View style={styles.imgContainer}>
          <Image
            source={require("../assets/imgs/static.png")}
            style={styles.profileImg}
          />
          <Text style={styles.name}>{text}</Text>
        </View>
      </TouchableWithoutFeedback>

      <DrawerItems {...props} />
      {text != "Guest" ? (
        <DrawerItem
          label="Log Out"
          icon={logout}
          labelStyle={{
            fontFamily: "sf-regular",
            color: COLORS.DEFAULT,
            fontFamily: "sf-semibold",
          }}
          style={{
            backgroundColor: COLORS.WHITE,
          }}
          onPress={() => {
            if (a.getData("Cart")) {
              a.removeValue("Cart");
            }
            if (a.getData("token")) {
              a.removeValue("token");
            }
            if (a.getData("address")) {
              a.removeValue("address");
            }
            if (a.getData("id")) {
              a.removeValue("id");
            }
            if (a.getData("wishlist")) {
              a.removeValue("wishlist");
            }
            a.getToken();
            props.navigation.navigate("Login");
          }}
        />
      ) : null}
    </View>
  );
}

const logout = () => {
  return <MaterialCommunityIcons name="logout" size={20} color="black" />;
};
const styles = StyleSheet.create({
  mainContain: {
    paddingTop: Constants.statusBarHeight,
  },
  imgContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  profileImg: {
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
    marginEnd: 16,
  },
  name: {
    fontSize: 17,
    color: COLORS.DEFAULT,
    fontFamily: "sf-heavy",
  },
  title: {
    fontSize: 15,
    color: COLORS.MENU,
    fontFamily: "sf-regular",
  },
  header: {
    justifyContent: "flex-end",
    width: "100%",
  },
});
