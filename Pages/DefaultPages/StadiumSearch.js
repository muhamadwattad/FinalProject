import * as Location from 'expo-location';

import { APILINK, HEADERBUTTONCOLOR } from '../URL'
import { AsyncStorage, Text, View } from 'react-native'
import { Body, Button, Container, Content, Header, Icon, Input, Item, Left, List, ListItem, Picker, Right, Text as Text2, Thumbnail } from 'native-base'
import React, { Component } from 'react'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class StadiumSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stadiums: [],
      search: "מיקים",
      locations: []
    }
  }
  getlocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    
    if (status !== 'granted') {
      this.setState({ errorMessage: 'Permission to access location was denied', });
    }
    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      let reverseGC = await Location.reverseGeocodeAsync(location.coords);
      if (reverseGC[0].city == null || reverseGC[0].city == undefined || reverseGC[0].city.length == 0) {
        //TODO SHOW ERROR
      }
      else {
        this.setState({ search: reverseGC[0].city })
      }
    }
    else {

    }

  }

  async UNSAFE_componentWillMount() {

    //CHECKING IF LOCATIONS OF STADIUMS ARE ALREADY IN LOCAL STORAGE

    var locations = JSON.parse(await AsyncStorage.getItem("locations"));
    //GETTING  STADIUM LOCATIONS FROM API
    if (locations == null || locations == undefined) {
      var url = APILINK + "getstadiumslocations/"

      await fetch(url).then((resp) => {
        return resp.json();
      }).then(async (data) => {
        if ('Message' in data) {
          //TODO SHOW ERROR MESSAGE
          this.setState({ locations: "ERROR" });
        }
        else {
          this.setState({ locations: data }, async () => await AsyncStorage.setItem("locations", JSON.stringify(data)));
        }
      })
    }
    else {

      this.setState({ locations });
    }




  }

  getstadiums = async () => {
    if (this.state.search == "NO") {
      //TODO SHOW ERROR MESSAGE
      return;
    }
    var url = APILINK + "getstadiumsbylocation/" + this.state.search;
    console.log(url);
    await fetch(url)
      .then((resp) => {
        return resp.json();
      }).then(async (data) => {
console.log(data);
      });


  }
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white' }} searchBar rounded>


          <Item>
            <Icon name="menu" style={{ color: HEADERBUTTONCOLOR, fontSize: 30 }} onPress={() => this.props.navigation.toggleDrawer()} />
            <Icon name="ios-search" onPress={this.getstadiums} />
            <Picker
              mode="dialog"
              placeholder="מיקום"
              selectedValue={this.state.search}
              onValueChange={(value) => this.setState({ search: value })}
            >
              <Picker.Item label="מיקום" value="NO" />
              {this.state.locations.length == 0 || this.state.locations == null || this.state.locations == "ERROR" ? <Picker.Item label="NO" value="NO" key={999} /> :

                this.state.locations.map((location, index) => {
                  return (
                    <Picker.Item label={location.location_hebrew} value={location.location_hebrew} key={index} />
                  )
                })
              }

            </Picker>
            <Icon name="location-pin" type="Entypo" onPress={this.getlocation} />
          </Item>




        </Header>



      </Container>
    )
  }
}
