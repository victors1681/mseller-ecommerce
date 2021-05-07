import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { globalStyles } from "../styles/global";
import MapView from "react-native-maps";
import { COLORS } from "../constants/Theme";
import Api from "../services/Api";
import Geocoder from "react-native-geocoding";
import GetLocation from "react-native-get-location";
import { Marker } from "react-native-maps";

Geocoder.init("AIzaSyDHvNc2AIRogHxsQvdd8jDC0T2kwLmGDZA");
const api = new Api();
export default function AddAddress({ navigation }) {
  const [address, setAddress] = useState("");
  const [adList, setAdList] = useState([]);
  const [region, setRegion] = useState({
    latitude: 22.3039,
    longitude: 70.8022,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [state, setState] = useState("");

  const newAddress = async () => {
    if (address) {
      let addressList = await api.getData("address");
      if (addressList) {
        let obj = {
          id: addressList.length + 1,
          type: state || "Home",
          detail: address,
          value: false,
        };
        addressList.push(obj);
        api.storeData("address", addressList);
        navigation.goBack();
        navigation.state.params.onSelect("onSelect");
      } else {
        let obj = {
          id: 1,
          type: state || "Home",
          detail: address,
          value: true,
        };
        adList.push(obj);
        api.storeData("address", adList);
        navigation.goBack();
        navigation.state.params.onSelect("onSelect");
      }
    } else {
      api.showToast("please add address");
    }
  };
  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        let obj = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(obj);
        getGeocoder(location.latitude, location.longitude);
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
        console.log("location", error);
      });
  }, []);

  const getGeocoder = (lat, long) => {
    Geocoder.from(lat, long)
      .then((json) => {
        var addressComponent = json.results[0].formatted_address;
        setAddress(addressComponent);
      })
      .catch((error) => console.warn(error));
    setRegion({
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView style={{ marginBottom: 50 }}>
        <View style={styles.mapContain}>
          <MapView style={{ flex: 1 }} initialRegion={region}>
            <Marker
              draggable
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              title={"location"}
              onDragEnd={(e) => {
                e.persist();
                getGeocoder(
                  e.nativeEvent.coordinate.latitude,
                  e.nativeEvent.coordinate.longitude
                );
              }}
              description={"your location"}
            />
          </MapView>
        </View>
        <View style={styles.adContainer}>
          <Text style={styles.adLbl}>Address Label</Text>
          <TextInput
            placeholder="Home"
            style={styles.input}
            onChangeText={(text) => setState(text)}
            defaultValue={state}
          ></TextInput>
          <Text style={styles.adLbl}>Address</Text>
          <TextInput
            placeholder="Add Address Manually"
            style={[styles.input, { textAlignVertical: "top", paddingTop: 8 }]}
            multiline
            numberOfLines={4}
            onChangeText={(text) => setAddress(text)}
            defaultValue={address}
          ></TextInput>
        </View>
      </ScrollView>
      <TouchableWithoutFeedback onPress={newAddress}>
        <View style={globalStyles.footerBtn}>
          <Text style={globalStyles.footerLbl}>Add Address</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    margin: 16,
  },
  adLbl: {
    fontSize: 13,
    color: COLORS.DEFAULT,
    fontFamily: "sf-regular",
  },
  input: {
    fontSize: 15,
    color: COLORS.DARKGRAY,
    fontFamily: "sf-regular",
    borderRadius: 7,
    backgroundColor: COLORS.WHITE,
    minHeight: 44,
    paddingStart: 16,
    marginVertical: 16,
  },
  mapContain: {
    height: 450,
    position: "relative",
  },
  searchLocation: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  mapBtn: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.WHITE,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    width: "70%",
  },
});
