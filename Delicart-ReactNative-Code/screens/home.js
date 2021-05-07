import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Html5Entities } from "html-entities";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import Spinner from "react-native-loading-spinner-overlay";
import { MyCarousel } from "./slider";
import SingleItem from "../components/item";
import Api from "../services/Api";
import * as SplashScreen from 'expo-splash-screen';

export default function Home({ navigation }) {
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [loader, setLoader] = useState(false);
  const a = new Api();
  const getCurrency = async () => {
    let c = await a.getData("currency");
    const entities = new Html5Entities();
    let sy = entities.decode(c.symbol);
    setSymbol(sy);
  };
  useEffect(() => {
    SplashScreen.hide();
    setLoader(true);
    a.getWoo("products")
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        setLoader(false);
      });
    a.getWoo("products/categories")
      .then((data) => {
        const filterData = data.filter((c) => c.parent == 0);
        setCategory([...filterData]);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
    getCurrency();
  }, []);

  return (
    <View style={globalStyles.container}>
      {loader ? (
        <Spinner visible={loader} color={COLORS.PRIMARY} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {category.length > 0 ? (
            <View style={styles.categoryContainer}>
              <ScrollView
                horizontal={true}
                style={styles.category}
                showsHorizontalScrollIndicator={false}
              >
                {category.map((item) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Categories", {
                          id: item.id,
                          name: item.name,
                        })
                      }
                    >
                      <Text style={styles.categoryLbl} key={item.id}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <View style={{ marginTop: 16 }}>
            <MyCarousel />
          </View>
          <View style={styles.mainLbl}>
            <Text style={styles.info}>Exclusively Available</Text>
          </View>

          {product.length > 0 ? (
            <View style={styles.productContain}>
              <ScrollView
                horizontal={true}
                style={styles.category}
                showsHorizontalScrollIndicator={false}
              >
                {product.map((item) => {
                  return (
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
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          {category.map((c) => {
            return (
              <View>
                <View style={styles.mainLbl}>
                  <Text style={styles.info}>{c.name}</Text>
                </View>
                <View style={styles.productContain}>
                  <ScrollView
                    horizontal={true}
                    style={styles.category}
                    showsHorizontalScrollIndicator={false}
                  >
                    {product
                      .filter((f) => f.categories[0].id == c.id)
                      .map((item) => {
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("ProductDetail", {
                                id: item.id,
                              })
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
                        );
                      })}
                  </ScrollView>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    height: 25,
    marginVertical: 15,
    paddingStart: 16,
  },
  categoryLbl: {
    fontSize: 17,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-medium",
    marginEnd: 16,
  },
  category: {
    flexDirection: "row",
  },
  mainLbl: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  info: {
    fontSize: 20,
    color: COLORS.DEFAULT,
    fontFamily: "sf-bold",
  },
  viewAll: {
    fontSize: 15,
    fontFamily: "sf-semibold",
    color: COLORS.PRIMARY,
  },
  productContain: {
    paddingStart: 16,
    marginTop: 16,
    flexDirection: "row",
  },
});
