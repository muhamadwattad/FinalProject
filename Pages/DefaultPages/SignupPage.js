import * as ImagePicker from 'expo-image-picker';

import { Alert, AsyncStorage, FlatList, Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button as Btn, Container, Header, Icon, Left, Text as Text2 } from "native-base";
import React, { Component } from "react";

import AwesomeAlert from 'react-native-awesome-alerts';
import {HEADERBUTTONCOLOR} from '../URL'
import { Notifications } from 'expo';

// import * as LocalAuthentication from 'expo-local-authentication';









export default class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      rptpassword: '',
      profileuri: 'NULL',
      email: '',
      uri: null,
      alert: false,
      alerttitle: '',
      prog: false
    }
  }

  render() {
    return (
      <Container>
        <AwesomeAlert
          show={this.state.alert}
          showProgress={false}
          title={this.state.alerttitle}
          message={this.state.alertmessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Confirm"
          confirmButtonColor="red"
          useNativeDriver={true}
          onDismiss={() => {
            this.setState({ alert: false })
          }}
          onCancelPressed={() => {
            this.setState({ alert: false })
          }}
          onConfirmPressed={() => {
            this.setState({ alert: false })

          }}

        />
        <AwesomeAlert
          show={this.state.prog}
          showProgress={true}
          title={'Signing In'}
          // message={this.state.alertmessage}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={false}
          cancelText="No, cancel"
          confirmText="Confirm"
          confirmButtonColor="red"
          useNativeDriver={true}
          onDismiss={() => {
            this.setState({ prog: false })
          }}
          onCancelPressed={() => {
            this.setState({ alert: false })
          }}
          onConfirmPressed={() => {
            this.setState({ alert: false })

          }}

        />







        <ScrollView style={styles.container} >

          <View style={{ marginTop: 0, margin: 6 }}>
            <Text style={[styles2.inputTitle]}> Username</Text>
            <TextInput
              value={this.state.username}
              placeholder=""
              onChangeText={(username) => {
                this.setState({ username })
              }}
              style={styles2.input}
            />
            <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
            <Text style={[styles2.inputTitle, { marginTop: 4 }]}> Email</Text>
            <TextInput
              value={this.state.email}
              placeholder=""
              onChangeText={(email) => {
                this.setState({ email })
              }}
              style={styles2.input}
            />
            <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />

            <Text style={[styles2.inputTitle, { marginTop: 4 }]}> Password</Text>
            <TextInput
              value={this.state.password}
              placeholder=''
              onChangeText={(password) => {
                this.setState({ password })
              }}
              style={[styles2.input,]}
            />
            <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
            <Text style={[styles2.inputTitle, { marginTop: 4 }]}> Repeat Password</Text>
            <TextInput
              value={this.state.rptpassword}
              placeholder=""
              onChangeText={(rptpassword) => {
                this.setState({ rptpassword })
              }}
              style={styles2.input}
            />
            <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />

            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity onPress={() => this.pickImage()}>
                <View style={styles.socialButton}>

                  <Text style={[styles.text]} >Choose an Image</Text>
                </View>
              </TouchableOpacity>
            </View>





            <TouchableOpacity style={styles.submitContainer}
              onPress={this.register}
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
                Register
            </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30, marginTop: 55
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
    color: HEADERBUTTONCOLOR,
    fontSize: 14,
    fontWeight: "500"
  },
  submitContainer: {
    backgroundColor: HEADERBUTTONCOLOR,
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
    color: HEADERBUTTONCOLOR,
    fontSize: 14,

  },
  input: {
    paddingVertical: 12,
    color: "black",
    fontSize: 14,
    //  fontFamily: "Avenir Next"
  }
});