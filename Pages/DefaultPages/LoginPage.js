import * as LocalAuthentication from 'expo-local-authentication';

import { APILINK, HEADERBUTTONCOLOR } from '../URL'
import { Alert, AsyncStorage, Dimensions, FlatList, I18nManager, Image, Keyboard, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Container, Header, Icon } from "native-base";
import React, { Component } from 'react';

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }
  Login = async () => {

    //checking if username and password exists in the DB
    var name = this.state.username;
    var password = this.state.password;

    //IF NAME OR PASSWORD ARE EMPTY SHOW ERROR MESSAGE
    if (name.length == 0 || password.length == 0) {
      //TODO Add ALERT TO SHOW ERROR
      return;
    }
    //IF NAME OR PASSWORD ARE EMPTY SHOW ERROR MESSAGE
    if (name == ' ' || password == ' ') {
      //TODO Add ALERT TO SHOW ERROR
      return;
    }

    console.log(APILINK + "Login/" + name + "/" + password);
    await fetch(APILINK + "Login/" + name + "/" + password).then((resp) => {
      return resp.json();
    }).then(async (data) => {
      console.log(data);
      //IF API RETURNS MESSAGE IT MEANS THAT INFORMATION ARE WRONG
      if ('Message' in data) {
        //TODO Add ALERT TO SHOW ERROR
        console.log("user doesnt exists");
      }
      else {
        await AsyncStorage.setItem("activeuser", JSON.stringify(data));
        this.props.navigation.navigate("DefaultPages");
      }
    })


  }
  async componentDidMount() {
    var user = await AsyncStorage.getItem("activeuser");
    var autologin = await AsyncStorage.getItem("autologin");
    var loginfinger = await AsyncStorage.getItem("loginfinger");
    console.log("LOGIN FINGER : " + loginfinger);
    console.log("AUTO LOGIN " + autologin);
    console.log("USER: " + user);
    if (user != null) {
      //CHECKING IF USER HAS AUTOLOGIN ON!!!
      if (autologin == "True" || autologin == null)
        if (loginfinger == "True") {
          //LOGINING IN WITH FINGER PRINTS
          let result = await LocalAuthentication.authenticateAsync(

          );
          
          if (result.success == true) {
            this.props.navigation.navigate("DefaultPages");
          }
          else {
            this.setState({ username: JSON.parse(user).name });
          }
        }
        else
          this.props.navigation.navigate("DefaultPages");
      else {
        this.setState({ username: JSON.parse(user).name });
      }
    }

  }
  SignUp = () => {
    this.props.navigation.navigate("Signup");
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.bigCircle}></View>
          <View style={styles.smallCircle}></View>
          <View style={styles.centerizedView}>
            <View style={styles.authBox}>
              <View style={styles.logoBox}>
                <Icon
                  style={{ fontSize: 50, color: '#fff' }}
                  name='soccer'
                  type="MaterialCommunityIcons"
                  size={50}
                />
              </View>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Icon name="facebook" type="Entypo" style={{ color: HEADERBUTTONCOLOR, fontSize: 30 }}
                  onPress={this.FaceBookLogin}
                />
              </View>
              <Text style={{ color: 'grey', textAlign: 'center', marginTop: 15, fontSize: 20 }}>או</Text>

              <View style={styles.hr}></View>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>שם משתמש</Text>
                <TextInput
                  value={this.state.username}

                  style={styles.input}


                  onChangeText={(username) => {
                    this.setState({ username });
                  }}
                />
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>סיסמה</Text>
                <TextInput
                  value={this.state.password}
                  style={styles.input}

                  secureTextEntry={true}
                  textContentType='password'
                  onChangeText={(password) => {
                    this.setState({ password })
                  }}
                />
              </View>
              <TouchableOpacity style={styles.loginButton} onPress={this.Login}>
                <Text style={styles.loginButtonText}>התחברות</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.SignUp}>
                <Text style={styles.registerText}>
                  אין לך חשבון? הירשם כאן
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.ForgotPassword}>
                <Text style={styles.forgotPasswordText}>שכחת את הסיסמה שלך ?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
    // return (
    //     <View style={{width:'100%'}}>
    //       <View style={{ marginTop: 0, alignItems: "center", justifyContent: "center" }}>
    //         <Image source={require("../../assets/logo.jpg")} style={{ height: 220 }} />
    //       </View>
    //       <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
    //         <TouchableOpacity onPress={this.FaceBookLogin}>
    //           <View style={styles.socialButton}>
    //             <Image source={require("../../assets/logo.jpg")} style={styles.socialLogo} />
    //             <Text style={styles.text}>Facebook</Text>
    //           </View>
    //         </TouchableOpacity>


    //       </View>

    //       <Text style={[styles.text, { color: "#ABB4BD", fontSize: 15, textAlign: "center", marginVertical: 20 }]}>או</Text>

    //       <Text style={[styles2.inputTitle]}> שם משתמש</Text>
    //       <TextInput
    //         value={this.state.username}
    //         placeholder=""
    //         onChangeText={(username) => {
    //           this.setState({ username })
    //         }}
    //         style={[styles2.input],{borderWidth:1,textAlign:'center'}}
    //       />
    //       <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
    //       <Text style={styles2.inputTitle}> סיסמה</Text>
    //       <TextInput
    //         value={this.state.password}
    //         placeholder=''
    //         onChangeText={(password) => {
    //           this.setState({ password })
    //         }}
    //         style={styles2.input}
    //       />
    //       <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />



    //       <Text style={[styles.text, styles.link, { textAlign: "right" }]} onPress={this.ForgotPassword}>שכחת את הסיסמה שלך ?</Text>

    //       <TouchableOpacity style={styles.submitContainer}
    //         onPress={this.Login}
    //       >
    //         <Text
    //           style={[
    //             styles.text,
    //             {
    //               color: "#FFF",
    //               fontWeight: "600",
    //               fontSize: 16
    //             }
    //           ]}
    //         >
    //           התחברות
    //         </Text>
    //       </TouchableOpacity>

    //       <Text
    //         style={[
    //           styles.text,
    //           {
    //             fontSize: 14,
    //             color: "#ABB4BD",
    //             textAlign: "center",
    //             marginTop: 24
    //           }
    //         ]}
    //       >
    //         אין לך חשבון ? <Text style={[styles.text, styles.link]} onPress={this.SignUp}>הירשם </Text>
    //       </Text>
    //     </View>

    // );
  }
}
//HEADERBUTTONCOLOR
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bigCircle: {
    width: Dimensions.get('window').height * 0.7,
    height: Dimensions.get('window').height * 0.7,
    backgroundColor: HEADERBUTTONCOLOR,
    borderRadius: 1000,
    position: 'absolute',
    right: Dimensions.get('window').width * 0.25,
    top: -50,
  },
  smallCircle: {
    width: Dimensions.get('window').height * 0.4,
    height: Dimensions.get('window').height * 0.4,
    backgroundColor: HEADERBUTTONCOLOR,
    borderRadius: 1000,
    position: 'absolute',
    bottom: Dimensions.get('window').width * -0.2,
    right: Dimensions.get('window').width * -0.3,
  },
  centerizedView: {
    width: '100%',
    top: '15%',
  },
  authBox: {
    width: '80%',
    backgroundColor: '#fafafa',
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: HEADERBUTTONCOLOR,
    borderRadius: 1000,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: -50,
    marginBottom: -50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  loginTitleText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },
  hr: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#444',
    marginTop: 6,
  },
  inputBox: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#dfe4ea',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: HEADERBUTTONCOLOR,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  forgotPasswordText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
});