import React from "react";
import { View } from "react-native";
import Api from "../services/Api";
import { globalStyles } from "../styles/global";
import { WebView } from "react-native-webview";

export default function About() {
  const api = new Api();

  return (
    <View style={globalStyles.container}>
      <WebView source={{ uri: api.Baseurl + "about-us" }} />
    </View>
  );
}
