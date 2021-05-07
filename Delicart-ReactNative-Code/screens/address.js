import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import FAB from "react-native-fab";
import Api from "../services/Api";
const width = Dimensions.get("window").width - 104;
export default function Address({ navigation }) {
  const [address, setAddress] = useState([]);
  const updateData = (index) => {
    {
      address.map((item, index) => {
        item.value = false;
      });
    }
    let qty = address;
    qty[index]["value"] = !qty[index]["value"];
    setAddress([...qty]);
  };
  const [isLoading, setLoading] = useState(true);
  const api = new Api();

  const getAddress = async () => {
    let copy = await api.getData("address");
    if (copy) {
      if (copy.length > 0) {
        console.log("add", address);
        setAddress([...copy]);
      } else {
        setAddress([]);
      }
    } else {
    }
  };
  useEffect(() => {
    getAddress();
  }, []);
  const onSelect = (data) => {
    getAddress();
  };
  return (
    <View style={globalStyles.container}>
      {address.length == 0 ? (
        <View style={styles.cartImg}>
          <Image source={require("../assets/imgs/no-data.png")}></Image>
        </View>
      ) : (
        <FlatList
          data={address}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback onPress={() => updateData(index)}>
              <View style={styles.card} key={item.id}>
                <Text style={styles.title}>{item.type}</Text>
                <View style={styles.mainContain}>
                  <View style={styles.radioContain}>
                    {item.value ? (
                      <Image
                        source={require("../assets/imgs/radio.png")}
                        style={styles.checkIc}
                      />
                    ) : (
                      <Image
                        source={require("../assets/imgs/unradio.png")}
                        style={styles.checkIc}
                      />
                    )}
                  </View>
                  <View style={styles.labelContain}>
                    <Text style={styles.label}>{item.detail}</Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      )}

      <TouchableWithoutFeedback
        onPress={() => {
          if (address.length == 0) {
            api.showToast("please add address");
            return;
          }

          navigation.navigate("PaymentMethod");
        }}
      >
        <View style={globalStyles.footerBtn}>
          <Text style={globalStyles.footerLbl}>Proceed to Pay</Text>
        </View>
      </TouchableWithoutFeedback>
      <FAB
        buttonColor={COLORS.PRIMARY}
        iconTextColor="#FFFFFF"
        onClickAction={() => {
          navigation.navigate("AddAddress", { onSelect: onSelect });
        }}
        visible={true}
        snackOffset={50}
        iconTextComponent={<Ionicons name="md-add" size={24} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 16,
    padding: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 15,
    color: COLORS.DEFAULT,
    fontFamily: "sf-semibold",
    marginBottom: 7,
    marginStart: 55,
  },
  radioContain: {
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 13,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-regular",
  },
  mainContain: {
    flexDirection: "row",
  },
  labelContain: {
    width: width,
    paddingStart: 15,
  },
  checkIc: {
    height: 26,
    width: 26,
  },
  cartImg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
