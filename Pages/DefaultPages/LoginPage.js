import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, I18nManager, Alert, Keyboard, AsyncStorage, Modal } from "react-native";

//import AwesomeAlert from 'react-native-awesome-alerts';
import { APILINK } from '../URL'

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
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

    await fetch(APILINK + "Login/" + name + "/" + password).then((resp) => {
      return resp.json();
    }).then(async (data) => {
      console.log(data);
      //IF API RETURNS MESSAGE IT MEANS THAT INFORMATION ARE WRONG
      if (data.Message == "Failed to login") {
        //TODO Add ALERT TO SHOW ERROR
        console.log("user doesnt exists");
      }
      else {
       await AsyncStorage.setItem("activeuser", JSON.stringify(data));
        this.props.navigation.navigate("Into");
      }
    })


  }
  SignUp = () => {
    this.props.navigation.navigate("Signup");
  };

  render() {

    return (

      <ScrollView style={styles.container} >

        <View>
          <View style={{ marginTop: 0, alignItems: "center", justifyContent: "center" }}>
            <Image source={require("../../assets/logo.jpg")} style={{ height: 220 }} />
          </View>
          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity onPress={this.FaceBookLogin}>
              <View style={styles.socialButton}>
                <Image source={require("../../assets/logo.jpg")} style={styles.socialLogo} />
                <Text style={styles.text}>Facebook</Text>
              </View>
            </TouchableOpacity>


          </View>

          <Text style={[styles.text, { color: "#ABB4BD", fontSize: 15, textAlign: "center", marginVertical: 20 }]}>או</Text>

          <Text style={[styles2.inputTitle]}> שם משתמש</Text>
          <TextInput
            value={this.state.username}
            placeholder=""
            onChangeText={(username) => {
              this.setState({ username })
            }}
            style={styles2.input}
          />
          <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
          <Text style={styles2.inputTitle}> סיסמה</Text>
          <TextInput
            value={this.state.password}
            placeholder=''
            onChangeText={(password) => {
              this.setState({ password })
            }}
            style={styles2.input}
          />
          <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />



          <Text style={[styles.text, styles.link, { textAlign: "right" }]} onPress={this.ForgotPassword}>שכחת את הסיסמה שלך ?</Text>

          <TouchableOpacity style={styles.submitContainer}
            onPress={this.Login}
          >
            <Text
              style={[
                styles.text,
                {
                  color: "#FFF",
                  fontWeight: "600",
                  fontSize: 16
                }
              ]}
            >
              התחברות
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.text,
              {
                fontSize: 14,
                color: "#ABB4BD",
                textAlign: "center",
                marginTop: 24
              }
            ]}
          >
            אין לך חשבון ? <Text style={[styles.text, styles.link]} onPress={this.SignUp}>הירשם </Text>
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30, marginTop: 50
  },
  text: {
    // fontFamily: "Avenir Next",
    color: "#1D2029"
  },
  socialButton: {
    flexDirection: "row",
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(171, 180, 189, 0.65)",
    borderRadius: 4,
    backgroundColor: "#fff",
    shadowColor: "rgba(171, 180, 189, 0.35)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5
  },
  socialLogo: {
    width: 16,
    height: 16,
    marginRight: 8
  },
  link: {
    color: "#228B22",
    fontSize: 14,
    fontWeight: "500"
  },
  submitContainer: {
    backgroundColor: "#228B22",
    fontSize: 16,
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    shadowColor: "rgba(255, 22, 84, 0.24)",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5
  }
});

const styles2 = StyleSheet.create({
  inputTitle: {
    color: "#228B22",
    fontSize: 14,

  },
  input: {
    paddingVertical: 12,
    color: "black",
    fontSize: 14,
    //  fontFamily: "Avenir Next"
  }
});