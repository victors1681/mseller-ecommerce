import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../constants/Theme";
import Api from "../services/Api";
import { globalStyles } from "../styles/global";
import Spinner from "react-native-loading-spinner-overlay";
const width = Dimensions.get("window").width - 132;

export default function OrderDetail({ navigation }) {
  const [item, setItem] = useState({});
  const [sub, setSub] = useState(0);
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState([]);
  const api = new Api();
  const getSubtotal = async () => {
    let sum = 0;
    item.line_items.map((item) => {
      sum += item.price * item.quantity;
    });
    setSub(sum);
  };
  useEffect(() => {
    api
      .getWoo("orders/" + navigation.getParam("id"))
      .then((res) => {
        setItem(res);
        let arr = navigation.getParam("data");
        setData([...arr]);
        setLoader(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoader(false);
      });
  }, []);

  return (
    <View style={globalStyles.container}>
      {loader ? (
        <Spinner visible={loader} color={COLORS.PRIMARY} />
      ) : (
        <ScrollView
          style={styles.mainContain}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.orderId}>Order NO : {item.number}</Text>

          {item.line_items.map((it) => {
            return (
              <View style={styles.card} key={it.id}>
                <View style={styles.imgContain}>
                  {data.map((d) => {
                    if (it.product_id == d.id) {
                      return (
                        <Image
                          source={{
                            uri: d.img,
                          }}
                          style={{ height: 80, width: 80 }}
                        />
                      );
                    }
                  })}
                </View>
                <View style={styles.dataContain}>
                  <Text numberOfLines={2} style={styles.name}>
                    {it.name}
                  </Text>
                  <Text style={styles.price}>
                    {item.currency_symbol}
                    {it.price}
                  </Text>
                  <Text style={styles.date}>
                    Ordered on:{item.date_created}
                  </Text>
                </View>
              </View>
            );
          })}
          <Text style={styles.price}>
            Tracking Details {item.line_items.length}
          </Text>
          <View style={styles.checkoutContain}>
            <View>
              <Text style={styles.orderId}>Your Order is Status</Text>
              <Text style={styles.date}>Ordered on:{item.date_created}</Text>
            </View>
            <Text style={[styles.name, styles.checkoutLbl]}>{item.status}</Text>
          </View>
          <Text style={styles.price}>Billing Details</Text>
          <Text style={styles.payType}>
            Payment {item.payment_method_title}
          </Text>
          <View style={styles.totalContain}>
            {item.line_items.map((it) => {
              return (
                <View style={styles.itemContain}>
                  <Text style={styles.textContain}>
                    <Text style={[styles.infoLbl, styles.detailLbl]}>
                      {it.name}
                    </Text>
                    <Text style={[styles.infoLbl, styles.applyBtn]}>
                      x {it.quantity}
                    </Text>
                  </Text>
                  <Text style={styles.itemPrice}>
                    {item.currency_symbol} {it.price * it.quantity}
                  </Text>
                </View>
              );
            })}
            <View style={[styles.subtotal, styles.grandtotal]}>
              <Text style={[styles.infoLbl, styles.applyBtn]}>Grand Total</Text>
              <Text style={[styles.itemPrice, styles.applyBtn]}>
                {item.currency_symbol} {item.total}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderId: {
    fontSize: 13,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  mainContain: {
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    height: 125,
    flexDirection: "row",
    borderRadius: 15,
    marginVertical: 16,
  },
  imgContain: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  price: {
    fontSize: 15,
    fontFamily: "sf-bold",
    color: COLORS.DEFAULT,
    marginTop: 16,
  },
  date: {
    fontSize: 10,
    fontFamily: "sf-regular",
    color: COLORS.DARKGRAY,
  },
  dataContain: {
    justifyContent: "center",
    width: width,
    paddingHorizontal: 10,
  },
  checkoutContain: {
    borderRadius: 15,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 16,
  },
  checkoutLbl: {
    color: COLORS.PRIMARY,
  },
  payType: {
    fontSize: 13,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-regular",
  },
  totalContain: {
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    padding: 16,
    justifyContent: "space-between",
    flex: 1,
    marginVertical: 16,
  },
  itemContain: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLbl: {
    fontFamily: "sf-regular",
    color: COLORS.COUPANLBL,
    fontSize: 15,
  },
  detailLbl: {
    color: COLORS.DARKGRAY,
  },
  applyBtn: {
    color: COLORS.PRIMARY,
  },
  itemPrice: {
    fontSize: 13,
    color: COLORS.COUPANLBL,
    fontFamily: "sf-bold",
    width: "25%",
    textAlign: "right",
  },
  textContain: {
    width: "75%",
  },
  subtotal: {
    paddingVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    borderStyle: "dashed",
    borderTopColor: COLORS.GRAY,
    borderTopWidth: 2,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    overflow: "hidden",
    marginVertical: 10,
  },
  grandtotal: {
    marginVertical: 0,
    borderWidth: 0,
  },
  apCoupon: {
    color: COLORS.RED,
  },
});
