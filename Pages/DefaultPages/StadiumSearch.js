import * as Font from 'expo-font';
import * as Location from 'expo-location';

import { APILINK, HEADERBUTTONCOLOR } from '../URL'
import { AsyncStorage, FlatList, Image, Text, View } from 'react-native'
import { Body, Button, Card, CardItem, Container, Content, Header, Icon, Input, Item, Left, List, ListItem, Picker, Right, Text as Text2, Thumbnail } from 'native-base'
import React, { Component } from 'react'

import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class StadiumSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stadiums: [],
      search: "מיקים",
      locations: [],
      test: "",
      x: null,
      t: null
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
      console.log(reverseGC);
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

    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })
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
        if ('Message' in data) {
          //TODO SHOW ERROR
        }
        else {

          for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
            var Address = data[i].venue_hebrew_name;
            var newArray = [];
            var LongLatLocation = await Location.geocodeAsync(Address);
            data[i].latitude = LongLatLocation[0].latitude;
            data[i].longitude = LongLatLocation[0].longitude;

          }
          this.setState({ stadiums: data });

        }
      });



  }
  testloc = async () => {

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
        <Content>

          {this.state.stadiums.length == 0 || this.state.stadiums == null ? <Text>HELLO</Text> :


            this.state.stadiums.map((stadium, index) => {
              return (
                <Card key={index}>
                  <CardItem>
                    <Left>
                      <Thumbnail source={{ uri: 'data:image/jpeg;base64,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' }} />
                      <Body>
                        <Text2>NativeBase</Text2>
                        <Text2 note>GeekyAnts</Text2>
                      </Body>
                    </Left>
                  </CardItem>
                  <CardItem cardBody>
                    <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS0Bkq4BlmDylg-3UJYCa4W07Q6mfrJza8yvA&usqp=CAU' }} style={{ height: 200, width: null, flex: 1 }} />
                  </CardItem>
                  <CardItem>
                    <Left>
                      <Button transparent>
                        <Icon active name="thumbs-up" />
                        <Text2>12 Likes</Text2>
                      </Button>
                    </Left>
                    <Body>
                      <Button transparent>
                        <Icon active name="chatbubbles" />
                        <Text2>4 Comments</Text2>
                      </Button>
                    </Body>
                    <Right>
                      <Text2>11h ago</Text2>
                    </Right>
                  </CardItem>
                </Card>
              )
            })
          }



        </Content>

      </Container>
    )
  }
}
