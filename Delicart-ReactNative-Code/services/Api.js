import React from "react";
import { ToastAndroid, Platform } from "react-native";
import WooCommerceAPI from "react-native-woocommerce-api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast from "react-native-root-toast";
import { store } from "../styles/shared";
export default class Api {
  wps = new WooCommerceAPI({
    url: "https://saasmonks.in/App-Demo/delicart-74242", // Your store URL
    ssl: true,
    consumerKey: "ck_84a1d3b79688c6533ed08c32b7fee3a3457d0ecc", // Your consumer secret
    consumerSecret: "cs_8b993fc12277fba474939eb2126c08d55949372a", // Your consumer secret
    wpAPI: true, // Enable the WP REST API integration
    version: "wc/v3", // WooCommerce WP REST API version
    queryStringAuth: true,
  });
  name = "Guest";
  Baseurl = "https://saasmonks.in/App-Demo/delicart-74242/";
  payPalKey =
    "AY8AEr0kVPWZiN6fCDNWf8RhWeLhzjStJs3lSz1FrN1Sx62-j5HTP1zDiTzfmL7EkAdcP2HZkoBkEeNh";

  getWoo(url, data = null) {
    return this.wps.get(url, data);
  }

  postWoo(url, data) {
    return this.wps.post(url, data);
  }
  putWoo(url, data) {
    return this.wps.put(url, data);
  }

  postData(url, data) {
    return fetch(this.Baseurl + url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  getData = async (name) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        // value previously stored
        return JSON.parse(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  storeData = async (name, value) => {
    try {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };
  removeValue = async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (e) {
      // remove error
    }
  };
  showToast = (msg) => {
    console.log("from test", msg);

    if (Platform.OS == "ios") {
      Toast.show(msg);
    } else {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };
  async getToken() {
    let c = await this.getData("id");

    store.update((s) => {
      if (c) {
        s.name = c.firstName;
      } else {
        s.name = "Guest";
      }
    });
  }
}
