import { Dimensions, Image, Text, View } from "react-native";
import React, { Component } from "react";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default class GameInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async UNSAFE_componentWillMount() {
    this.setState(
      {
        game: this.props.game,
        home: this.props.homeTeam,
        away: this.props.awayTeam,
      },
      () => console.log(this.state.game)
    );
  }
  async componentDidMount() {}
  render() {
    return (
      <View>
        <View style={{ height: windowHeight / 3 }}>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              height: "20%",
              margin: 6,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                margin: 6,
                alignItems: "flex-start",
                width: "33%",
              }}
            >
              {this.state.home.name}
            </Text>

            <Text
              style={{
                textAlign: "center",
                margin: 6,
                alignItems: "flex-end",
                width: "33%",
              }}
            >
              {this.state.away.name}
            </Text>
          </View>
          <View
            style={{
              margin: 6,
              height: "70%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Image
              style={{ margin: 6, height: 150, width: 150 }}
              source={{ uri: this.state.home.logo }}
            />
            <Image
              style={{ margin: 6, height: 150, width: 150 }}
              source={{ uri: this.state.away.logo }}
            />
          </View>
        </View>
        <Text> </Text>
      </View>
    );
  }
}
