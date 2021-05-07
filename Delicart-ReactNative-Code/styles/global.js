import { COLORS } from "../constants/Theme";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  titleText: {
    fontFamily: "sf-regular",
    fontSize: 18,
    color: COLORS.PRIMARY,
  },
  mainLabel: {
    fontSize: 13,
    fontFamily: "sf-regular",
    color: COLORS.DEFAULT,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: COLORS.WHITE,
    fontSize: 15,
    color: COLORS.DEFAULT,
    height: 44,
  },
  headerFont: {
    color: COLORS.DEFAULT,
    fontSize: 17,
    fontFamily: "sf-heavy",
  },
  header: {
    backgroundColor: COLORS.BACKGROUND,
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
  },
  footerBtn: {
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
  },
  footerLbl: {
    fontSize: 17,
    color: COLORS.WHITE,
    fontFamily: "sf-regular",
  },
  spinnerTextStyle: {
    color: COLORS.PRIMARY,
  },
});
