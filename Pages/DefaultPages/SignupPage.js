import * as ImagePicker from 'expo-image-picker';

import { APILINK, HEADERBUTTONCOLOR } from '../URL'
import { Alert, AsyncStorage, Dimensions, FlatList, I18nManager, Image, Keyboard, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Button, Container, Header, Icon, Left } from "native-base";
import React, { Component } from 'react';

import AwesomeAlert from 'react-native-awesome-alerts'
import { Notifications } from 'expo';

// import * as LocalAuthentication from 'expo-local-authentication';

let x;
export default class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      image: '',
      showView: true,
      inputOpen: '',
      errorMsg: '',
      showError: false
    }
  }
  PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7
      //allowsEditing: true,
      //aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  }
  componentDidMount() {
    //Checking if keyboard is on or off to hide the Views of email and username
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  componentWillUnmount() {
    //removing the Keybaord Listener
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow = () => {

    //if user wants to type his password Email and username's view is hidden so the user can see what is he typing.
    if (x == 'password') {
      this.setState({ showView: false })
    }
  }
  Signup = async () => {
    //Checking if user added Username+password+image
    if (!(this.state.username.length >= 8 && this.state.username <= 12)) {
      //Username must be between 8-12
      this.setState({ errorMsg: 'אורך שם המשתמש חייב להיות בין 8 ל 12 אותיות.', showError: true })
      return;
    }
    if (!(this.state.password.length >= 6 && this.state.password.length <= 14)) {

      //password must be between 6-14
      this.setState({ errorMsg: 'אורך הסיסמה חייב להיות בין 6 ל 14 אותיות.', showError: true })
      return;
    }
    //checking if user has uploaded a profile picture.
    if (this.state.image.length == 0) {
      this.setState({ errorMsg: 'עליך להוסיף תמונת פרופיל.', showError: true });
      return;
    }
    //Username , password and Profile are all good

    //Uploading Image First to File


    // var obj = {
    //   User_Name: this.state.username,
    //   User_Email: this.state.email,
    //   User_Password: this.state.password,
    //   User_Location: "undefined",
    //   User_Token: "undefined",
    //   User_Image: ""
    // };
    // var config = {
    //   method: 'POST',
    //   body: JSON.stringify(obj),
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Accept": "application/json"
    //   }
    // };


  }
  _keyboardDidHide = () => {
    //keyboard off
    this.setState({ showView: true });

  }
  imageUploadToApi = async (imgUri, picName) => {

    let dataI = new FormData();
    dataI.append('picture', {
      uri: imgUri,
      name: picName,
      type: 'image/jpg'
    });
    const config = {
      method: 'POST',
      body: dataI,
    }

    await fetch(APILINK + "uploadpicture", config)
      .then((res) => {
        if (res.status == 201) { return res.json(); }
        else { return "err"; }
      })
      .then((responseData) => {
        if (responseData != "err") {
          let picNameWOExt = picName.substring(0, picName.indexOf("."));
          let imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt),
            responseData.indexOf(".jpg") + 4);
          this.setState({
            imageNameWithGuid: imageNameWithGUID
          }, () => console.log(this.state.imageNameWithGuid));
        }
        else {
          //TODO show error
          alert('error uploding ...');
        }
      })
      .catch(err => {
        //TODO show error  

        alert('err upload= ' + err);


      });

  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

        <View style={styles.container}>
          <AwesomeAlert
            show={this.state.showError}
            showProgress={false}
            title="שגיאה!"
            message={this.state.errorMsg}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="לְהַמשִׁיך"
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => {
              this.setState({ showError: false })
            }}
            onConfirmPressed={() => {
              this.setState({ showError: false })
            }}
          />
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

              <Text style={{ textAlign: 'center', marginTop: 15, fontSize: 20 }}>הרשמה</Text>

              <View style={styles.hr}></View>
              {this.state.showView &&
                <View>
                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>שם משתמש</Text>
                    <TextInput
                      onFocus={() => x = 'username'}
                      value={this.state.username}

                      style={styles.input}


                      onChangeText={(username) => {
                        this.setState({ username });
                      }}
                    />
                  </View>

                  <View style={styles.inputBox}>
                    <Text style={styles.inputLabel}>מייל</Text>
                    <TextInput
                      onFocus={() => x = 'email'}
                      value={this.state.email}
                      style={styles.input}

                      textContentType='emailAddress'
                      onChangeText={(email) => {
                        this.setState({ email })
                      }}
                    />
                  </View>
                </View>
              }

              <View style={styles.inputBox}>
                <Text style={styles.inputLabel}>סיסמה</Text>
                <TextInput
                  value={this.state.password}
                  style={styles.input}
                  onFocus={() => x = 'password'}
                  secureTextEntry={true}
                  textContentType='password'
                  onChangeText={(password) => {
                    this.setState({ password })
                  }}
                />
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={this.PickImage}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name="home" style={{ width: '20%', fontSize: 30, color: '#fff', fontWeight: 'bold', }} />
                  <Text style={{

                    width: '60%',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>תמונה</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.loginButton]} onPress={this.Signup}>
                <Text style={styles.loginButtonText}>הרשמה</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );

  }
}
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