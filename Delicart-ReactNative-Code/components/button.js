import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/Theme";

export default function FlatButton({ text }) {
  return (
    <View style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 7,
    backgroundColor: COLORS.PRIMARY,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.WHITE,
    textTransform: "capitalize",
    fontSize: 17,
    fontFamily: "sf-regular",
  },
});
