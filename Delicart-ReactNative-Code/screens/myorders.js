import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import { AntDesign } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import { withNavigationFocus } from "react-navigation";
import Api from "../services/Api";
const width = Dimensions.get("window").width - 132;

const a = new Api();
class Myorders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      post: [],
      item: {
        line_items: [],
      },
      productName: "",
      review: "",
      isShow: false,
      loader: false,
      rate: 2,
      profile: {},
      productId: [],
      refreshing: false,
    };

    this.getData();
  }
  async getData() {
    let c = await a.getData("id");
    let rating = await a.getData("review");
    if (c) {
      a.getWoo("orders", { customer: c.id })
        .then((data) => {
          let id = [];
          if (data.length > 0) {
            data.map((p) => {
              p.line_items.map((e) => {
                id.push(e.product_id);
              });
            });
          }

          if (id.length > 0) {
            let removeDuplicate = id.filter((x, i, a) => a.indexOf(x) === i);
            this.setState({ productId: removeDuplicate });
            let st = removeDuplicate.join();
            a.getWoo("products/", { include: st })
              .then((res) => {
                let final = [];
                res.map((e) => {
                  let obj = {
                    id: e.id,
                    img: e.images[0].src,
                  };
                  final.push(obj);
                });
                this.setState({ productId: [...final] });
              })
              .catch((error) => {
                console.log(error);
              });
          }
          this.setState({ orders: [...data] });
          if (rating) {
            data.map((d) => {
              rating.map((r) => {
                if (d.id == r.id) {
                  d.rating = r.rating;
                }
              });
            });
          }
          this.setState({ loader: false });
          this.setState({ post: [...data] });
          this.setState({ refreshing: false });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loader: false });
          this.setState({ refreshing: false });
        });
      let obj = {
        name: c.firstName,
        email: c.email,
      };
      this.setState({ profile: obj });
    } else {
      this.setState({ refreshing: false });
      this.props.navigation.navigate("Login");
    }
  }
  async giveReview() {
    if (!this.state.review) {
      a.showToast("please write comment in add review");
      return;
    }

    let markers = this.state.post;

    this.state.item.line_items.map((it, index) => {
      let obj = {
        product_id: it.product_id,
        review: this.state.review,
        reviewer: this.state.profile.name,
        reviewer_email: this.state.profile.email,
        rating: this.state.rate,
      };
      a.postWoo("products/reviews", obj)
        .then((res) => {
          if (this.state.item.line_items.length == index + 1) {
            markers.map((m) => {
              if (m.id == this.state.item.id) {
                m.rating = this.state.rate;
              }
            });
            this.setState({ post: [...markers] });
            this.setState({ isShow: false });
            a.showToast("successfully added review");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
    let reviewData = [];

    let b = await a.getData("review");
    if (b) {
      b.push({
        id: this.state.item.id,
        rating: this.state.rate,
      });
      a.storeData("review", b);
    } else {
      reviewData.push({
        id: this.state.item.id,
        rating: this.state.rate,
      });
      a.storeData("review", reviewData);
    }
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.getData();
  }
  trackOrder(id) {
    this.props.navigation.navigate("Trackorder", {
      id: id,
      data: this.state.productId,
    });
  }
  singleOrder(id) {
    this.props.navigation.navigate("OrderDetail", {
      id: id,
      data: this.state.productId,
    });
  }
  render() {
    return (
      <View style={globalStyles.container}>
        {this.state.loader ? (
          <Spinner visible={this.state.loader} color={COLORS.PRIMARY} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
          >
            <View style={styles.headerContain}>
              <Text style={styles.headerLbl}>New</Text>
              <View style={styles.lineContain}></View>
            </View>

            <Modal
              isVisible={this.state.isShow}
              onBackdropPress={() => {
                this.setState({ isShow: false });
              }}
              style={styles.view}
            >
              {this.state.item ? (
                <View style={styles.modalView}>
                  <View style={[styles.infoContain, styles.ratingContain]}>
                    <View style={styles.imgContain}>
                      {this.state.productId.map((it) => {
                        if (this.state.item.line_items.length > 0) {
                          if (
                            this.state.item.line_items[0].product_id == it.id
                          ) {
                            return (
                              <Image
                                source={{
                                  uri: it.img,
                                }}
                                style={{ height: 80, width: 80 }}
                              />
                            );
                          }
                        }
                      })}
                    </View>
                    <View style={styles.dataContain}>
                      <Text numberOfLines={2} style={styles.name}>
                        {this.state.productName}
                      </Text>
                      <Text style={styles.price}>
                        {this.state.item.currency_symbol}
                        {this.state.item.total}
                      </Text>
                      <Text style={styles.date}>
                        {this.state.item.date_created}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.successLbl, styles.reviewLbl]}>
                    Give Review
                  </Text>
                  <View style={styles.ratingStar}>
                    <TouchableOpacity
                      onPress={() => this.setState({ rate: 1 })}
                    >
                      <AntDesign
                        name="star"
                        size={34}
                        color={
                          this.state.rate >= 1 ? COLORS.YELLOW : COLORS.DARKGRAY
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({ rate: 2 })}
                    >
                      <AntDesign
                        name="star"
                        size={34}
                        color={
                          this.state.rate >= 2 ? COLORS.YELLOW : COLORS.DARKGRAY
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({ rate: 3 })}
                    >
                      <AntDesign
                        name="star"
                        size={34}
                        color={
                          this.state.rate >= 3 ? COLORS.YELLOW : COLORS.DARKGRAY
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({ rate: 4 })}
                    >
                      <AntDesign
                        name="star"
                        size={34}
                        color={
                          this.state.rate >= 4 ? COLORS.YELLOW : COLORS.DARKGRAY
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({ rate: 5 })}
                    >
                      <AntDesign
                        name="star"
                        size={34}
                        color={
                          this.state.rate >= 5 ? COLORS.YELLOW : COLORS.DARKGRAY
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.successLbl, styles.reviewLbl]}>
                    Add Review
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      { textAlignVertical: "top", paddingTop: 10 },
                    ]}
                    multiline={true}
                    onChangeText={(text) => {
                      this.setState({ review: text });
                    }}
                    value={this.state.review}
                    placeholder="Add Your Review"
                  ></TextInput>
                  <TouchableWithoutFeedback onPress={() => this.giveReview()}>
                    <View style={styles.btnReview}>
                      <Text style={styles.review}>Give Review</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              ) : null}
            </Modal>

            <FlatList
              data={this.state.orders}
              renderItem={({ item, index }) =>
                item.status != "completed" && item.status != "cancelled" ? (
                  <View style={styles.card} key={index}>
                    <View style={styles.infoContain}>
                      <View style={styles.imgContain}>
                        {this.state.productId.map((it) => {
                          if (item.line_items[0].product_id == it.id) {
                            return (
                              <Image
                                source={{
                                  uri: it.img,
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
                          {item.total}
                        </Text>
                        <Text style={styles.date}>{item.date_created}</Text>
                      </View>
                    </View>
                    <View style={styles.detailContain}>
                      <View>
                        <Text style={styles.payLbl}>Payment Method</Text>
                        <Text style={styles.payment}>
                          {item.payment_method_title}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.status}>{item.status}</Text>
                      </View>
                    </View>
                    <View style={styles.trackContain}>
                      <View style={styles.btnContain}>
                        <TouchableOpacity
                          onPress={() => this.singleOrder(item.id)}
                        >
                          <Text style={styles.seeBtn}>See Details</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.borderLine}></View>
                      <View style={[styles.trackBtn, styles.btnContain]}>
                        <TouchableOpacity
                          onPress={() => this.trackOrder(item.id)}
                        >
                          <Text style={styles.seeBtn}>Track My Order</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : null
              }
            />

            {this.state.post.length > 0 ? (
              <View style={styles.headerContain}>
                <Text style={styles.headerLbl}>Past Order</Text>
                <View style={styles.lineContain}></View>
              </View>
            ) : null}

            {this.state.post
              .filter((it) => it.status == "completed")
              .map((item) => {
                return (
                  <View key={item.id} style={styles.postCard}>
                    <View style={styles.postImgContain}>
                      <View style={styles.imgContain}>
                        {this.state.productId.map((it) => {
                          if (item.line_items[0].product_id == it.id) {
                            return (
                              <Image
                                source={{
                                  uri: it.img,
                                }}
                                style={{ height: 80, width: 80 }}
                              />
                            );
                          }
                        })}
                      </View>
                      <View style={styles.dataContain}>
                        <View style={styles.postNameContain}>
                          <Text
                            numberOfLines={2}
                            style={[styles.name, styles.postName]}
                          >
                            {item.line_items[0].name}
                          </Text>
                        </View>
                        <Text style={styles.price}>
                          {item.currency_symbol}
                          {item.total}
                        </Text>
                        <Text style={styles.date}>{item.date_created}</Text>
                      </View>
                    </View>
                    <View style={styles.postReviewContain}>
                      <View style={styles.successContain}>
                        <AntDesign
                          name="checkcircle"
                          size={20}
                          color={COLORS.GREEN}
                          style={styles.successIc}
                        />
                        <Text style={styles.successLbl}>
                          Successfully Delivered
                        </Text>
                      </View>

                      {item.rating ? (
                        <View style={styles.postReview}>
                          <Text style={styles.payment}>
                            <AntDesign
                              name="star"
                              size={20}
                              color={COLORS.YELLOW}
                            />
                            ({item.rating})
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.postReview}>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ isShow: true });
                              this.setState({ item: item });
                              this.setState({
                                productName: item.line_items[0].name,
                              });
                            }}
                          >
                            <Text style={styles.seeBtn}>Review Now</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        )}
      </View>
    );
  }
  componentDidUpdate(prevProps) {
    if (this.props.isFocused && !prevProps.isFocused) {
      // Screen has now come into focus, call your method here

      this.setState({ loader: true });
      this.getData();
    }
  }
}

export default withNavigationFocus(Myorders);

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    height: 227,
    margin: 16,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
  },
  infoContain: {
    backgroundColor: COLORS.WHITE,
    height: 125,
    borderTopLeftRadius: 15,
    borderTopEndRadius: 15,
    flexDirection: "row",
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
  detailContain: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  payLbl: {
    fontSize: 11,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-regular",
  },
  payment: {
    fontSize: 15,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  status: {
    fontSize: 13,
    color: COLORS.GREEN,
    fontFamily: "sf-regular",
  },
  trackContain: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  seeBtn: {
    fontSize: 15,
    color: COLORS.PRIMARY,
    fontFamily: "sf-regular",
  },
  borderLine: {
    height: 24,
    width: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  btnContain: {
    width: "49%",
  },
  trackBtn: {
    alignItems: "flex-end",
  },
  headerContain: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    marginVertical: 8,
  },
  headerLbl: {
    fontSize: 15,
    color: COLORS.DEFAULT,
    fontFamily: "sf-bold",
    width: "30%",
  },
  lineContain: {
    height: 1,
    backgroundColor: COLORS.GRAY,
    width: "70%",
  },
  postCard: {
    borderRadius: 15,
    margin: 16,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
  },
  postImgContain: {
    backgroundColor: COLORS.WHITE,
    height: 125,
    flexDirection: "row",
    borderTopLeftRadius: 15,
    borderTopEndRadius: 15,
  },
  postReviewContain: {
    backgroundColor: COLORS.LIGHTGRAY,
    padding: 16,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  successLbl: {
    fontSize: 13,
    color: COLORS.GREEN,
    fontFamily: "sf-regular",
  },

  successIc: {
    marginEnd: 8,
  },
  successContain: {
    flexDirection: "row",
  },
  postReview: {
    borderLeftColor: COLORS.DARKGRAY,
    borderLeftWidth: 1,
    paddingLeft: 16,
  },
  postNameContain: {
    flexDirection: "row",
  },
  postName: {
    width: width - 40,
  },

  modalView: {
    backgroundColor: COLORS.BACKGROUND,
    height: 425,
    justifyContent: "flex-end",
    margin: 0,
  },
  ratingContain: {
    margin: 16,
  },
  reviewLbl: {
    color: COLORS.DEFAULT,
    marginStart: 16,
  },
  ratingStar: {
    marginStart: 16,
    marginVertical: 16,
    flexDirection: "row",
  },
  textInput: {
    borderRadius: 7,
    paddingHorizontal: 8,
    margin: 16,
    backgroundColor: COLORS.WHITE,
    height: 80,
  },
  btnReview: {
    height: 60,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  review: {
    fontSize: 17,
    color: COLORS.WHITE,
    fontFamily: "sf-regular",
  },

  view: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
