import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text as Text2, Thumbnail } from 'native-base';
import React, { Component } from 'react'
import { Text, View } from 'react-native'

import { HEADERBUTTONCOLOR } from '../URL';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class SortByTeamsTab extends Component {
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
           </Container>
    )
  }
}
