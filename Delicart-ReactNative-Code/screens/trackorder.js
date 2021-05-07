import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
const width = Dimensions.get("window").width - 132;
import Timeline from "react-native-timeline-flatlist";
import Spinner from "react-native-loading-spinner-overlay";
import Api from "../services/Api";

export default function Trackorder({ navigation }) {
  const [item, setItem] = useState({});
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const api = new Api();

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
    <View style={[globalStyles.container, styles.mainContain]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loader ? (
          <Spinner visible={loader} color={COLORS.PRIMARY} />
        ) : (
          <View>
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
                      {item.line_items[0].name}
                    </Text>
                    <Text style={styles.price}>
                      {item.currency_symbol}
                      {item.line_items[0].price.toFixed(2)}
                    </Text>
                    <Text style={styles.date}>{item.date_created}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.trackLbl}>Track Order</Text>
        <Timeline
          data={[
            {
              title: "Order Placed",
              description: item.status,
              lineColor: item.status == "pending" ? "#9F9F9F" : "",
            },
            {
              title: "Packing",
              description: "",
              circleColor: item.status == "pending" ? "#9F9F9F" : "",
              lineColor:
                item.status == "pending" || item.status == "processing"
                  ? "#9F9F9F"
                  : "",
            },
            {
              title: "Your Order is Delivered",
              description: "",
              circleColor: item.status != "completed" ? "#9F9F9F" : "",
            },
          ]}
          showTime={false}
          titleStyle={styles.titleStyle}
          descriptionStyle={styles.descriptionStyle}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContain: {
    paddingHorizontal: 16,
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
  trackLbl: {
    fontSize: 17,
    fontFamily: "sf-regular",
    color: COLORS.DEFAULT,
    marginBottom: 32,
  },
  titleStyle: {
    fontSize: 13,
    fontFamily: "sf-regular",
    color: COLORS.DEFAULT,
    marginTop: -10,
  },
  descriptionStyle: {
    fontSize: 10,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-regular",
    marginTop: 0,
    marginBottom: 32,
  },
});
