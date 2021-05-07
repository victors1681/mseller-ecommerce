import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import FlatButton from "../components/button";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";

export default function Verification({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <View style={styles.space}></View>
      <View style={styles.mainContain}>
        <Text style={styles.infoLbl}>
          We will Share OTP on your device, Please enter verification code
        </Text>
        <View style={styles.resend}>
          <Text style={styles.mainLabel}>Resend After</Text>
          <Text style={styles.timer}>00:30</Text>
        </View>
        <View>
          <Text style={globalStyles.mainLabel}>OTP Verification</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Verification Code Here"
          />
          <View style={styles.account}>
            <Text style={styles.accountLbl}>Don't Receive Code ?</Text>
            <TouchableOpacity>
              <Text style={styles.createAccount}>Resend Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <View style={styles.bottomButton}>
            <FlatButton text="Continue" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  space: {
    flex: 1,
  },
  mainContain: {
    flex: 4,
    paddingHorizontal: 16,
    justifyContent: "space-around",
  },
  infoLbl: {
    fontSize: 17,
    textAlign: "center",
    color: COLORS.DARKGRAY,
    fontFamily: "sf-light",
    paddingHorizontal: "14%",
  },
  bottomButton: {
    justifyContent: "flex-end",
    marginBottom: 25,
    paddingHorizontal: 16,
  },
  timer: {
    fontSize: 23,
    fontFamily: "sf-bold",
    color: COLORS.DEFAULT,
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
  },
  resend: {
    alignItems: "center",
  },
  account: {
    flexDirection: "row",
    marginTop: 15,
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
});
