import { AsyncStorage, Text, View } from 'react-native'
import { Body, Button, Container, Header, Icon, Left, Right } from 'native-base';
import React, { Component } from 'react'

import {APILINK} from '../URL'
import { HEADERBUTTONCOLOR } from '../URL';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  async componentDidMount() {
    //getting teams
    var teams = await JSON.parse(await AsyncStorage.getItem("teams"));
    //updating user's status TO ACTIVE
    
    var user = await AsyncStorage.getItem("activeuser");
    var currentuser = JSON.parse(user);
    var url=APILINK+"updateStatus/"+currentuser.email+"/true/"
    await fetch(url);
 
 
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white' }}>

          <Right style={{ flex: 1, alignItems: 'flex-end' }} >
            <Button onPress={() => {
              this.props.navigation.toggleDrawer();

            }} style={{ backgroundColor: 'white', color: 'blue' }} transparent >
              {/* <Icon type="SimpleLineIcons" name="menu" size={30} color={HEADERBUTTONCOLOR} /> */}
              <MaterialCommunityIcons name="menu" size={30} color={HEADERBUTTONCOLOR} />
            </Button>
          </Right>

        </Header>
      </Container>
    )
  }
}

