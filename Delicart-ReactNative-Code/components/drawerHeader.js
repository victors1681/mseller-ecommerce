import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  View,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { globalStyles } from "../styles/global";
import { COLORS } from "../constants/Theme";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
const width = Dimensions.get("window").width - 32;
console.log("width", Dimensions.get("window").width);
export default function DrawerHeader({ navigation, title }) {
  const [show, isShow] = useState(false);
  return (
    <View style={styles.header}>
      <View style={styles.titleContain}>
        {title == "ProductDetail" ||
        navigation.state.routeName == "Categories" ? null : (
          <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
            <Entypo
              name="menu"
              size={24}
              color={COLORS.DEFAULT}
              style={styles.menuIc}
            />
          </TouchableWithoutFeedback>
        )}
        {title == "ProductDetail" ? null : (
          <Text style={globalStyles.headerFont}>{title}</Text>
        )}
      </View>
      {title == "" || title == "ProductDetail" || title == "Categories" ? (
        <View style={styles.btnContain}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Search")}
          >
            <Feather name="search" size={24} color={COLORS.DEFAULT} />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Whishlist")}
          >
            <FontAwesome
              name="heart-o"
              size={24}
              color={COLORS.DEFAULT}
              style={styles.heartIc}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigation.navigate("Cart")}>
            <AntDesign name="shoppingcart" size={24} color={COLORS.DEFAULT} />
          </TouchableWithoutFeedback>
        </View>
      ) : null}
      {/* {title == "My Orders" ? (
        <View style={styles.btnContain}>
          <Popover
            isVisible={show}
            placement={PopoverPlacement.BOTTOM}
            backgroundStyle={{ opacity: 0.1 }}
            onRequestClose={() => isShow(false)}
            from={
              <TouchableOpacity onPress={() => isShow(true)}>
                <Feather
                  name="more-vertical"
                  size={20}
                  color={COLORS.DEFAULT}
                />
              </TouchableOpacity>
            }
          >
            <View style={styles.popoverContain}>
              <Text style={styles.popLbl}>Clear Past History</Text>
            </View>
          </Popover>
        </View>
      ) : null} */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: Platform.OS == "ios" ? width : "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContain: { flexDirection: "row" },
  menuIc: {
    marginEnd: 16,
  },
  heartIc: {
    marginHorizontal: 16,
  },
  btnContain: {
    flexDirection: "row",
  },
  popoverContain: {
    borderRadius: 7,
    padding: 16,
    width: 164,
    height: 51,
    alignItems: "center",
  },
  popLbl: {
    fontSize: 15,
    color: COLORS.RED,
    fontFamily: "sf-regular",
  },
});
