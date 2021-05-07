import React, { useState } from "react";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import Navigator from "./navigation/drawer";
import Api from "./services/Api";

const getFonts = () =>
  Font.loadAsync({
    "sf-regular": require("./assets/fonts/sf/sfregular.ttf"),
    "sf-bold": require("./assets/fonts/sf/sfbold.ttf"),
    "sf-heavy": require("./assets/fonts/sf/sfheavy.ttf"),
    "sf-light": require("./assets/fonts/sf/sflight.ttf"),
    "sf-medium": require("./assets/fonts/sf/sfmedium.ttf"),
    "sf-black": require("./assets/fonts/sf/sfblack.ttf"),
    "sf-semibold": require("./assets/fonts/sf/sfsemibold.ttf"),
  });

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (fontLoaded) {
    return <Navigator />;
  } else {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => {
          setFontLoaded(true);
          getToken();
        }}
      />
    );
  }
}

const getToken = async () => {
  const a = new Api();
  a.getToken();
  a.getWoo("data/currencies/current")
    .then((res) => {
      a.storeData("currency", res);
    })
    .catch((error) => {
      console.log("error", error);
    });
  let token = await a.getData("token");
  if (token !== null) {
  }
};
