import { APILINK, HEADERBUTTONCOLOR, } from '../URL';
import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text as Text2, Thumbnail } from 'native-base';
import { Image, Text, View } from 'react-native'
import React, { Component } from 'react'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class HelpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white' }}>

          <Right style={{ flex: 1 }} >

            <Button onPress={() => {
              this.props.navigation.toggleDrawer();


            }} style={{ backgroundColor: 'white', color: 'blue', flex: 1 }} transparent >
              {/* <Icon type="SimpleLineIcons" name="menu" size={30} color={HEADERBUTTONCOLOR} /> */}
              <MaterialCommunityIcons name="menu" size={30} color={HEADERBUTTONCOLOR} />
            </Button>
          </Right>





        </Header>
        <View style={{justifyContent:'center',  alignItems: 'center',backgroundColor:'smoke',borderWidth:1,height:'100%'}} >
          <Image source={require('../../assets/loading.gif')} style={{ width: 100, height: 100 }} />
        </View>
      </Container>
    )
  }
}
