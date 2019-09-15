import React, { Component } from "react";
import { View, Text, StatusBar, ScrollView, TouchableHighlight } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import { Svg, Path, Defs, ClipPath, Image } from "react-native-svg";
import metrics from "../../../config/metrics";
import Background from "../../../static/img/welcome/welcome1.svg";

class Welcome1 extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#ce8914" barStyle="light-content" />
        <Background style={styles.background} width={metrics.screenWidth} height={metrics.screenHeight} preserveAspectRatio="xMidYMax slice" />
        <TouchableHighlight style={styles.button}>
          <View>
            <Text style={styles.buttonText}>Next</Text>
          </View>
        </TouchableHighlight>
      </View>
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
)(Welcome1);
