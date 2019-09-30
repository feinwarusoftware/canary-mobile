import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, StatusBar, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { Svg, Path, G } from "react-native-svg";
import colors from "../config/colors";
import metrics from "../config/metrics";
import Logo from "../static/img/canary-white.svg";
import Search from "../static/img/search.svg";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {search: false};
  }

  toggleSearchBar = () => {
    this.state.search ? this.setState({search: false}) : this.setState({search: true});
  }

  componentDidMount = () => {};

  render() {
    const { routes } = this.props.navigation.state;

    const bottomNav = () => {
      if (this.state.search === true){
        return (
          <TextInput style={styles.searchBar} />
        );
      } else {
        return (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navBottom}
            horizontal={true}
          >
            {routes.map((e, i) =>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(e.routeName)}
                key={i}
                style={
                  this.props.navigation.state.index === i
                    ? {
                      ...styles.navTabContainer,
                      borderBottomColor: colors.white
                    }
                    : styles.navTabContainer
                }
              >
                <Text
                  style={
                    this.props.navigation.state.index !== i
                      ? { ...styles.navTab, opacity: 0.5 }
                      : styles.navTab
                  }
                >
                  {e.routeName}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        );
      }
    };

    return (
      <>
      <StatusBar backgroundColor="#00000000" translucent={true} barStyle="light-content" />
      <LinearGradient colors={[colors.canary, colors.canarySecondary]} style={styles.navBar}>
        <View style={styles.navTop}>
          <Logo style={styles.navImage} width={97.8} height={40} />
          <TouchableOpacity onPress={() => this.toggleSearchBar()} style={styles.searchButton}>
            <Search width={18.9} height={18.6} fill="#fff" />
          </TouchableOpacity>
        </View>
        {bottomNav()}
      </LinearGradient>
      </>
    );
  }
}

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

function mapStateToProps() {
  return {};
}
function mapDispatchToProps() {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
