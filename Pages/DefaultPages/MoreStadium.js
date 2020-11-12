import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Tab, TabHeading, Tabs, Text as Text2, Thumbnail } from 'native-base';
import React, { Component } from 'react'
import { Text, View } from 'react-native'

import { APILINK } from '../URL'
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dimensions } from 'react-native';
import { HEADERBUTTONCOLOR } from '../URL';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SortByDateTab from './SortByDateTab';
import SortByLocationTab from './SortByLocationTab';
import SortByTeamsTab from './SortByTeamsTab';
import moment from 'moment'

export default class MoreStadium extends Component {
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white' }} hasTabs>

          <Right style={{ flex: 1 }} >

            <Button onPress={() => {
              this.props.navigation.toggleDrawer();


            }} style={{ backgroundColor: 'white', color: 'blue', flex: 1 }} transparent >
              {/* <Icon type="SimpleLineIcons" name="menu" size={30} color={HEADERBUTTONCOLOR} /> */}
              <MaterialCommunityIcons name="menu" size={30} color={HEADERBUTTONCOLOR} />
            </Button>
          </Right>



        </Header>
        <Tabs tabBarUnderlineStyle={{borderBottomWidth:2}} initialPage={1}  >
          <Tab heading="test" heading={<TabHeading><Icon name="location-pin" type="Entypo" /><Text2>Location</Text2></TabHeading>}>
          <SortByTeamsTab></SortByTeamsTab>
          </Tab>
         
          <Tab heading={<TabHeading><Icon name="time" type="Ionicons" /><Text2>Time</Text2></TabHeading>}>
            <SortByDateTab></SortByDateTab>
          </Tab>
          <Tab heading={<TabHeading><Icon name="team" type="AntDesign" /><Text2>Teams</Text2></TabHeading>}>
            <SortByLocationTab/>
          </Tab>
        </Tabs>
      </Container>
    )
  }
}
