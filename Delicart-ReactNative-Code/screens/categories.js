import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import SingleItem from "../components/item";
import { COLORS } from "../constants/Theme";
import { Html5Entities } from "html-entities";
import Api from "../services/Api";
import { globalStyles } from "../styles/global";
import Spinner from "react-native-loading-spinner-overlay";

export default function Categories({ navigation }) {
  const [category, setCategory] = useState([]);
  const [symbol, setSymbol] = useState("₹");
  const [loader, setLoader] = useState(true);
  const a = new Api();
  const getCurrency = async () => {
    let c = await a.getData("currency");
    const entities = new Html5Entities();
    let sy = entities.decode(c.symbol);
    setSymbol(sy);
  };
  useEffect(() => {
    a.getWoo("products", { category: navigation.getParam("id") })
      .then((data) => {
        setCategory(data);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
    getCurrency();
  }, []);
  return (
    <View style={globalStyles.container}>
      {loader ? <Spinner visible={loader} color={COLORS.PRIMARY} /> : null}
      {category.length == 0 ? (
        <View style={styles.cartImg}>
          <Image source={require("../assets/imgs/no-data.png")}></Image>
        </View>
      ) : (
        <ScrollView>
          <Text style={styles.categoryLbl}>{navigation.getParam("name")}</Text>

          <View style={styles.mainContain}>
            <FlatList
              data={category}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ProductDetail", { id: item.id })
                  }
                >
                  <SingleItem
                    data={item}
                    key={item.id}
                    images={item.images[0].src}
                    currency={symbol}
                    isLike={false}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
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
  categoryLbl: {
    fontSize: 20,
    fontFamily: "sf-heavy",
    color: COLORS.DEFAULT,
    paddingLeft: 16,
  },
  cartImg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
