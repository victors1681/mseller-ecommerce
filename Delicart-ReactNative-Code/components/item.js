import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import { COLORS } from "../constants/Theme";
import { AntDesign } from "@expo/vector-icons";
import Api from "../services/Api";

const width = (Dimensions.get("window").width - 50) / 2;
export default function SingleItem({ data, images, currency, isLike }) {
  const api = new Api();
  const createMarkup = (s) => {
    var htmlString = s;
    return htmlString.replace(/<[^>]+>/g, "");
  };

  return (
    <View style={styles.mainContain}>
      {data ? (
        <View>
          <View style={styles.imgContain}>
            {isLike ? (
              <AntDesign
                name="heart"
                size={18}
                color={COLORS.RED}
                style={styles.icon}
              />
            ) : // <AntDesign
            //   name="hearto"
            //   size={18}
            //   color={COLORS.DEFAULT}
            //   style={styles.icon}
            // />
            null}
            <Image
              source={{
                uri: images,
              }}
              style={{ width: 80, height: 80 }}
            />
          </View>
          <View style={styles.detailContain}>
            <Text numberOfLines={2} style={styles.detail}>
              {data.name}
            </Text>
            {/* <Text numberOfLines={2} style={styles.detail}>
              {createMarkup(data.short_description)}
            </Text> */}

            <View style={styles.priceContain}>
              <Text style={styles.price}>
                <Text>{currency}</Text>
                {data.price}
              </Text>
              <Text style={styles.discount}>{data.discount}</Text>
            </View>
            <View style={styles.rating}>
              <AntDesign
                name="star"
                size={16}
                color={
                  data.average_rating >= 1 ? COLORS.YELLOW : COLORS.DARKGRAY
                }
              />
              <AntDesign
                name="star"
                size={16}
                color={
                  data.average_rating >= 2 ? COLORS.YELLOW : COLORS.DARKGRAY
                }
              />
              <AntDesign
                name="star"
                size={16}
                color={
                  data.average_rating >= 3 ? COLORS.YELLOW : COLORS.DARKGRAY
                }
              />
              <AntDesign
                name="star"
                size={16}
                color={
                  data.average_rating >= 4 ? COLORS.YELLOW : COLORS.DARKGRAY
                }
              />
              <AntDesign
                name="star"
                size={16}
                color={
                  data.average_rating >= 5 ? COLORS.YELLOW : COLORS.DARKGRAY
                }
              />
              <Text style={styles.total}>({data.rating_count})</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContain: {
    width: width,
    marginRight: 18,
    marginBottom: 20,
  },
  imgContain: {
    height: width,
    //width: 140,
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  detail: {
    fontSize: 12,
    fontFamily: "sf-regular",
    color: COLORS.DEFAULT,
    textAlign: "center",
  },
  price: {
    fontSize: 13,
    color: COLORS.DEFAULT,
    fontFamily: "sf-bold",
  },
  discount: {
    color: COLORS.RED,
    fontSize: 12,
    fontFamily: "sf-regular",
    marginLeft: 3,
  },
  detailContain: {
    marginTop: 10,
    alignItems: "center",
  },
  priceContain: {
    flexDirection: "row",
    marginVertical: 4,
  },
  rating: {
    flexDirection: "row",
  },
  total: {
    fontSize: 13,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-medium",
    marginLeft: 5,
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
