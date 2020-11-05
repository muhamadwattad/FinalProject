import * as Font from "expo-font";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { APILINK, HEADERBUTTONCOLOR } from "../URL";
import Spinner from "react-native-loading-spinner-overlay";
import {
  AsyncStorage,
  FlatList,
  Image,
  Modal,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Icon,
  Input,
  Item,
  Left,
  List,
  ListItem,
  Picker,
  Right,
  Text as Text2,
  Thumbnail,
} from "native-base";
import React, { Component } from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import { getDistance, getPreciseDistance } from "geolib";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import StadiumMap from "./StadiumMap";
export default class StadiumSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stadiums: [],
      search: "מיקים",
      locations: [],
      test: "",
      x: null,
      t: null,
      showmodal: false,
      haslocation: true,
      error: "choose location or take your location",
      reloading: false,
    };
  }
  getlocation = async () => {
    let { status } = await Location.requestPermissionsAsync();

    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      let reverseGC = await Location.reverseGeocodeAsync(location.coords);

      if (
        reverseGC[0].city == null ||
        reverseGC[0].city == undefined ||
        reverseGC[0].city.length == 0
      ) {
        //TODO SHOW ERROR
      } else {
        this.setState({ search: reverseGC[0].city }, () => this.getstadiums());
      }
    } else {
    }
  };

  async UNSAFE_componentWillMount() {
    this.setState({ reloading: true });
    //CHECKING IF USER HAS LOCATION ENABLED OR NO
    var Answer = await Location.hasServicesEnabledAsync();

    if (Answer == false) {
      var { status } = await Location.requestPermissionsAsync();

      if (status != "granted") {
        this.setState({ haslocation: false });
      }
    } else {
      this.setState({ haslocation: true });
    }
    //LOADING FONT
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    //CHECKING IF LOCATIONS OF STADIUMS ARE ALREADY IN LOCAL STORAGE

    var locations = JSON.parse(await AsyncStorage.getItem("locations"));
    //GETTING  STADIUM LOCATIONS FROM API

    if (locations == null || locations == undefined) {
      var url = APILINK + "getstadiumslocations/";

      await fetch(url)
        .then((resp) => {
          return resp.json();
        })
        .then(async (data) => {
          if ("Message" in data) {
            this.setState({ locations: "ERROR", reloading: false });
          } else {
            this.setState(
              { locations: data, reloading: false },
              async () =>
                await AsyncStorage.setItem("locations", JSON.stringify(data))
            );
          }
        });
    } else {
      this.setState({ reloading: false });
      this.setState({ locations }, () => this.setState({ reloading: false }));
    }
  }

  getstadiums = async () => {
    this.setState({ reloading: true });
    if (this.state.search == "NO") {
      //TODO SHOW ERROR MESSAGE
      this.setState({ error: "CHOOSE A LOCATION" });
      return;
    }
    let { status } = await Location.requestPermissionsAsync();
    if (status != "granted") {
      this.setState({ haslocation: false, reloading: false });
      return;
    }

    var url = APILINK + "getstadiumsbylocation/" + this.state.search;
    console.log(url);
    await fetch(url)
      .then((resp) => {
        return resp.json();
      })
      .then(async (data) => {
        console.log(data);
        if ("Message" in data) {
          this.setState({
            error: "NO STADIUMS FOUND IN THIS LOCATION",
            reloading: false,
          });
        } else {
          for (var i = 0; i < data.length; i++) {
            var Address = data[i].venue_hebrew_name;
            var newArray = [];
            var LongLatLocation = await Location.geocodeAsync(Address);
            data[i].latitude = LongLatLocation[0].latitude;
            data[i].longitude = LongLatLocation[0].longitude;
          }
          this.setState({ stadiums: data, reloading: false });
        }
      });
    this.setState({ reloading: false });
  };

  openwaze = async (long, lat) => {
    //GETTING LONG AND LAT FROM API AND OPENING WAZE SO USER CAN GO THERE

    var url = `https://waze.com/ul?ll=${lat},${long}&navigate=yes`;
    Linking.openURL(url);
  };
  showmap = async (long, lat) => {
    console.log("MAP");
  };

  testloc = async () => {};
  render() {
    if (this.state.haslocation == true) {
      return (
        <Container>
          <Header style={{ backgroundColor: "white" }} searchBar rounded>
            <Item>
              <Icon
                name="menu"
                style={{ color: HEADERBUTTONCOLOR, fontSize: 30 }}
                onPress={() => this.props.navigation.toggleDrawer()}
              />
              <Icon name="ios-search" onPress={this.getstadiums} />
              <Picker
                mode="dialog"
                placeholder="מיקום"
                selectedValue={this.state.search}
                onValueChange={(value) => this.setState({ search: value })}
              >
                <Picker.Item label="מיקום" value="NO" />
                {this.state.locations.length == 0 ||
                this.state.locations == null ||
                this.state.locations == "ERROR" ? (
                  <Picker.Item label="NO" value="NO" key={999} />
                ) : (
                  this.state.locations.map((location, index) => {
                    return (
                      <Picker.Item
                        label={location.location_hebrew}
                        value={location.location_hebrew}
                        key={index}
                      />
                    );
                  })
                )}
              </Picker>
              <Icon
                name="location-pin"
                type="Entypo"
                onPress={this.getlocation}
              />
            </Item>
          </Header>
          <Content>
            <Spinner
              visible={this.state.reloading}
              textContent="Loading..."
              textStyle={{ color: "green" }}
            />
            {this.state.stadiums.length == 0 || this.state.stadiums == null ? (
              <Text>{this.state.error}</Text>
            ) : (
              this.state.stadiums.map((stadium, index) => {
                console.log(stadium);

                var pdis = getPreciseDistance(
                  { latitude: 20.0504188, longitude: 64.4139099 },
                  { latitude: 51.528308, longitude: -0.3817765 }
                );
                return (
                  <Card key={index}>
                    <CardItem>
                      <Right>
                        <Left>
                          <Text2>{stadium.venue_hebrew_name}</Text2>
                          <Text2 note>{stadium.venue_name}</Text2>
                        </Left>
                      </Right>
                    </CardItem>
                    <CardItem cardBody>
                      <Image
                        source={{
                          uri:
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS0Bkq4BlmDylg-3UJYCa4W07Q6mfrJza8yvA&usqp=CAU",
                        }}
                        style={{ height: 200, width: null, flex: 1 }}
                      />
                    </CardItem>
                    <CardItem>
                      <Left>
                        <Button
                          transparent
                          onPress={() =>
                            this.setState({
                              longsend: stadium.longitude,
                              latsend: stadium.latitude,
                              titlesend: stadium.venue_hebrew_name,
                              showmodal: true,
                            })
                          }
                        >
                          <Icon
                            name="map-marked-alt"
                            type="FontAwesome5"
                            style={{ color: HEADERBUTTONCOLOR }}
                          />
                          <Text2 style={{ color: HEADERBUTTONCOLOR }}>
                            {stadium.venue_city}
                          </Text2>
                        </Button>
                      </Left>
                      <Body style={{ marginLeft: 13 }}>
                        <Button transparent>
                          <Icon
                            name="chair"
                            type="FontAwesome5"
                            style={{ color: "#FF5254" }}
                          />
                          <Text2 style={{ color: "#FF5254" }}>
                            {stadium.venue_capacity} מקומות
                          </Text2>
                        </Button>
                      </Body>
                      <Right style={{ marginRight: 15 }}>
                        <MaterialCommunityIcons
                          name="waze"
                          style={{ fontSize: 30, color: "#31CBFD" }}
                          onPress={() =>
                            this.openwaze(stadium.longitude, stadium.latitude)
                          }
                        />
                      </Right>
                    </CardItem>
                  </Card>
                );
              })
            )}
          </Content>
          <Modal visible={this.state.showmodal}>
            <Header style={{ backgroundColor: "white" }}>
              <Right style={{ flex: 1, backgroundColor: "white" }}>
                <Button
                  transparent
                  onPress={() => {
                    this.setState({ showmodal: false });
                  }}
                  style={{ backgroundColor: "white", color: "blue", flex: 1 }}
                  transparent
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={30}
                    color={HEADERBUTTONCOLOR}
                  />
                </Button>
              </Right>
            </Header>
            <StadiumMap
              long={this.state.longsend}
              lat={this.state.latsend}
              title={this.state.titlesend}
            />
          </Modal>
        </Container>
      );
    } else {
      return <Text> Enable location to use this page.</Text>;
    }
  }
}
