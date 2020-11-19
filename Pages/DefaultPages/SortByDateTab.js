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
import { HEADERBUTTONCOLOR, RANDOMIMAGEURL } from "../URL";
import React, { Component } from 'react'

import { APILINK } from '../URL';
import GamesByStadium from './GamesByStadium'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default class SortByDateTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stadiums: [],
      dontload: false,
      errormsg: null,
      showmodal: false,
      stadium: null,
      loadingGames: false
    }
  }
  componentDidMount() {

  }
  async UNSAFE_componentWillMount() {
    let stadiums = await AsyncStorage.getItem("stadiums");
    if (stadiums == null || stadiums.length == 0) {
      await fetch(APILINK + "getstadiums/").then((resp) => {
        return resp.json();
      }).then(async (data) => {
        if ('Message' in data) {
          this.setState({ dontload: true, errormsg: "cant get stadiums" });
        } else {
          this.setState({ stadiums: data });
          await AsyncStorage.setItem("stadiums", JSON.stringify(data));
        }
      })
    }
    else {
      stadiums = await JSON.parse(stadiums);
      this.setState({ stadiums });
    }

  }
  render() {
    if (this.state.dontload == true) {
      return (
        <View>
          <Text>{this.state.errormsg}</Text>
        </View>
      )
    }
    else {
      return (
        <Container>
          <Header style={{ backgroundColor: "white" }}>
          <Right style={{ flex: 1 }}>
            <Button
              onPress={() => {
                this.props.navigation.toggleDrawer();
              }}
              style={{ backgroundColor: "white", color: "blue", flex: 1 }}
              transparent
            >
              {/* <Icon type="SimpleLineIcons" name="menu" size={30} color={HEADERBUTTONCOLOR} /> */}
              <MaterialCommunityIcons
                name="menu"
                size={30}
                color={HEADERBUTTONCOLOR}
              />
            </Button>
          </Right>
        </Header>

        <Content>
          {this.state.stadiums == null || this.state.stadiums.length == 0 ? <Text>Getting Stadiums...</Text> :
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
                        <Text2 note>{stadium.venue_name}</Text2>
                        <Text2 note numberOfLines={1}>{stadium.venue_hebrew_city}</Text2>

                      </Body>
                      <Right>
                        <Button transparent onPress={() => this.setState({ stadium, showmodal: true })}>
                          <Text2>משחקים</Text2>
                        </Button>
                      </Right>
                    </ListItem>
                  )
                })}
            </List>
          }
          <Modal visible={this.state.showmodal} animationType="fade" >
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
            <GamesByStadium stadium={this.state.stadium} />


          </Modal>


        </Content>
        </Container>
      )
    }
  }
}
