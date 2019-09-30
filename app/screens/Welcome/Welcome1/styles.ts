import { StyleSheet } from "react-native";
import colors from "../../../config/colors";
import metrics from "../../../config/metrics";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dirtyWhite,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  background: {
    //width: metrics.screenWidth,
    //height: "auto",
    zIndex: -5,
    alignSelf: "flex-end",
    position: "relative",
    top: -25
  },
  button: {
    position: "absolute",
    bottom: 86,
    width: 98.8,
    height: 38.3,
    borderRadius: 19,
    backgroundColor: colors.canary,
    flex: 1,
    justifyContent: "center"
  },
  buttonText: {
    fontFamily: "Roboto",
    fontSize: 16.3,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 19.7,
    letterSpacing: 0,
    textAlign: "center",
    color: colors.white,
    alignSelf: "center",
  }
});

export default styles;