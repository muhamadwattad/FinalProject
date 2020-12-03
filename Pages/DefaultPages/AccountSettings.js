import { APILINK, HEADERBUTTONCOLOR } from '../URL'
import { Animated, AsyncStorage, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text as Text2, Thumbnail } from 'native-base';
import React, { Component } from 'react'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class AccountSettings extends Component {
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
      </Container>
    )
  }
}
