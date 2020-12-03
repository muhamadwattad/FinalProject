import * as LocalAuthentication from 'expo-local-authentication';

import { APILINK, HEADERBUTTONCOLOR } from '../URL'
import { Animated, AsyncStorage, FlatList, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Root, Text as Text2, Thumbnail, Toast } from 'native-base';
import React, { Component } from 'react'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class AppSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notfication: false,
      autologin: true,
      loginfinger: false,
    };

  }

  async componentDidMount() {
    //GETTING STUFF FROM ASYNC STORAGE AND API

    //GETTING AUTOLOGIN
    var autologin = await AsyncStorage.getItem("autologin");

    if (autologin == null || autologin == "True" || autologin == undefined) {

      this.setState({ autologin: true });
    }
    else {
      this.setState({ autologin: false });
    }

    //GETTING FINGERPRINTS
    var loginfinger = await AsyncStorage.getItem("loginfinger");
    if (loginfinger == "True") {
      this.setState({ loginfinger: true });
    }
    else {
      this.setState({ loginfinger: false });
    }
  }

  setAutoLogin = async () => {
    //GETTING THE CURRENT STATE OF AUTOLOGIN
    var autologin = !this.state.autologin;
    console.log(autologin);
    //SAVING IN ASYNC STORAGE
    await AsyncStorage.setItem("autologin", autologin == true ? "True" : "False");
    this.setState({ autologin: autologin });
  }

  setFingerPrintsLogin = async () => {
    //SETTING FINGERPRINTS ON ASYNCSTORAGE
    var loginfinger = !this.state.loginfinger;
    if (loginfinger == true) {
      let result = await LocalAuthentication.hasHardwareAsync();

      if (result == true) {
        await AsyncStorage.setItem("loginfinger", loginfinger == true ? "True" : "False");
        var res = await AsyncStorage.getItem("loginfinger")
        console.log("TEST FROM ASYNC: " + res)
        this.setState({ loginfinger });
      }
      else {
        //TODO SHOW ERROR THAT CANT ENABLE BECAUSE PHONE DOESNT SUPPORT
        alert("PHONE DOESNT SUPPORT");
        await AsyncStorage.setItem("loginfinger", "False");
        var res = await AsyncStorage.getItem("loginfinger")
        console.log("TEST FROM ASYNC: " + res);
        this.setState({ loginfinger: false });
      }

    }
    else {

      await AsyncStorage.setItem("loginfinger", "False");
      var res = await AsyncStorage.getItem("loginfinger")
      console.log("TEST FROM ASYNC: " + res);
      this.setState({ loginfinger });
    }
  }
  setNotification = async () => {

  }

  render() {
    return (

      <Container>
        <Header style={{ backgroundColor: 'white' }}>

          <Right style={{ flex: 1 }} >

            <Button onPress={() => {
              this.props.navigation.goBack();


            }} style={{ backgroundColor: 'white', color: 'blue', flex: 1 }} transparent >
              {/* <Icon type="SimpleLineIcons" name="menu" size={30} color={HEADERBUTTONCOLOR} /> */}
              <MaterialCommunityIcons name="arrow-right" size={30} color={HEADERBUTTONCOLOR} />
            </Button>
          </Right>





        </Header>
        <Content  >

          {/* Notifications */}
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FD4133" }}>
                <Icon active name="notifications" />
              </Button>

            </Left>
            <Body>
              <Text2> התראות</Text2>
            </Body>
            <Right>

              <Switch
                onValueChange={() => {
                  var notfication = !this.state.notfication
                  this.setState({ notfication });
                }}
                value={this.state.notfication}
              />

            </Right>
          </ListItem>
          {/* AutoLogin */}
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#32CD32" }}>
                <Icon active name="login" type="MaterialCommunityIcons" />
              </Button>

            </Left>
            <Body>

              <Text2>כניסה אוטומטית</Text2>
            </Body>
            <Right>

              <Switch
                onValueChange={this.setAutoLogin}
                value={this.state.autologin}
              />
            </Right>
          </ListItem>
          {/* FingerPrints */}
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="finger-print" />
              </Button>

            </Left>
            <Body>

              <Text2>כניסה עם טביעות אצבע</Text2>
            </Body>
            <Right>

              <Switch
                onValueChange={this.setFingerPrintsLogin}
                value={this.state.loginfinger}
              />
            </Right>
          </ListItem>


        </Content>
      </Container>

    )
  }
}
