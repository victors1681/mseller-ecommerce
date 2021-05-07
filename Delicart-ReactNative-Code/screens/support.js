import React, { useState } from "react";
import { View } from "react-native";

import { globalStyles } from "../styles/global";

import { WebView } from "react-native-webview";
import Api from "../services/Api";

export default function Support() {
  const api = new Api();
  return (
    <View style={globalStyles.container}>
      <WebView source={{ uri: api.Baseurl + "support" }} />
    </View>
  );
}
