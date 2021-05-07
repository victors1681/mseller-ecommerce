import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { globalStyles } from "../styles/global";
import { COLORS } from "../constants/Theme";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Api from "../services/Api";
import Spinner from "react-native-loading-spinner-overlay";
export default function Offers({ navigation }) {
  const [coupon, setCoupon] = useState([]);
  const [loader, setLoader] = useState(true);
  const a = new Api();
  const today = new Date();
  useEffect(() => {
    a.getWoo("coupons")
      .then((data) => {
        setCoupon(data);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);
  const verifyCoupon = (item) => {
    const expire = new Date(item.date_expires);
    if (expire < today) {
      a.showToast("this coupon is expired");
    } else {
      navigation.goBack();
      navigation.state.params.onSelect({ selected: item });
    }
  };
  return (
    <View style={globalStyles.container}>
      {loader ? (
        <Spinner visible={loader} color={COLORS.PRIMARY} />
      ) : (
        <View style={styles.mainContain}>
          <FlatList
            data={coupon}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.offer} key={item.id}>
                <View style={styles.detailContain}>
                  <Text style={styles.detail}>{item.description}</Text>
                </View>
                <View style={styles.codeContain}>
                  <Text style={styles.codeLbl}>USE CODE</Text>
                  <TouchableOpacity onPress={() => verifyCoupon(item)}>
                    <View style={styles.codebutton}>
                      <Text style={styles.buttonText}>{item.code}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContain: {
    paddingHorizontal: 16,
  },
  offer: {
    borderRadius: 15,
    backgroundColor: COLORS.OFFER,
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    borderStyle: "dashed",
    flexDirection: "row",
    marginVertical: 16,
    height: 100,
    alignItems: "center",
  },
  detail: {
    fontSize: 15,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  detailContain: {
    width: "60%",
    paddingHorizontal: 16,
  },
  codeContain: {
    width: "40%",
    paddingEnd: 16,
  },
  codeLbl: {
    fontSize: 8,
    fontFamily: "sf-regular",
    color: COLORS.DARKGRAY,
    textAlign: "center",
    marginBottom: 3,
  },
  codebutton: {
    height: 41,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 17,
    color: COLORS.WHITE,
    fontFamily: "sf-regular",
  },
});
