import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import { AntDesign } from "@expo/vector-icons";
import Api from "../services/Api";
import { Html5Entities } from "html-entities";
import Spinner from "react-native-loading-spinner-overlay";
import RNPaypal from "react-native-paypal-lib";
import { StackActions, NavigationActions } from "react-navigation";
export default function PaymentMethod({ navigation }) {
  const [pay, setPay] = useState([]);
  const [total, setTotal] = useState(0);
  const [loader, setLoader] = useState(true);
  const [symbol, setSymbol] = useState("");
  const [code, setCode] = useState("");
  const updateData = (index) => {
    {
      pay.map((item, index) => {
        item.isSelect = false;
      });
    }
    let qty = pay;
    qty[index]["isSelect"] = !qty[index]["isSelect"];
    setPay([...qty]);
  };
  const api = new Api();
  const getCurrency = async () => {
    let c = await api.getData("currency");
    const entities = new Html5Entities();
    let sy = entities.decode(c.symbol);
    setCode(c.code);
    setSymbol(sy);
  };
  useEffect(() => {
    api
      .getWoo("payment_gateways")
      .then((res) => {
        let arr = [];
        if (res.length > 0) {
          res
            .filter((t) => t.enabled == true)
            .map((item) => {
              item.isSelect == false;
              arr.push(item);
            });
          setPay(arr);
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
    const getTotal = async () => {
      let data = await api.getData("total");
      setTotal(data);
      getCurrency();
    };
    getTotal();
  }, []);
  const createOrder = async () => {
    let find = pay.find((data) => data.isSelect == true);
    let pay_id;
    if (!find) {
      api.showToast("please select payment method");
      return;
    }

    if (find.title == "PayPal") {
      try {
        const d = await RNPaypal.paymentRequest({
          clientId: api.payPalKey,
          environment: RNPaypal.ENVIRONMENT.NO_NETWORK,
          intent: RNPaypal.INTENT.SALE,
          price: parseFloat(total),
          currency: code,
          description: `Delicart`,
          acceptCreditCards: true,
        });
        pay_id = d.response.id;
      } catch (error) {
        api.showToast(error.message);
        return;
      }
    }

    let add = await api.getData("address");
    let selAdd = add.find((e) => e.value == true);
    let discount = await api.getData("coupon");

    let disArr = [];
    if (discount) {
      let disTotal = await api.getData("discountTotal");
      let obj = {
        code: discount.code,
        id: discount.id,
        amount: disTotal,
      };
      disArr.push(obj);
    }

    let cart = await api.getData("Cart");
    let id = await api.getData("id");

    let cartArray = [];
    cart.map((item) => {
      cartArray.push({
        quantity: item.qty,
        product_id: item.product_id,
      });
    });

    const data = {
      payment_method: find.title,
      payment_method_title: find.title,
      set_paid: find.title == pay_id ? true : false,
      customer_id: id.id,
      billing: {
        address_1: selAdd.detail,
      },
      coupon_lines: disArr,
      shipping: {},
      transaction_id: pay_id,
      line_items: cartArray,
    };
    setLoader(true);
    api
      .postWoo("orders", data)
      .then((res) => {
        setLoader(false);
        api.removeValue("Cart");
        api.removeValue("coupon");
        api.removeValue("discountTotal");
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "Home" })],
        });
        navigation.dispatch(resetAction);
        navigation.navigate("Success");
      })
      .catch((error) => {
        setLoader(false);
        console.log("res err", error);
      });
  };

  return (
    <View style={globalStyles.container}>
      {loader ? (
        <Spinner visible={loader} color={COLORS.PRIMARY} />
      ) : (
        <ScrollView>
          <View style={styles.mainContain}>
            {pay.map((item, index) => {
              return (
                <TouchableWithoutFeedback onPress={() => updateData(index)}>
                  <View style={styles.card} key={item.index}>
                    <View style={styles.pay}>
                      {item.img ? <View style={styles.circle}> </View> : null}

                      <Text>{item.title}</Text>
                    </View>
                    <View>
                      {item.isSelect ? (
                        <AntDesign
                          name="checkcircle"
                          size={20}
                          color={COLORS.CHECKGREEN}
                        />
                      ) : (
                        <View style={styles.unchecked}></View>
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      )}

      {loader ? (
        <Spinner visible={loader} color={COLORS.PRIMARY} />
      ) : (
        <View style={[globalStyles.footerBtn, styles.footer]}>
          <View>
            <Text style={styles.totalLbl}>Total Pay</Text>
            <Text style={styles.total}>
              {symbol}
              {total}
            </Text>
          </View>

          <TouchableOpacity onPress={createOrder}>
            <View style={styles.payNow}>
              <Text style={styles.nowLbl}>Pay Now</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContain: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 15,
    height: 73,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
    marginVertical: 10,
  },
  pay: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    height: 52,
    width: 52,
    borderRadius: 52 / 2,
    backgroundColor: COLORS.CIRCLE,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 25,
  },
  unchecked: {
    height: 21,
    width: 21,
    borderRadius: 21 / 2,
    backgroundColor: COLORS.GRAY,
  },
  totalLbl: {
    fontSize: 10,
    color: COLORS.WHITE,
    fontFamily: "sf-regular",
  },
  total: {
    fontSize: 17,
    color: COLORS.WHITE,
    fontFamily: "sf-bold",
  },
  payNow: {
    width: 89,
    height: 41,
    backgroundColor: COLORS.WHITE,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  nowLbl: {
    fontSize: 17,
    color: COLORS.PRIMARY,
    fontFamily: "sf-regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
});
