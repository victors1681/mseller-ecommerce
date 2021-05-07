import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { withNavigationFocus } from "react-navigation";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import { AntDesign } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";

import Api from "../services/Api";

const width = Dimensions.get("window").width - 32;
const api = new Api();
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: [],
      data: {},
      loader: false,
    };
    this.getUser();
    this.getAddress();
  }

  updateData(index) {
    {
      this.data.address.map((item, index) => {
        item.value = false;
      });
    }
    let qty = address;
    qty[index]["value"] = !qty[index]["value"];
    this.setState({ address: [...qty] });
  }
  deleteAddress(add, index) {
    let copy = this.state.address;
    copy.splice(index, 1);
    this.setState({ address: [...copy] });
    api.showToast("successfully remove address");
    api.storeData("address", copy);
  }
  async editProfile() {
    let c = await api.getData("id");
    if (c) {
      if (!this.state.data.first_name) {
        api.showToast("please fill name");
        return;
      }
      this.setState({ loader: true });
      api
        .putWoo("customers/" + c.id, { first_name: this.state.data.first_name })
        .then((res) => {
          this.setState({ loader: false });
          api.showToast("successfully update profile");
          c.firstName = this.state.data.first_name;
          api.storeData("id", c);
          api.getToken();
        })
        .catch((error) => {
          this.setState({ loader: false });
          console.log(error);
        });
    } else {
      navigation.navigate("Login");
    }
  }

  async addAddress() {
    let c = await api.getData("id");
    if (c) {
      this.props.navigation.navigate("AddAddress", { onSelect: this.onSelect });
    } else {
      this.props.navigation.navigate("Login");
    }
  }

  async getAddress() {
    let ad = await api.getData("address");
    if (ad) {
      this.setState({ address: ad });
    }
  }
  onSelect(data) {
    this.getAddress();
  }
  async getUser() {
    let c = await api.getData("id");
    if (c) {
      this.setState({ loader: true });
      api
        .getWoo("customers/" + c.id)
        .then((res) => {
          this.setState({ data: res });
          this.setState({ loader: false });
        })
        .catch((error) => {
          console.log("error", error);
          this.setState({ loader: false });
        });
    } else {
      this.props.navigation.navigate("Login");
    }
  }

  render() {
    return (
      <View style={globalStyles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <View style={styles.imgContain}>
              <Image
                source={require("../assets/imgs/static.png")}
                style={styles.profileImg}
              ></Image>
            </View>
          </View>
          <Spinner visible={this.state.loader} color={COLORS.PRIMARY} />
          <View style={styles.detailContain}>
            <View style={styles.profileItem}>
              <Text style={styles.infoLbl}>Full Name</Text>
              <TextInput
                defaultValue={this.state.data.first_name}
                onChangeText={(text) => {
                  this.setState({
                    data: { first_name: text, email: this.state.data.email },
                  });
                }}
                style={styles.input}
              ></TextInput>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.infoLbl}>Email Address</Text>
              <TextInput
                defaultValue={this.state.data.email}
                editable={false}
                style={styles.input}
              ></TextInput>
            </View>
            <TouchableOpacity onPress={() => this.editProfile()}>
              <View style={styles.editContain}>
                <Text style={styles.editBtn}>Edit Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.addressContain}>
            <View style={styles.lblContain}>
              <Text style={styles.adLbl}>My Address</Text>
              <TouchableOpacity onPress={() => this.addAddress()}>
                <Text style={styles.addLbl}>+ Add New Address</Text>
              </TouchableOpacity>
            </View>
            {this.state.address.map((item, index) => {
              return (
                <TouchableWithoutFeedback>
                  <View style={styles.addContain} key={item.id}>
                    <View style={styles.address}>
                      <View style={styles.titleContain}>
                        <Text style={styles.title}>{item.type}</Text>
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            onPress={() => this.deleteAddress(item, index)}
                          >
                            <AntDesign
                              name="delete"
                              size={15}
                              color={COLORS.RED}
                              style={{ marginStart: 8 }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={styles.label}>{item.detail}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.isFocused && !prevProps.isFocused) {
      this.getUser();
      this.getAddress();
    }
  }
}

export default withNavigationFocus(Profile);

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    paddingTop: 30,
    marginBottom: 30,
  },
  imgContain: {
    height: 104,
    width: 104,
    position: "relative",
  },
  profileImg: {
    borderRadius: 104 / 2,
  },
  circleContain: {
    height: 37,
    width: 37,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 37 / 2,
    position: "absolute",
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: COLORS.WHITE,
  },
  detailContain: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
  },
  infoLbl: {
    color: COLORS.DEFAULT,
    fontSize: 13,
    fontFamily: "sf-regular",
  },
  input: {
    color: COLORS.DARKGRAY,
    fontFamily: 17,
    fontFamily: "sf-regular",
  },
  profileItem: {
    marginVertical: 10,
  },
  addressContain: {
    padding: 16,
    backgroundColor: COLORS.WHITE,
    marginTop: 20,
  },
  lblContain: {
    justifyContent: "space-between",
  },
  adLbl: {
    color: COLORS.DARKGRAY,
    fontSize: 15,
    fontFamily: "sf-bold",
  },
  addLbl: {
    fontSize: 13,
    fontFamily: "sf-regular",
    color: COLORS.PRIMARY,
  },
  lblContain: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addContain: {
    flexDirection: "row",
    marginTop: 20,
  },
  radioContain: {
    width: 50,
  },
  title: {
    fontSize: 15,
    color: COLORS.DEFAULT,
    fontFamily: "sf-semibold",
  },
  titleContain: {
    marginBottom: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-regular",
  },
  address: {
    width: width,
    paddingStart: 16,
  },
  checkIc: {
    height: 26,
    width: 26,
    marginTop: 16,
  },
  editContain: {
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 5,
  },
  editBtn: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontFamily: "sf-medium",
  },
});
