import React, { useState } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SwitchActions } from "react-navigation";
import Images from "../constants/Images";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import { Ionicons } from "@expo/vector-icons";
import { StackActions, NavigationActions } from "react-navigation";

export default function Success({ navigation }) {
  const gotoOrder = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Home" })],
    });
    navigation.dispatch(resetAction);
    navigation.dispatch(SwitchActions.jumpTo({ routeName: "MyOrders" }));
  };
  return (
    <View style={globalStyles.container}>
      <View style={styles.mainContain}>
        <Image source={Images.success} />
        <Text style={styles.mainLbl}>
          Your Order Has Been Placed Successfully!
        </Text>
        <Text style={styles.infoLbl}>
          You can check your orders from my order section anytime
        </Text>
        <TouchableOpacity onPress={gotoOrder}>
          <View style={styles.orderContain}>
            <Text style={styles.orderBtn}>Go To My Orders</Text>
            <Ionicons
              name="ios-arrow-round-forward"
              size={25}
              color={COLORS.PRIMARY}
            />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={() => navigation.popToTop("Home")}>
        <View style={[globalStyles.footerBtn, styles.footer]}>
          <Text style={[globalStyles.footerLbl, styles.continue]}>
            Continue Shopping
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContain: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  mainLbl: {
    fontSize: 20,
    fontFamily: "sf-medium",
    color: COLORS.DEFAULT,
    textAlign: "center",
    marginTop: 50,
  },
  footer: {
    backgroundColor: COLORS.WHITE,
  },
  infoLbl: {
    fontSize: 15,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-regular",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 15,
  },
  continue: {
    color: COLORS.PRIMARY,
  },
  orderBtn: {
    fontSize: 15,
    fontFamily: "sf-regular",
    color: COLORS.PRIMARY,
    marginEnd: 10,
  },
  orderContain: {
    flexDirection: "row",
  },
});
