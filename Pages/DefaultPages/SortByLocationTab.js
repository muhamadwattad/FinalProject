import * as Linking from "expo-linking";
import * as Location from "expo-location";

import { APILINK, HEADERBUTTONCOLOR, RANDOMIMAGEURL } from "../URL";
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  View,
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
import { getDistance, getPreciseDistance } from "geolib";

import AwesomeAlert from "react-native-awesome-alerts";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Spinner from "react-native-loading-spinner-overlay";
import StadiumInfo from './StadiumInfo'

export default class SortByLocationTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dontload: false,
      errormsg: null,
      city: null,
      longitude: 0,
      latitude: 0,
      stadiums: [],
      loading: false,
      refreshing: false,
      showmodal: false
    }
  }
  async componentDidMount() {


  }

  getUserLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status != "granted") {
      this.setState({ dontload: true, errormsg: "NEED LOCATION PERMISSION" });
    }
    else {
      let location = await Location.getCurrentPositionAsync({});

      if (location) {
        let longitude = location.coords.longitude;
        let latitude = location.coords.latitude;
        this.setState({ longitude, latitude });
        let reverseGC = await Location.reverseGeocodeAsync(location.coords);

        if (
          reverseGC[0].city == null ||
          reverseGC[0].city == undefined ||
          reverseGC[0].city.length == 0
        ) {
          this.setState({ errormsg: "FAILED TO GET CITY", dontload: true });
        } else {
          this.setState({ city: reverseGC[0].city });
        }
      }
      else {
        this.setState({ errormsg: "FAILED TO GET LOCATION", dontload: true });
      }

    }
  }

  getStadiums = async () => {
    this.setState({ loading: true });
    //GETTING STADIUM FROM ASYNC STORAGE , IF NOT EXIST TAKE THEM FROM API
    let stadiums = await AsyncStorage.getItem("stadiums");

    if (stadiums == null || stadiums.length == 0 || stadiums == undefined) {
      await fetch(APILINK + "getstadiums/").then((resp) => {
        return resp.json();
      }).then(async (data) => {
        if ('Message' in data) {
          this.setState({ errormsg: "Failed to get stadiums", dontload: true });
        }
        else {
          this.setState({ stadiums: data });
          await AsyncStorage.setItem("stadiums", JSON.stringify(stadiums));
          stadiums = data;
        }
      })
    }
    else
      stadiums = await JSON.parse(stadiums);

    //GETTING LONG AND LAT OF STADIUMS AND CALCULATING THE DISTANCE BETWEEN USER'S LOCATION AND STADIUM

    for (let i = 0; i < stadiums.length; i++) {
      var LongLatLocation = await Location.geocodeAsync(stadiums[i].venue_hebrew_name);
      stadiums[i].latitude = LongLatLocation[0].latitude;
      stadiums[i].longitude = LongLatLocation[0].longitude;
      let x = await getPreciseDistance({ latitude: this.state.latitude, longitude: this.state.longitude }, { latitude: LongLatLocation[0].latitude, longitude: LongLatLocation[0].longitude });
      stadiums[i].distance = x / 1000;
    }

    //SORTING THE ARRAY FROM CLOSE TO FAR BY DISTANCE
    await stadiums.sort((a, b) => a.distance === b.distance ? 0 : a.distance > b.distance || -1);
    this.setState({ stadiums, loading: false });



  }

  loadData = async () => {
    //GETTING USER's LOCATION AND SAVING THEM INTO STATE.

    await this.getUserLocation();
    //GETTING STADIUMS FROM API
    if (this.state.dontload == false)
      await this.getStadiums();

  }
  async UNSAFE_componentWillMount() {
    this.loadData();

  }
  render() {
    if (this.state.dontload == true) {
      return (
        <View>
          <Text> {this.state.errormsg} </Text>
        </View>
      )
    } else {
      return (
        <Content >
          <Spinner
            visible={this.state.loading}
            textContent="מקבל נתונים"
            textStyle={{ color: HEADERBUTTONCOLOR }}
            animation="fade"
            overlayColor="grey"
            size="large"
          />
          <Modal visible={this.state.showmodal} animationType="slide" style={{height:150,width:'100%'}}>
            <Header style={{ backgroundColor: "white" }}>
              <Right style={{ flex: 1 }}>
                <Button
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
            
              <StadiumInfo stadium={this.state.stadium} />
            
          </Modal>


          {this.state.stadiums == null || this.state.stadiums.length == 0 ? <Text>HI</Text> :
            <List

            >
              {
                this.state.stadiums.map((stadium, index) => {

                  return (
                    <ListItem thumbnail style={{ margin: 3 }} key={index.toString()}>
                      <Left>
                        <Thumbnail square source={{ uri: RANDOMIMAGEURL }} />
                      </Left>
                      <Body>
                        <Text2>{stadium.venue_hebrew_name}</Text2>
                        <Text2 note numberOfLines={1}>{stadium.venue_hebrew_city}</Text2>
                        <Text2 note>{stadium.distance} ק"מ</Text2>
                      </Body>
                      <Right>
                        <Button transparent onPress={() => this.setState({ stadium, showmodal: true })}>
                          <Text2>עוד</Text2>
                        </Button>
                      </Right>
                    </ListItem>
                  )
                })}
            </List>
          }


        </Content>
      )
    }
  }
}
