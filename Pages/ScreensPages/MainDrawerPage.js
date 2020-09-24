import React, { Component } from 'react'
import { HEADERBUTTONCOLOR } from '../URL'
import { DrawerContentScrollView, DrawerItemList, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import HomePage from '../DefaultPages/HomePage';
import Animated from 'react-native-reanimated'
import { Icon, Container, Header, Content, Footer, Button, Right, ListItem, Left, Thumbnail, List, Body, H3, Text, Switch } from 'native-base'
import { AsyncStorage } from 'react-native';
const Drawer = createDrawerNavigator();
export default class MainDrawerPage extends Component {
  render() {
    return (
      <Drawer.Navigator drawerPosition="right" drawerType="slide" drawerContentOptions={{
        activeBackgroundColor: '#cdf8cd'
      }}
        drawerContent={(props) => <Sidebar {...props} />}
      >
        <Drawer.Screen name="Home"
          title="בית"
          component={HomePage}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name='home' style={{ fontSize: size, color: color }} />
            ), title: 'בית'
          }}
        />

        {/* <Drawer.Screen />
        <Drawer.Screen /> */}
      </Drawer.Navigator>
    )
  }
}



export class Sidebar extends Component {

  constructor(progress, ...props) {
    super(...props);
    this.progress = progress
    this.imgurl = "https://static.thenounproject.com/png/340719-200.png"
    this.state = {
      username: '',
      email: '',
      switch: false,
      background: 'white',
      color: '#131313',
      image: "https://static.thenounproject.com/png/340719-200.png"
    }

  }

  componentDidMount() {
    this.getData();
  }
  logout = async () => {

  }

  getData = async () => {

    //GETS CURRENT USER
    var user = await AsyncStorage.getItem("activeuser");
    var currentuser = JSON.parse(user);

    //PUTS USERNAME AND EMAIL INSIDE OF DRAWER
    this.setState({ username: currentuser.name, email: currentuser.email });


    //PUTS IMAGE URL

    //TODO FIX THIS 
    // var image = currentuser.image;
    // if (!image.includes("https://platform-lookaside")) {
    //   image = UrlOfFile + image;
    // }

  }

  render() {
    return (
      < Container style={{ backgroundColor: this.state.background, color: this.state.color }}>
        <Header style={{ backgroundColor: this.state.background, shadowOffset: { height: 1 } }}>

          <Right>
            <Button transparent style={{ backgroundColor: this.state.background }} onPress={() => {
              this.props.navigation.dispatch(DrawerActions.closeDrawer())
            }}>
              <Icon name="menu" style={{ color: 'blue', }} onPress={() => {
              }} />
            </Button>
          </Right>
        </Header>
        <Content >
          <ListItem thumbnail style={{ backgroundColor: this.state.background }}>
            <Left style={{ backgroundColor: this.state.background, color: this.state.color }}>
              <Thumbnail source={{ uri: this.state.image }} style={{ borderBottomWidth: 1 }} ></Thumbnail>
            </Left>
            <Body style={{ marginRight: 15 }}>
              <H3 style={{ color: this.state.color }}>{this.state.username}</H3>
              <Text note style={{ color: this.state.color }}>{this.state.email}</Text>
            </Body>
          </ListItem>
          <DrawerContentScrollView {...this.props}   >
            <Animated.View style={{ transform: [{}] }}>
              <DrawerItemList {...this.props} inactiveTintColor={this.state.color} />
            </Animated.View>
          </DrawerContentScrollView>

        </Content>
        <Footer style={{ backgroundColor: this.state.background, borderStartWidth: 1 }} >
          <Right>
            <Button transparent style={{ backgroundColor: this.state.background }} onPress={async () => {
              this.logout();
            }}>
              <MaterialCommunityIcons name="account-arrow-left" style={{ color: HEADERBUTTONCOLOR, paddingLeft: 15 }} size={30}></MaterialCommunityIcons>
            </Button>
          </Right>

        </Footer>
      </Container >
    )
  }
}
