import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import Spinner from "react-native-loading-spinner-overlay";
import Slider from "react-native-slider";
import DropDownPicker from "react-native-dropdown-picker";
import Api from "../services/Api";
import SingleItem from "../components/item";
import { Html5Entities } from "html-entities";
const deviceWidth = Dimensions.get("window").width - 60;

export default function Search({ navigation }) {
  const [isShow, setIsShow] = useState(false);
  const [price, setPrice] = useState(100);
  const [review, setReview] = useState(2);
  const [filter, setFilter] = useState("low");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [loader, setLoader] = useState(false);
  const api = new Api();
  const searchData = () => {
    if (!search) {
      return api.showToast("please enter something");
    }
    setLoader(true);
    api
      .getWoo("products", { search: search })
      .then((res) => {
        setData([...res]);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };
  const getCurrency = async () => {
    let c = await api.getData("currency");
    const entities = new Html5Entities();
    let sy = entities.decode(c.symbol);
    setSymbol(sy);
  };
  useEffect(() => {
    getCurrency();
  }, []);
  return (
    <View style={globalStyles.container}>
      <View style={styles.searchbarContain}>
        <View style={styles.firstContain}>
          <View style={styles.searchContain}>
            <TextInput
              style={styles.input}
              defaultValue={search}
              placeholder="Smartphones"
              keyboardType="web-search"
              onChangeText={(text) => setSearch(text)}
            />
          </View>
          <TouchableWithoutFeedback
            style={{ alignItems: "center", justifyContent: "center" }}
            underlayColor="transparent"
            onPress={searchData}
          >
            <View style={styles.searchBtn}>
              <FontAwesome name="search" size={20} color={COLORS.GRAY} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <Modal
        isVisible={isShow}
        onBackdropPress={() => setIsShow(false)}
        style={styles.view}
      >
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerLbl}>Filter</Text>
          </View>
          <View style={styles.sortContain}>
            <View style={{ width: "50%" }}>
              <Text style={styles.sortLbl}>Sort By</Text>
              <Text style={styles.sorting}>
                Sorting will be apply base on the price
              </Text>
            </View>
            <View style={{ width: "50%" }}>
              <DropDownPicker
                placeholder="Low to High"
                items={[
                  {
                    label: "Low to High",
                    value: "low",
                    hidden: true,
                  },
                  {
                    label: "High to Low",
                    value: "high",
                  },
                ]}
                defaultValue={filter}
                containerStyle={{ height: 44 }}
                style={globalStyles.dropdown}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: COLORS.WHITE }}
                onChangeItem={(item) => setFilter(item.value)}
              />
            </View>
          </View>
          <View style={styles.reviewContain}>
            <View style={styles.reviewLblContain}>
              <Text style={styles.sortLbl}>By Review Rating</Text>
              <Text style={[styles.sorting, styles.aboveLbl]}>
                {review} and Above
              </Text>
            </View>
            <Slider
              value={review}
              thumbTintColor={COLORS.DEFAULT}
              minimumTrackTintColor={COLORS.PRIMARY}
              maximumTrackTintColor={COLORS.GRAY}
              minimumValue={0}
              maximumValue={5}
              step={1}
              onValueChange={(value) => setReview(value)}
            />
          </View>
          <View style={[styles.reviewContain, styles.priceContain]}>
            <View style={styles.reviewLblContain}>
              <Text style={styles.sortLbl}>By Price</Text>
              <Text style={[styles.sorting, styles.aboveLbl]}>₹{price}/-</Text>
            </View>
            <Slider
              value={price}
              thumbTintColor={COLORS.DEFAULT}
              minimumTrackTintColor={COLORS.PRIMARY}
              maximumTrackTintColor={COLORS.GRAY}
              minimumValue={0}
              maximumValue={500}
              step={1}
              onValueChange={(value) => setPrice(value)}
            />
          </View>
          <View style={styles.btnContain}>
            <TouchableWithoutFeedback onPress={() => setIsShow(false)}>
              <View style={styles.clearBtn}>
                <Text style={styles.clearLbl}>Clear</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setIsShow(false)}>
              <View style={[styles.clearBtn, styles.applyBtn]}>
                <Text style={[styles.clearLbl, styles.applyLbl]}>
                  Apply Filter
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
      <View style={styles.recentlyContain}>
        {data.length > 0 ? (
          <FlatList
            data={data}
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
                />
              </TouchableOpacity>
            )}
          />
        ) : null}
      </View>
      {loader ? <Spinner visible={loader} color={COLORS.PRIMARY} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  searchbarContain: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContain: {
    width: deviceWidth,
  },
  firstContain: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    borderRadius: 10,
    height: 50,
  },
  input: {
    alignItems: "center",
    paddingStart: 10,
  },
  filter: {
    fontSize: 13,
    color: COLORS.DEFAULT,
    fontFamily: "sf-medium",
  },
  recentlyContain: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 50,
  },
  searchLbl: {
    fontSize: 17,
    color: COLORS.DEFAULT,
    fontFamily: "sf-bold",
    marginBottom: 16,
  },
  textContain: {
    marginBottom: 16,
    flexDirection: "row",
  },
  history: {
    fontSize: 13,
    fontFamily: "sf-regular",
    color: COLORS.DARKGRAY,
    paddingStart: 10,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
  },
  headerLbl: {
    fontSize: 17,
    color: COLORS.DEFAULT,
    fontFamily: "sf-bold",
  },

  modalView: {
    backgroundColor: COLORS.BACKGROUND,
    height: 425,
    justifyContent: "flex-end",
    margin: 0,
  },
  sortContain: {
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    marginVertical: 16,
    padding: 16,
    zIndex: 10,
  },
  sortLbl: {
    fontSize: 15,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  sorting: {
    fontSize: 10,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  aboveLbl: {
    color: COLORS.DARKGRAY,
  },
  reviewLblContain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewContain: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    zIndex: 0,
  },
  btnContain: {
    height: 60,
    flexDirection: "row",
  },
  clearBtn: {
    backgroundColor: COLORS.CLEAR,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  clearLbl: {
    fontSize: 17,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  applyLbl: {
    color: COLORS.WHITE,
  },
  applyBtn: {
    backgroundColor: COLORS.PRIMARY,
  },
  priceContain: {
    marginVertical: 16,
  },
  view: {
    justifyContent: "flex-end",
    margin: 0,
  },
  searchBtn: {
    width: 30,
  },
});
