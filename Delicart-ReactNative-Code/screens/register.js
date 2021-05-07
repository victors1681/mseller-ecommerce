import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import FlatButton from "../components/button";
import Api from "../services/Api";
import Spinner from "react-native-loading-spinner-overlay";

export default function Register({ navigation }) {
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const api = new Api();

  const register = () => {
    if (!email || !name || !password) {
      api.showToast("please fill detail");
      return;
    }
    setLoader(true);
    api
      .postWoo("customers", {
        email: email,
        username: name,
        billing: {
          phone: phone,
        },
        password: password,
        first_name: name,
      })
      .then((data) => {
        if (data.code) {
          setLoader(false);
          api.showToast(data.message);
        } else {
          setLoader(false);
          api.showToast("you have successfully register");
          navigation.navigate("Login");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  };

  return (
    <View style={globalStyles.container}>
      {loader ? <Spinner visible={loader} color={COLORS.PRIMARY} /> : null}
      <View style={styles.bottomContain}>
        <Text style={globalStyles.mainLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          onChangeText={(text) => setName(text)}
          defaultValue={name}
        />
        <Text style={globalStyles.mainLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Email Address"
          onChangeText={(text) => setEmail(text)}
          defaultValue={email}
        />
        <Text style={globalStyles.mainLabel}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPhone(text)}
          placeholder="Enter Your Mobile Number"
          keyboardType="phone-pad"
          defaultValue={phone}
        />
        <Text style={globalStyles.mainLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          defaultValue={password}
        />
        <TouchableOpacity onPress={register}>
          <FlatButton text="Continue" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  space: {
    flex: 1,
  },
  bottomContain: {
    flex: 5,
    paddingHorizontal: 16,
  },
  number: {
    marginVertical: 20,
    marginBottom: 50,
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
    marginBottom: 24,
  },
  mobileInput: {
    marginLeft: 10,
    marginBottom: 0,
  },
  bottomButton: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 25,
    paddingHorizontal: 16,
  },
});
