import { StyleSheet } from "react-native";
import colors from "../../config/colors";
import metrics from "../../config/metrics";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dirtyWhite
  },
  swoosh: {
    position: "absolute",
    top: 0,
    zIndex: -10
  },
  swooshBelow: {
    position: "absolute",
    top: 0,
    zIndex: -11,
    backgroundColor: colors.darkGrey
  },
  text: {
    color: colors.canary,
    fontSize: 32,
    marginBottom: 20
  }
});

export default styles;