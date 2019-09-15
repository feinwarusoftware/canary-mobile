import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import styles from "./styles";
import { Svg, Path, G } from "react-native-svg";
import colors from "../../config/colors";
import metrics from "../../config/metrics";
import Logo from "../../static/img/canary-white.svg";
import Search from "../../static/img/search.svg";

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
