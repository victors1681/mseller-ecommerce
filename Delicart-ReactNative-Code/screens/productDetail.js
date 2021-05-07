import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Ionicons } from "@expo/vector-icons";
import Api from "../services/Api";
import Spinner from "react-native-loading-spinner-overlay";
import { Html5Entities } from "html-entities";

const width = Dimensions.get("window").width - 83;
export default function ProductDetail({ navigation }) {
  const [detail, setDetail] = useState({});
  const [symbol, setSymbol] = useState("");
  const [index, setIndex] = useState(0);
  const [img, setImage] = useState("");
  const [loader, setLoader] = useState(true);
  const [cart, setCart] = useState([]);
  const [wish, setWish] = useState(false);
  const handleIndexChange = (index) => {
    setIndex(index);
  };
  const [review, setReview] = useState([]);
  const createMarkup = (s) => {
    var htmlString = s;
    return htmlString.replace(/<[^>]+>/g, "");
  };
  const a = new Api();
  const getCart = async () => {
    let copy = await a.getData("Cart");
    if (copy.length > 0) {
      setCart([...copy]);
    } else {
      setCart([]);
    }
  };
  const getCurrency = async () => {
    let c = await a.getData("currency");
    const entities = new Html5Entities();
    let sy = entities.decode(c.symbol);
    setSymbol(sy);
  };
  useEffect(() => {
    getCart();
    a.getWoo("products/" + navigation.getParam("id"))
      .then((data) => {
        (async () => {
          let c = await a.getData("wishlist");
          if (c) {
            const findId = c.find((d) => d == data.id);
            if (findId) {
              setWish(true);
            } else {
              setWish(false);
            }
          } else {
            setWish(false);
          }
        })();

        setDetail(data);
        setImage(data.images[0].src);
        a.getWoo("products/reviews")
          .then((res) => {
            setLoader(false);
            if (res.length > 0) {
              let re = res.filter(
                (data) => data.product_id == navigation.getParam("id")
              );

              if (re.length > 0) {
                setReview([...re]);
              }
            }
          })
          .catch((error) => {
            setLoader(false);
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
    getCurrency();
  }, []);
  useEffect(() => {}, [review]);
  const gotoCart = () => {
    if (cart.length > 0) {
      const findId = cart.find((data) => data.product_id == detail.id);
      if (findId) {
        let markers = [...cart];
        let index = markers.findIndex(
          (el) => el.product_id === findId.product_id
        );
        markers[index]["qty"] = markers[index]["qty"] + 1;
        setCart([...markers]);
        a.storeData("Cart", cart);
        navigation.navigate("Cart");
      } else {
        let obj = {
          qty: 1,
          product_id: detail.id,
          price: detail.price,
          name: detail.name,
          img: img,
        };
        cart.push(obj);
        a.storeData("Cart", cart);
        navigation.navigate("Cart");
      }
    } else {
      cart.push({
        qty: 1,
        product_id: detail.id,
        price: detail.price,
        name: detail.name,
        img: img,
      });
      a.storeData("Cart", cart);
      navigation.navigate("Cart");
    }
  };
  const setWishlist = async () => {
    let isLogin = await a.getData("token");
    if (!isLogin) {
      a.showToast("please login");
      return;
    }
    let check = await a.getData("wishlist");
    if (check) {
      const findId = check.find((data) => data == detail.id);
      if (findId) {
        let index = check.findIndex((el) => el === findId);
        check.splice(index, 1);
        a.storeData("wishlist", check);
        a.showToast("successfully remove from wishlist");
        checkISWish();
      } else {
        check.push(detail.id);
        a.storeData("wishlist", check);
        a.showToast("successfully add from wishlist");
        checkISWish();
      }
    } else {
      let arr = [];
      arr.push(detail.id);
      a.storeData("wishlist", arr);
      a.showToast("successfully add from wishlist");
      checkISWish();
    }
  };
  const checkISWish = async () => {
    let c = await a.getData("wishlist");
    if (c) {
      const findId = c.find((data) => data == detail.id);
      if (findId) {
        setWish(true);
      } else {
        setWish(false);
      }
    } else {
      setWish(true);
    }
  };
  const shareData = async () => {
    try {
      const result = await Share.share({
        message: detail.permalink,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <View style={globalStyles.container}>
      {loader ? (
        <Spinner visible={loader} color={COLORS.PRIMARY} />
      ) : (
        <ScrollView
          style={styles.mainContain}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.name}>{detail.name}</Text>
          <View style={styles.rating}>
            <AntDesign
              name="star"
              size={16}
              color={
                detail.average_rating >= 1 ? COLORS.YELLOW : COLORS.DARKGRAY
              }
            />
            <AntDesign
              name="star"
              size={16}
              color={
                detail.average_rating >= 2 ? COLORS.YELLOW : COLORS.DARKGRAY
              }
            />
            <AntDesign
              name="star"
              size={16}
              color={
                detail.average_rating >= 3 ? COLORS.YELLOW : COLORS.DARKGRAY
              }
            />
            <AntDesign
              name="star"
              size={16}
              color={
                detail.average_rating >= 4 ? COLORS.YELLOW : COLORS.DARKGRAY
              }
            />
            <AntDesign
              name="star"
              size={16}
              color={
                detail.average_rating >= 5 ? COLORS.YELLOW : COLORS.DARKGRAY
              }
            />
            <Text style={styles.total}>({detail.rating_count})</Text>
          </View>
          <View style={styles.imgContain}>
            <View style={styles.mainImgContain}>
              <Image
                source={{
                  uri: img,
                }}
                style={{ height: "85%", width: "85%" }}
              ></Image>
            </View>
            <View style={styles.sideImagContain}>
              {detail.images.slice(0, 3).map((item) => {
                return (
                  <View style={styles.sideImage} key={item.id}>
                    <Image
                      source={{
                        uri: item.src,
                      }}
                      style={{ height: "80%", width: "80%" }}
                    ></Image>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={styles.priceContain}>
            <View>
              <Text style={styles.priceLbl}>
                {symbol}
                {detail.price}
              </Text>
              <Text style={styles.stockLbl}>{detail.stock_status}</Text>
            </View>
            <View style={styles.shareContain}>
              <TouchableOpacity onPress={setWishlist}>
                {wish ? (
                  <AntDesign name="heart" size={24} color={COLORS.RED} />
                ) : (
                  <AntDesign name="heart" size={24} color={COLORS.DEFAULT} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={shareData}>
                <MaterialCommunityIcons
                  name="share-outline"
                  size={24}
                  color={COLORS.DEFAULT}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.segment}>
            <SegmentedControlTab
              values={["Details", "Reviews"]}
              selectedIndex={index}
              tabTextStyle={styles.segmentStyle}
              onTabPress={handleIndexChange}
            />
          </View>
          {index ? (
            <View>
              {review.map((item) => {
                return (
                  <View style={styles.reviewContain} key={item.id}>
                    <View style={styles.reviewImgContain}>
                      <Image
                        source={require("../assets/imgs/static.png")}
                        style={styles.reviewImg}
                      ></Image>

                      <Text style={styles.rateLbl}>
                        <AntDesign
                          name="star"
                          size={13}
                          color={COLORS.YELLOW}
                        />
                        {item.rating}
                      </Text>
                    </View>
                    <View style={styles.reviewDetail}>
                      <View style={styles.dateContain}>
                        <Text style={styles.userName}>{item.reviewer}</Text>
                        <Text style={styles.dateLbl}>{item.date_created}</Text>
                      </View>
                      <Text style={styles.commentLbl}>
                        {createMarkup(item.review)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View>
              {detail.weight ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailTitle}>Weight</Text>
                  <Text style={styles.detailInfo}>{detail.weight}</Text>
                </View>
              ) : null}
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Description</Text>
                <Text style={styles.detailInfo}>
                  {createMarkup(detail.description)}
                </Text>
              </View>
              {detail.dimensions.height ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailTitle}>
                    Product Dimensions LxWxH
                  </Text>
                  <Text style={styles.detailInfo}>
                    {detail.dimensions.length} x{detail.dimensions.width}x
                    {detail.dimensions.height}
                  </Text>
                </View>
              ) : null}
              <View style={styles.detailRow}>
                <Text style={styles.detailTitle}>Type</Text>
                <Text style={styles.detailInfo}>{detail.type}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}
      {loader ? null : (
        <TouchableWithoutFeedback onPress={gotoCart}>
          <View style={styles.footerContain}>
            <Text style={styles.addTxt}>Add To Cart</Text>
            <Ionicons
              name="ios-arrow-round-forward"
              size={25}
              color={COLORS.PRIMARY}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: COLORS.BACKGROUND,
    height: 325,
    justifyContent: "flex-end",
    margin: 0,
  },
  mainContain: {
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 17,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
    marginBottom: 5,
    marginTop: 10,
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
  mainImgContain: {
    backgroundColor: COLORS.WHITE,
    width: "70%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  sideImagContain: {
    width: "25%",
    marginStart: "5%",
    justifyContent: "space-between",
  },
  imgContain: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 20,
  },
  sideImage: {
    height: 73,
    backgroundColor: COLORS.WHITE,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  priceContain: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stockLbl: {
    fontSize: 15,
    color: COLORS.DARKGREEN,
  },
  shareContain: {
    flexDirection: "row",
  },
  priceLbl: {
    fontSize: 20,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  segmentStyle: {
    fontSize: 15,
    fontFamily: "sf-regular",
  },
  segment: {
    marginVertical: 20,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  detailTitle: {
    width: "40%",
    fontSize: 13,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-regular",
    paddingEnd: 20,
  },
  detailInfo: {
    width: "60%",
    fontSize: 13,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  sellerLbl: {
    fontSize: 20,
    color: COLORS.DEFAULT,
    fontFamily: "sf-bold",
    marginVertical: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  totalReview: {
    fontSize: 14,
    fontFamily: "sf-regular",
    color: COLORS.DARKGRAY,
  },
  reviewContain: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  addReview: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontFamily: "sf-medium",
  },
  reviewDetail: {
    padding: 15,
    backgroundColor: COLORS.REVIEW,
    borderRadius: 8,
    width: width,
  },
  dateContain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  reviewImg: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
  },
  reviewImgContain: {
    marginEnd: 16,
  },
  rateLbl: {
    fontSize: 13,
    color: COLORS.YELLOW,
    fontFamily: "sf-medium",
    marginTop: 5,
  },
  userName: {
    fontFamily: "sf-regular",
    color: COLORS.DEFAULT,
    fontSize: 13,
  },
  dateLbl: {
    fontSize: 10,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-light",
  },
  commentLbl: {
    fontSize: 12,
    fontFamily: "sf-regular",
    color: COLORS.DARKGRAY,
  },
  footerContain: {
    backgroundColor: COLORS.WHITE,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  addTxt: {
    fontSize: 15,
    color: COLORS.PRIMARY,
    fontFamily: "sf-regular",
    marginEnd: 12,
  },

  view: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
