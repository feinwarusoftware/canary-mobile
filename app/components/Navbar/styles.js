import { StyleSheet } from "react-native";
import colors from "../../config/colors";
import metrics from "../../config/metrics";
import {StatusBar} from "react-native";

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: colors.canary,
    height: 96.7 + StatusBar.currentHeight,
    paddingTop: StatusBar.currentHeight,
    width: metrics.screenWidth,
    overflow: "visible"
  },
  navBottom: {
    flexDirection: "row",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  navImage: {
    flex: 1,
    position: "absolute",
    top: 10,
    left: (metrics.screenWidth / 2) - (97.8 / 2)
  },
  navTab: {
    fontFamily: "Roboto",
    fontSize: 16.3,
    fontWeight: "bold",
    lineHeight: 19.7,
    color: colors.white,
    marginLeft: 10,
    marginRight: 10
  },
  navTabContainer: {
    borderBottomColor: "transparent",
    borderBottomWidth: 4.3
  },
  navTop: {
    alignItems: "center",
    color: colors.canary,
    flexDirection: "row",
    height: 50.1,
    width: metrics.screenWidth
  },
  searchButton: {
    flex: 1,
    position: "absolute",
    top: 21,
    right: 18
  },
  searchBar: {
    position: "absolute",
    height: 35.9,
    top: 78.7,
    zIndex: 999,
    left: 18.7,
    right: 18.7,
    backgroundColor: colors.white,
    borderRadius: 18
  },
  selected: {
    height: 4.3,
    width: 43,
    backgroundColor: colors.white,
    position: "absolute",
    bottom: 0
  }
});

export default styles;