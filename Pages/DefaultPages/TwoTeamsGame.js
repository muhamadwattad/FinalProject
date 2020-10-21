import { AsyncStorage, Dimensions, Modal, Picker, Text, View } from 'react-native'
import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text as Text2, Thumbnail } from 'native-base'
import React, { Component } from 'react'

import { APILINK } from '../URL'
import DropDownPicker from 'react-native-dropdown-picker';
import GameInfo from './GameInfo';
import { HEADERBUTTONCOLOR } from '../URL'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class TwoTeamsGame extends Component {


  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      selectedvalue1: "בחר קבוצה",
      selectedvalue2: "בחר קבוצה",
      games: [],
      openmodal: false
    }
  }
  async componentDidMount() {

  }
  async UNSAFE_componentWillMount() {
    //GETTING TEAMS AND SAVING THEM INTO THE STATE
    var teams = await JSON.parse(await AsyncStorage.getItem("teams"));
    this.setState({ teams,games:[]});
  }

  getgame = async () => {
    var team1 = this.state.selectedvalue1
    var team2 = this.state.selectedvalue2
    //CHECKING IF USER SELECTED TWO TEAMS
    if (team1 == "NOTHING" || team2 == "NOTHING") {
      //TODO SHOW ERROR MESSAGE that says user must choose two teams
      this.setState({ games: [] })
      return;
    }
    if (team1 == team2) {
      //TODO show error message that user has to choose 2 different teams
    }
    else {
      //GETTING GAMES FROM API

      var url = APILINK + "/getgamesbetween2teams/" + team1 + "/" + team2;

      await fetch(url).then((resp) => {
        return resp.json();
      }).then((data) => {
        console.log(data);
        if ('Message' in data) {

          //TODO SHOW ERROR MESSAGE THAT THERES NO GAMES

        }
        else {
          this.setState({ games: data });
        }
      })
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
          <Body>
            <Text>TEST TEST</Text>
          </Body>



        </Header>


        <View style={{ height: 60, justifyContent: 'space-between', flexDirection: 'row', width: '100%', display: 'flex', }}>
          <View style={{ alignItems: 'flex-start' }} >
            <Picker
              mode="dropdown"
              selectedValue={this.state.selectedvalue1}
              style={{ height: 50, width: windowWidth / 2 }}
              onValueChange={(itemValue, itemIndex) => this.setState({ selectedvalue1: itemValue }, () => this.getgame())}
            >
              <Picker.Item label="בחר קבוצה" value="NOTHING" key={"NOTHING"} />
              {this.state.teams.map((team, index) => {

                return (
                  <Picker.Item label={team.name} value={team.team_id} key={index.toString()} />
                )
              })
              }
            </Picker>

          </View>

          <View style={{ alignItems: 'flex-end', borderRightWidth: 1, borderColor: 'black' }} >
            <Picker

              mode="dropdown"
              selectedValue={this.state.selectedvalue2}
              style={{ height: 50, width: windowWidth / 2, }}

              onValueChange={(itemValue, itemIndex) => this.setState({ selectedvalue2: itemValue }, () => this.getgame())}
            >
              <Picker.Item label="בחר קבוצה" value="NOTHING" />
              {this.state.teams.map((team, index) => {

                return (
                  <Picker.Item label={team.name} value={team.team_id} key={index.toString()} />
                )
              })
              }
            </Picker>
          </View>

        </View>
        <Content>
          {this.state.games.length == 0||this.state.games==null ? <Text>NULL</Text> :
            <List scrollEnabled={true}>

              {this.state.games.map((game, index) => {
                var homeTeam = this.state.teams.find(team => team.team_id == game.homeTeamCode);
                var awayTeam = this.state.teams.find(team => team.team_id == game.awayTeamCode);
                var matchdate = game.event_date.split(" ")[0];
                var matchdate2 = game.event_date.split(" ")[1];
                
                return (
                  <ListItem key={index.toString()}>

                    {/*HOME TEAM*/}
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%', display: 'flex', }}>
                      <View style={{ alignItems: 'flex-start' }}>
                        <Thumbnail source={{ uri: homeTeam.logo }}  />
                      
                      </View>
                      <View style={{ borderColor: 'black', }}>
                        <Text style={{ textAlign: 'center' }}> {matchdate}</Text>

                        <Text2 note>{matchdate2}</Text2>
                        <Text2 note style={{ color: '#228B22' }} onPress={() => {
                          this.setState({ openmodal: true, gameinfo: game,homeTeam,awayTeam });
                        }}> צפיה בפרטי המשחק</Text2>

                      </View>
                      {/*AWAY TEAM*/}
                      <View style={{ alignItems: 'flex-end' }}>
                        <Thumbnail source={{ uri: awayTeam.logo }} />
                      </View>
                    </View>
                  </ListItem>
                )
              })}


            </List>



          }


        </Content>
        <Modal visible={this.state.openmodal}>
          <Header style={{ backgroundColor: 'white' }}>

            <Right style={{ flex: 1 }} >

              <Button onPress={() => {
                this.setState({ openmodal: false });

              }} style={{ backgroundColor: 'white', color: 'blue', flex: 1 }} transparent >
                {/* <Icon type="SimpleLineIcons" name="menu" size={30} color={HEADERBUTTONCOLOR} /> */}
                <MaterialCommunityIcons name="close" size={30} color={HEADERBUTTONCOLOR} />
              </Button>
            </Right>
            <Body>
              <Text>TEST TEST</Text>
            </Body>
          </Header>

          <GameInfo game={this.state.gameinfo} homeTeam={this.state.homeTeam} awayTeam={this.state.awayTeam}/>
        </Modal>





      </Container>
    )
  }
}
