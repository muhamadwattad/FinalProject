import { Agenda, Calendar, CalendarList } from 'react-native-calendars';
import { Animated, AsyncStorage, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Text as Text2, Thumbnail } from 'native-base';
import { Cell, Col, Cols, Row, Rows, Table, TableWrapper } from 'react-native-table-component';
import React, { Component } from 'react'

import { APILINK } from '../URL'
import { Dimensions } from 'react-native';
import { HEADERBUTTONCOLOR } from '../URL';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

//DAYS OF THE WEEK IN HEBREW AND ENGLISH
const arrayOfWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const arrayOfWeekdays2 = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'ששי', 'שבת']
//WIDTH AND HEIGHT OF PHONE WINDOW
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function TurnDate(date) {
  //TURNS DATE TO C# DATE TO GET DATA FROM API
  var arr = date.split("/");

  var day = "" + arr[0];
  var month = "" + arr[1];

  if (day.length == 1)
    day = "0" + day;
  if (month.length == 1)
    month = "0" + month;

  var newDate = month + "-" + day;
  return newDate;

}
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      FavoriteOnOff: 'black',
      showCalendar: false,
      teams: [],

    }

  }
  async componentDidMount() {
    //getting teams
    var teams = await JSON.parse(await AsyncStorage.getItem("teams"));
    this.setState({ teams }, () => {

    });

    //updating user's status TO ACTIVE

    var user = await AsyncStorage.getItem("activeuser");
    var currentuser = JSON.parse(user);
    var url = APILINK + "updateStatus/" + currentuser.email + "/true/"
    await fetch(url);

    if (this.state.games == "No Games Found") {

    }
    else {

    }


  }

  getDates = async () => {
    //GETTING THE DAYS OF THE REST OF THE WEEK
    var dateObj = new Date()

    var monthAbbrvName = dateObj.toDateString().substring(4, 7);



    var weekdayNumber = dateObj.getDay()

    var tmr;
    var in2days;

    if (weekdayNumber == 6)
      tmr = 0;
    else tmr = weekdayNumber + 1;
    if (tmr == 6)
      in2days = 0;
    else
      in2days = tmr + 1;


    var yestrday;
    var _2daysago;
    if (weekdayNumber == 0)
      yestrday = 6
    else yestrday = weekdayNumber - 1;
    if (yestrday == 0)
      _2daysago = 6;
    else
      _2daysago = yestrday - 1;


    this.setState({ today: weekdayNumber });
    this.setState({ _2daysago, yestrday, tmr, in2days });



    //GETTING DATES OF IN TODAY AND TOMRROW AND 2 DAYS FROM TODAY AND YESTRDAY AND 2 DAYS AGO 

    var yestrdaydate = new Date(dateObj);
    yestrdaydate.setDate(yestrdaydate.getDate() - 1);

    var _2daysagodate = new Date(yestrdaydate);
    _2daysagodate.setDate(_2daysagodate.getDate() - 1);

    var tomorrowdate = new Date(dateObj);
    tomorrowdate.setDate(tomorrowdate.getDate() + 1);

    var _in2daysdate = new Date(tomorrowdate);
    _in2daysdate.setDate(_in2daysdate.getDate() + 1);

    var todaystring = dateObj.getDate() + "/" + moment().format("MM");
    var yestrdaystring = yestrdaydate.getDate() + "/" + moment(yestrdaydate).format("MM");
    var _2daysagostring = _2daysagodate.getDate() + "/" + moment(_2daysagodate).format("MM");
    var tomorrowstring = tomorrowdate.getDate() + "/" + moment(tomorrowdate).format("MM");
    var _in2daysstring = _in2daysdate.getDate() + "/" + moment(_in2daysdate).format("MM");
    this.setState({ selecteddate: 'SelectedDate\n' + todaystring })




    this.setState({ todaystring, yestrdaystring, _2daysagostring, tomorrowstring, _in2daysstring });
    //DATE OF GAMEDAY (TODAY)
    var MonthString = "" + moment().format("MM");
    if (MonthString.length == 1)
      MonthString = "0" + MonthString;
    var DayString = "" + dateObj.getDate();
    if (DayString.length == 1)
      DayString = "0" + DayString;

    var GameDayDate = MonthString + "-" + DayString

    this.setState({ GameDayDate });

  }
  getGames = async () => {
    //GETTING GAMES AND SAVING THEM INTO THE ASYNC STORAGE

    var url = APILINK + "getgamesbydate/10-05";

    await fetch(url).then((resp) => {
      return resp.json();
    }).then(async (data) => {
      //CHECKING IF GAMES HAS BEEN ADDED SUCCESFULLY
      if (data.Message.includes("No Games Found")) {
        //SHOWING ERROR MESSAGE
        this.setState({ games: "No Games Found" });


      }
      else {
        //SAVING GAMES INTO ARRAY IN THE STATE AND IN ASYNC STORAGE 
        this.setState({ games: data });



      }
    });
  }

  async UNSAFE_componentWillMount() {
    this.getDates();

    this.getGames();
  }


  SaveGames = async (date) => {
    //TURNING DATE TO C# DATE TO GET DATA FROM API

    var NewDate = TurnDate(date);
    var url = APILINK + "getgamesbydate/" + NewDate;


    await fetch(url).then((resp) => {
      return resp.json();
    }).then(async (data) => {
      //CHECKING IF GAMES HAS BEEN ADDED SUCCESFULLY
      if ('Message' in data) {

        this.setState({ games: "No Games Found" }, () => {
          if (this.state.showCalendar == true)
            this.setState({ showCalendar: false })
        });
      }
      else {
        //SAVING GAMES INTO ARRAY IN THE STATE AND IN ASYNC STORAGE 
        this.setState({ games: data }, () => {
          this.setState({ showCalendar: false });
        });

      }
    });


  }


  render() {
    return (
      <Container >
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
            <Text>{this.state.selecteddate}</Text>
          </Body>



        </Header>
        <Modal
          transparent={true}

          animationType="fade"
          visible={this.state.showCalendar}
        >
          <Container >
            <Header style={{ backgroundColor: 'white' }}>

              <Right style={{ flex: 1 }} >

                <Button onPress={() => {
                  this.setState({ showCalendar: false })

                }} style={{ backgroundColor: 'white', color: 'blue', flex: 1 }} transparent >

                  <MaterialCommunityIcons name="close" size={30} color={HEADERBUTTONCOLOR} />
                </Button>
              </Right>

            </Header>
            <Content style={{ marginTop: 12, height: 150 }}>
              <Calendar


                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={'2020-08-30'}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined

                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {


                  var date = "" + day.day + "/" + day.month;
                  this.SaveGames(date);


                }}


                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'MMM yyyy '}
                // Handler which gets executed when visible month changes in calendar. Default = undefined


                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}

                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}

                // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                disableAllTouchEventsForDisabledDays={true}
                // Replace default month and year title with custom one. the function receive a date as parameter.

                // Enable the option to swipe between months. Default = false
                enableSwipeMonths={false}
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#b6c1cd',
                  textSectionTitleDisabledColor: '#d9e1e8',
                  selectedDayBackgroundColor: '#00adf5',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#00adf5',
                  dayTextColor: '#2d4150',
                  textDisabledColor: '#d9e1e8',
                  dotColor: '#00adf5',
                  selectedDotColor: '#ffffff',
                  arrowColor: 'green',
                  disabledArrowColor: '#d9e1e8',
                  monthTextColor: HEADERBUTTONCOLOR,
                  indicatorColor: 'blue',
                  textDayFontFamily: 'monospace',
                  textMonthFontFamily: 'monospace',
                  textDayHeaderFontFamily: 'monospace',
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 16
                }}
              />
            </Content>
          </Container>

        </Modal>

        {/*DATES VIEW */}
        <View style={{
          width: '100%', height: windowHeight / 13, borderColor: 'black', borderBottomWidth: 1, borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1,
          flexDirection: "row", backgroundColor: 'white'
        }}>
          <TouchableOpacity style={{ width: '14%', paddingTop: 4, textAlign: 'center', }}>
            <MaterialCommunityIcons name="heart" size={30} color={this.state.FavoriteOnOff} style={{ margin: 8 }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '14%', paddingTop: 4, textAlign: 'center', }}
            onPress={() => {
              this.SaveGames(this.state._2daysagostring)
            }}
          >
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }} key={1}>{arrayOfWeekdays2[this.state._2daysago]}</Text>
            <Text style={styles.dateString} key={2}>{this.state._2daysagostring}</Text>

          </TouchableOpacity >
          <TouchableOpacity style={{ width: '14%', paddingTop: 4, textAlign: 'center', }}
            onPress={() => {
              this.SaveGames(this.state.yestrdaystring)
            }}
          >
            <Text key={3} style={{ fontWeight: 'bold', textAlign: 'center' }}>{arrayOfWeekdays2[this.state.yestrday]}</Text>

            <Text key={4} style={styles.dateString}>{this.state.yestrdaystring}</Text>
          </TouchableOpacity >

          <TouchableOpacity style={{ width: '14%', paddingTop: 4, textAlign: 'center', }}
            onPress={() => {
              this.SaveGames(this.state.todaystring);
            }}
          >
            <Text key={5} style={{ fontWeight: 'bold', textAlign: 'center' }}>היום</Text>
            <Text key={6} style={styles.dateString}>{this.state.todaystring}</Text>
          </TouchableOpacity >

          <TouchableOpacity style={{ width: '14%', paddingTop: 4, textAlign: 'center', }}
            onPress={() => {
              this.SaveGames(this.state.tomorrowstring);
            }}
          >
            <Text key={7} style={{ fontWeight: 'bold', textAlign: 'center' }}>{arrayOfWeekdays2[this.state.tmr]}</Text>
            <Text key={8} style={styles.dateString}>{this.state.tomorrowstring}</Text>
          </TouchableOpacity >
          <TouchableOpacity style={{ width: '14%', paddingTop: 4, textAlign: 'center', }} onPress={() => {
            this.SaveGames(this.state._in2daysstring);
          }}>
            <Text key={9} style={{ fontWeight: 'bold', textAlign: 'center' }}>{arrayOfWeekdays2[this.state.in2days]}</Text>
            <Text key={10} style={styles.dateString}>{this.state._in2daysstring}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '14%', paddingTop: 4, textAlign: 'center', }}

            onPress={() => {
              this.setState({ showCalendar: true })
            }}
          >
            <MaterialCommunityIcons name="calendar" size={30} color={HEADERBUTTONCOLOR} style={{ margin: 8 }} />
          </TouchableOpacity>
        </View>

        <Content scrollEnabled={true}>



          {this.state.games == "No Games Found" ? <Text>NULL</Text> :
            <List scrollEnabled={true} onScroll={(e) => {

            }}>
              {
                this.state.games.map((game, index) => {

                  while (this.state.teams.length == 0 || this.state.teams == null) {
                    //get teams again
                  }

                  var homeTeam = this.state.teams.find(team => team.team_id == game.homeTeamCode);
                  var awayTeam = this.state.teams.find(team => team.team_id == game.awayTeamCode);
                  var matchdate=game.event_date.split(" ")[1];
                  
                  return (
                    <ListItem key={index.toString()}>
                      
                      {/*HOME TEAM*/}
                      <View style={{}}>
                      <View>
                        <Thumbnail source={{ uri: homeTeam.logo }} />
                      </View>
                      <View style={{ alignSelf: 'flex-end',borderColor: 'black', borderBottomWidth: 1, borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1,width:windowWidth/3}}>
                        <Text style={{textAlign:'center'}}> {matchdate}</Text>
                      </View>
                      {/*AWAY TEAM*/}
                      <View style={{alignSelf: 'flex-start'}}>
                        <Thumbnail source={{ uri: awayTeam.logo }} />
                      </View>
                      </View>
                    </ListItem>
                  )
                })
              }
            </List>
          }

        </Content>

      </Container>
    )
  }
} const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff', fontFamily: 'monospace' },
  text: { textAlign: 'center', borderLeftColor: 'black', borderRadius: 1, margin: 6, fontFamily: 'monospace' },
  dateString: { textAlign: 'center', fontWeight: 'bold', color: '#228B22', fontFamily: 'monospace' }
});
