import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import Api from "../services/Api";
import { Html5Entities } from "html-entities";

const width = Dimensions.get("window").width - 132;

export default function Cart({ navigation }) {
  const [cart, setCart] = useState([]);
  const [sub, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [state, setState] = useState({ code: "You Have a Coupon to Use" });
  const [symbol, setSymbol] = useState("₹");
  const pressHandler = (item, index) => {
    let qty = cart;
    qty[index]["qty"] = qty[index]["qty"] + 1;
    setCart([...qty]);
    finalSub();
  };
  const minusHandler = (index) => {
    let qty = cart;
    if (qty[index]["qty"] != 0) {
      qty[index]["qty"] = qty[index]["qty"] - 1;
    }
    setCart([...qty]);
    finalSub();
  };

  const a = new Api();
  const finalSub = async () => {
    let sum = 0;
    cart.map((item) => {
      sum += item.price * item.qty;
    });
    setSubtotal(sum);
    finalTotal(sum);
  };
  const finalTotal = (sum) => {
    if (state.code == "You Have a Coupon to Use") {
      setTotal(sum);
    } else {
      if (state.discount_type == "percent") {
        if (total) {
          let d = total * state.amount;
          let p = d / 100;
          setDiscount(p);
          let grandTotal = sum - discount;
          setTotal(grandTotal);
        }
      } else {
        if (total) {
          setDiscount(state.amount);
          let grandTotal = sum - discount;
          setTotal(grandTotal);
        }
      }
    }
  };
  const getCurrency = async () => {
    let c = await a.getData("currency");
    const entities = new Html5Entities();
    let sy = entities.decode(c.symbol);
    setSymbol(sy);
  };
  const onSelect = (data) => {
    setState({ ...data.selected });
    finalSub();
  };
  useEffect(() => {
    const getCart = async () => {
      let copy = await a.getData("Cart");
      if (copy.length > 0) {
        setCart([...copy]);
      } else {
        setCart([]);
      }
    };
    getCart();
    getCurrency();
  }, []);
  useEffect(() => {
    finalSub();
  }, [cart]);
  useEffect(() => {
    finalSub();
  }, [state.code]);

  const setAddress = async () => {
    let isLogin = await a.getData("token");
    if (isLogin) {
      a.storeData("total", total.toFixed(2));
      let arr = [];
      cart.map((i) => {
        if (i.qty != 0) {
          arr.push(i);
        }
      });
      a.storeData("Cart", arr);
      if (state.amount) {
        a.storeData("coupon", state);
        a.storeData("discountTotal", discount.toFixed(2));
      }
      navigation.navigate("Address");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={globalStyles.container}>
      {cart.length == 0 ? (
        <View style={styles.cartImg}>
          <Image source={require("../assets/imgs/emty-cart.png")}></Image>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.mainContain}
        >
          {cart.map((item, index) => {
            return (
              <View style={styles.cartContain} key={item.product_id}>
                <View style={styles.imgContain}>
                  <Image
                    source={{
                      uri: item.img,
                    }}
                    style={{ height: 80, width: 80 }}
                  />
                </View>
                <View style={styles.dataContain}>
                  <Text numberOfLines={2} style={styles.name}>
                    {item.name}
                  </Text>

                  <View style={styles.cartBottom}>
                    <Text style={styles.price}>
                      {symbol}
                      {item.price}
                    </Text>
                    <View style={styles.cartBtn}>
                      <TouchableOpacity onPress={() => minusHandler(index)}>
                        <AntDesign name="minus" size={20} color="black" />
                      </TouchableOpacity>
                      <Text>{item.qty}</Text>
                      <TouchableOpacity
                        onPress={() => pressHandler(item, index)}
                      >
                        <AntDesign name="plus" size={20} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
          <View style={styles.coupon}>
            <Text style={styles.infoLbl}>{state.code}</Text>

            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Offer", { onSelect: onSelect })
                }
              >
                <Text style={[styles.infoLbl, styles.applyBtn]}>Apply It</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.totalContain}>
            {cart.map((item) => {
              return (
                <View style={styles.itemContain} key={item.product_id}>
                  <Text style={styles.textContain}>
                    <Text style={[styles.detailLbl, styles.infoLbl]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.infoLbl, styles.applyBtn]}>
                      x {item.qty}
                    </Text>
                  </Text>
                  <Text style={styles.itemPrice}>
                    {symbol}
                    {(item.qty * item.price).toFixed(2)}
                  </Text>
                </View>
              );
            })}
            <View style={styles.subtotal}>
              <Text style={styles.infoLbl}>Subtotal</Text>
              <Text style={styles.itemPrice}>
                {symbol}
                {sub.toFixed(2)}
              </Text>
            </View>
            <View style={styles.subtotal}>
              <Text style={styles.infoLbl}>Discount</Text>
              <Text style={styles.itemPrice}>
                {symbol}
                {discount.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.subtotal, styles.grandtotal]}>
              <Text style={[styles.infoLbl, styles.applyBtn]}>Grand Total</Text>
              <Text style={[styles.itemPrice, styles.applyBtn]}>
                {symbol}
                {total.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
      {cart.length == 0 ? null : (
        <TouchableWithoutFeedback onPress={setAddress}>
          <View style={globalStyles.footerBtn}>
            <Text style={globalStyles.footerLbl}>Continue</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cartContain: {
    backgroundColor: COLORS.WHITE,
    height: 125,
    flexDirection: "row",
    borderRadius: 15,
    marginVertical: 8,
  },
  mainContain: {
    paddingHorizontal: 16,
  },
  dataContain: {
    justifyContent: "center",
    width: width,
    paddingHorizontal: 10,
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
  },
  cartBottom: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cartBtn: {
    width: 76,
    height: 36,
    borderRadius: 9,
    backgroundColor: COLORS.LIGHTGRAY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  coupon: {
    height: 60,
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    borderRadius: 15,
    borderStyle: "dashed",
    backgroundColor: COLORS.LIGHTBLUE,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  infoLbl: {
    fontFamily: "sf-regular",
    color: COLORS.COUPANLBL,
    fontSize: 15,
  },
  applyBtn: {
    color: COLORS.PRIMARY,
  },
  totalContain: {
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    padding: 16,
    justifyContent: "space-between",
    flex: 1,
    marginBottom: 80,
  },
  detailLbl: {
    color: COLORS.DARKGRAY,
  },
  itemContain: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
  cartImg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
