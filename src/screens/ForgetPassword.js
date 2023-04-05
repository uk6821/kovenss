import { useContext, useRef, useState } from 'react';
import { Button, View, Text, TextInput, Image, TouchableOpacity, Alert, } from 'react-native';
import { app } from '../config/config'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Card } from 'react-native-shadow-cards';
import * as Animatable from 'react-native-animatable';
import { ThemeContext } from '../store/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';







export function ForgetPasswordScreen(props) {

  const { state } = useContext(ThemeContext)

  const rubberBandAnimRef = useRef();

  function customAlert() {
    Alert.alert('Successful', 'Check your email for password reset link', [
      {
        text: 'Login',
        onPress: () => { props.navigation.navigate('Login') }

      },
    ])
  }

  const [Email, setEmail] = useState("")
  // const [Password, setPassword] = useState("")

  const forgetpasswordaccount = () => {


    const auth = getAuth(app);
    sendPasswordResetEmail(auth, Email)
      .then(() => {
        // Password reset email sent!
        // ..
        setEmail("")
        customAlert()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
        // ..
      });

  }


  return (
    <View style={{flex:1, backgroundColor:state.value.bgcolor}}>
      {state.value.bgcolor != 'white'
        ?
        <StatusBar style="light" backgroundColor={state.value.bgcolor} />
        :
        <StatusBar style="dark" backgroundColor={state.value.bgcolor} />}
      <View style={{ height: '60%', width: 280, alignSelf: 'center', marginTop: 190, }}>
        <View style={{
          height: 350, width: 340, borderRadius: 450, marginHorizontal: -310, marginVertical: -280, backgroundColor: '#00535354', top: 0,
        }} />
        <Card style={{ height: 400, width: 300, marginVertical: 270, alignSelf: 'center', borderRadius: 25, justifyContent: 'center', }}>
          <View style={{ width: 150, marginTop: 10, marginLeft: 75, }}>
            <Image source={require('../../assets/img.png')} style={{ width: 150, height: 150, }}></Image>
          </View>
          <View style={{ marginLeft: 15, marginTop: 60, }}>
            <TextInput style={{
              height: 40, width: 250, borderRadius: 10, padding: 10, backgroundColor: 'white', elevation: 5, marginLeft: 10,
            }}
              placeholder='Enter Your Email '
              value={Email}
              onChangeText={(val) => setEmail(val)}
            >

            </TextInput>


            <Animatable.View ref={rubberBandAnimRef} style={{ height: 40, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: '#00535354', alignSelf: 'flex-end', marginRight: 20, marginTop: 15, }}>
              <TouchableOpacity onPress={() => {
                if (true) {
                  rubberBandAnimRef.current.rubberBand(900);
                }
                console.log
                  ('Reset pressed')
                forgetpasswordaccount()
              }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Reset</Text>
              </TouchableOpacity>
            </Animatable.View>

            <TouchableOpacity style={{ marginTop: 19, marginLeft: 10, }} onPress={() => { props.navigation.navigate('Login') }}>
              <Text style={{ fontSize: 15, }}>Already have an account? Login now</Text>
            </TouchableOpacity>

          </View>
        </Card>
        <View style={{
          height: 350, width: 340, borderRadius: 450, backgroundColor: '#00535354', top: -170, marginLeft: 235,
        }} />
      </View>


    </View>

  );
}
