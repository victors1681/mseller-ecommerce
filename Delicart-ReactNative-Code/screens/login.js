import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { globalStyles } from "../styles/global";
import Images from "../constants/Images";
import { COLORS } from "../constants/Theme";
import FlatButton from "../components/button";
import Constants from "expo-constants";
import Api from "../services/Api";

export default function Login({ navigation }) {
  const [form, setState] = useState({
    username: "",
    password: "",
  });
  const [loader, setLoader] = useState(false);

  const api = new Api();
  console.log("from lo");
  const loginData = () => {
    console.log("from fun");
    setLoader(true);
    api
      .postData("wp-json/jwt-auth/v1/token", form)
      .then((response) => {
        response.json().then((data) => {
          if (data.success) {
            api.storeData("id", data.data);
            setLoader(false);
            if (data.data.token) {
              api.storeData("token", data.data.token);
              api.getToken();
              api.showToast("you have successfully login");
              navigation.navigate("Home");
            }
          } else {
            setLoader(false);
            if (data.statusCode == 403) {
              api.showToast(data.message);
            }
          }
        });
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  };

  return (
    <View style={[globalStyles.container, styles.mainContainer]}>
      <View style={styles.logoContain}>
        <Image source={Images.Logo} style={styles.logo} />
      </View>
      {loader ? <Spinner visible={loader} color={COLORS.PRIMARY} /> : null}
      <View style={styles.mainContain}>
        <Text style={globalStyles.mainLabel}>Name {loader}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          onChangeText={(text) =>
            setState({
              username: text,
              password: form.password,
            })
          }
          defaultValue={form.username}
        />
        <Text style={globalStyles.mainLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry={true}
          onChangeText={(text) =>
            setState({
              username: form.username,
              password: text,
            })
          }
          defaultValue={form.password}
        />

        <View style={styles.number}></View>
        <TouchableOpacity onPress={() => loginData()}>
          <FlatButton text="Continue" />
        </TouchableOpacity>

        <View style={styles.account}>
          <Text style={styles.accountLbl}>Not have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.createAccount}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: Constants.statusBarHeight,
  },
  logoContain: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 190,
    height: 42,
  },
  mainContain: {
    flex: 4,
    paddingHorizontal: 16,
  },
  number: {
    marginVertical: 20,
    marginBottom: 20,
  },
  numberContain: {
    flexDirection: "row",
    alignItems: "center",
  },
  code: {
    flex: 2,
  },
  mobileNumber: {
    flex: 4,
  },
  input: {
    fontSize: 15,
    color: COLORS.DEFAULT,
    height: 44,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderColor: COLORS.GRAY,
    borderWidth: 1,
    marginBottom: 12,
  },
  account: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "center",
  },
  accountLbl: {
    fontSize: 13,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  createAccount: {
    fontFamily: "sf-bold",
    marginLeft: 7,
  },
  continue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  border: {
    height: 1,
    width: 52,
    backgroundColor: COLORS.GRAY,
  },
  continueLbl: {
    fontSize: 13,
    fontFamily: "sf-regular",
    color: COLORS.DARKGRAY,
    marginHorizontal: 20,
  },
  social: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialBtn: {
    height: 62,
    width: 62,
    backgroundColor: COLORS.SOCIAL,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  icon: {
    height: 24,
    width: 24,
  },
});
