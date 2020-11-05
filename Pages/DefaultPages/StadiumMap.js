import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

export default class StadiumMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      long: 0,
      lat: 0,
      title: "Loading...",
    };
  }
  UNSAFE_componentWillMount() {
    this.setState({
      long: this.props.long,
      lat: this.props.lat,
      title: this.props.title,
    });
  }
  render() {
    return (
      <MapView
        style={{ flex: 1, width: Dimensions.get("window").width }}
        region={{
          latitude: this.state.lat,
          longitude: this.state.long,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker
          flat={true}
          coordinate={{
            latitude: this.state.lat,
            longitude: this.state.long,
          }}
          title={this.state.title}
        />
      </MapView>
    );
  }
}
