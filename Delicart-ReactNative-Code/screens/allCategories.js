import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { COLORS } from "../constants/Theme";
import Api from "../services/Api";
import { globalStyles } from "../styles/global";
import Spinner from "react-native-loading-spinner-overlay";
const width = (Dimensions.get("window").width - 50) / 2;
const height = Dimensions.get("window").height - 200;
export default function AllCategories({ navigation }) {
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [select, setSelect] = useState(0);
  const [loader, setLoader] = useState(true);
  const api = new Api();
  useEffect(() => {
    api
      .getWoo("products/categories")
      .then((data) => {
        let f = data.filter((c) => c.parent == 0);
        setCategory([...f]);
        if (f.length > 0) {
          let id = f[0].id;
          setSelect(id);
          manageCategory(id);
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);
  const manageCategory = (id) => {
    setLoader(true);
    api
      .getWoo("products/categories")
      .then((res) => {
        let filter = res.filter((r) => r.parent == id);
        setSubcategory([...filter]);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };
  return (
    <View style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal={true}
            style={styles.category}
            showsHorizontalScrollIndicator={false}
          >
            {loader ? (
              <Spinner visible={loader} color={COLORS.PRIMARY} />
            ) : null}

            {category.map((item) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelect(item.id);
                    manageCategory(item.id);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryLbl,
                      item.id == select
                        ? styles.activeCategory
                        : styles.categoryLbl,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {subcategory.length == 0 ? (
          <View style={styles.cartImg}>
            <Image source={require("../assets/imgs/no-data.png")}></Image>
          </View>
        ) : (
          <View style={styles.mainContain}>
            <FlatList
              data={subcategory}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Categories", {
                      id: item.id,
                      name: item.name,
                    })
                  }
                >
                  <View key={index} style={styles.card}>
                    <View style={styles.imgContain}>
                      <Image
                        source={{
                          uri: item.image.src,
                        }}
                        style={{ height: 90, width: 90 }}
                      />
                    </View>
                    <View style={styles.detailContain}>
                      <Text numberOfLines={2} style={styles.detail}>
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Categories", {
                            id: item.id,
                            name: item.name,
                          })
                        }
                      >
                        <Text style={[styles.detail, styles.explore]}>
                          Explore
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    height: 25,
    marginVertical: 15,
    paddingLeft: 16,
  },
  category: {
    flexDirection: "row",
  },
  activeCategory: {
    color: COLORS.PRIMARY,
  },
  categoryLbl: {
    fontSize: 17,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-medium",
    marginEnd: 16,
  },
  card: {
    width: width,
    marginRight: 18,
    marginBottom: 20,
  },
  imgContain: {
    height: width,
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainContain: {
    padding: 16,
    paddingBottom: 0,
    flexDirection: "row",
  },
  detailContain: {
    marginTop: 10,
    alignItems: "center",
  },
  detail: {
    fontSize: 13,
    fontFamily: "sf-regular",
    color: COLORS.DEFAULT,
    textAlign: "center",
  },
  explore: {
    color: COLORS.PRIMARY,
  },
  cartImg: {
    flex: 1,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
});
