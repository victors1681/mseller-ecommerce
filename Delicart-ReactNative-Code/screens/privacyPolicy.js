import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../constants/Theme";
import Api from "../services/Api";
import { globalStyles } from "../styles/global";
import { WebView } from "react-native-webview";

export default function PrivacyPolicy() {
  const api = new Api();
  return (
    <View style={globalStyles.container}>
      <WebView source={{ uri: api.Baseurl + "policy" }} />
    </View>
  );
}
