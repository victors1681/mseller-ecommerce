import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS } from "../constants/Theme";
import { globalStyles } from "../styles/global";
import { AntDesign } from "@expo/vector-icons";
export default function Language() {
  const [languages, setLanguages] = useState([
    {
      key: "1",
      name: "English",
      isSelect: true,
    },
    {
      key: "2",
      name: "عربى",
      isSelect: false,
    },
    {
      key: "3",
      name: "हिन्दी",
      isSelect: false,
    },
    {
      key: "4",
      name: "日本人",
      isSelect: false,
    },
    {
      key: "5",
      name: "中文",
      isSelect: false,
    },
    {
      key: "6",
      name: "اردو",
      isSelect: false,
    },
  ]);
  const updateData = (index) => {
    {
      languages.map((item) => {
        item.isSelect = false;
      });
    }
    let qty = languages;
    qty[index]["isSelect"] = !qty[index]["isSelect"];
    setLanguages([...qty]);
  };
  return (
    <View style={globalStyles.container}>
      <View style={styles.mainContain}>
        {languages.map((item, index) => {
          return (
            <TouchableWithoutFeedback onPress={() => updateData(index)}>
              <View key={item.key} style={styles.languageContain}>
                <Text>{item.name}</Text>
                {item.isSelect ? (
                  <AntDesign
                    name="checkcircle"
                    size={25}
                    color={COLORS.PRIMARY}
                    style={styles.successIc}
                  />
                ) : (
                  <Image source={require("../assets/imgs/uncheck.png")}></Image>
                )}
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContain: {
    paddingHorizontal: 16,
  },
  languageContain: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomColor: COLORS.GRAY,
    borderBottomWidth: 1,
  },
});
