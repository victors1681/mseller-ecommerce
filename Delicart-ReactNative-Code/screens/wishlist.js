import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import SingleItem from "../components/item";
import { COLORS } from "../constants/Theme";
import Api from "../services/Api";
import { globalStyles } from "../styles/global";
import { Html5Entities } from "html-entities";
export default function Wishlist({ navigation }) {
  const [wishlist, setWishlist] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [loader, setLoader] = useState(true);
  const [nodata, setNoData] = useState(false);
  const api = new Api();
  const getCurrency = async () => {
    let c = await api.getData("currency");
    const entities = new Html5Entities();
    if (c) {
      let sy = entities.decode(c.symbol);
      setSymbol(sy);
    }
  };
  useEffect(() => {
    let a = [];
    const getData = async () => {
      a = await api.getData("wishlist");

      if (a && a.length > 0) {
        let b = a.join();
        api
          .getWoo("products/", { include: b })
          .then((res) => {
            setWishlist([...res]);
            setLoader(false);
          })
          .catch((error) => {
            console.log(error);
            setLoader(false);
          });
      } else {
        setNoData(true);
        setLoader(false);
      }
    };

    getCurrency();
    getData();
  }, []);
  return (
    <View style={globalStyles.container}>
      {loader ? <Spinner visible={loader} color={COLORS.PRIMARY} /> : null}
      {nodata ? (
        <View style={styles.cartImg}>
          <Image source={require("../assets/imgs/no-data.png")}></Image>
        </View>
      ) : (
        <View style={styles.mainContain}>
          {wishlist.length > 0 ? (
            <FlatList
              data={wishlist}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("ProductDetail")}
                >
                  <SingleItem
                    data={item}
                    key={item.id}
                    images={item.images[0].src}
                    currency={symbol}
                    isLike={true}
                  />
                </TouchableWithoutFeedback>
              )}
            />
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContain: {
    padding: 16,
    paddingBottom: 0,
    flexDirection: "row",
  },
  cartImg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
