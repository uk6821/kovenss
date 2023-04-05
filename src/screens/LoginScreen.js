import { useEffect, useState, useContext } from 'react';
import { Button, View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { CustomButton } from '../Components/CustomButton'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../config/config'
import { Card } from 'react-native-shadow-cards';
import { ThemeContext } from '../store/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';






export function LoginScreen({ navigation }) {

  const { state, toggleTheme } = useContext(ThemeContext)
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const fetchcolor = async () => {
    try {
      const value = await AsyncStorage.getItem('mycolor')
      console.log("ubaid")
      console.log(value)
      if (value == null) {
        const temp = { bgcolor: 'white', txtcolor: 'black' }
        const jsonvalue = JSON.stringify(temp)
        await AsyncStorage.setItem('mycolor', jsonvalue)
      }
      else {
        const val = JSON.parse(value)
        toggleTheme(val.bgcolor, val.txtcolor)
      }
    } catch (e) {
      // error reading value
    }
  }

  useEffect(() => {
    //alert('it is Homescreen')
    setEmail("")
    setPassword("")
    fetchcolor()
  }, [])

  const signinaccount = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, Email, Password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setEmail("")
        setPassword("")
        navigation.navigate('Profiles', { key: user.email })

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setPassword("")
        setEmail("")
        alert(errorMessage)
      });
  }

  return (
    <View style={{ flex: 1, backgroundColor: state.value.bgcolor }}>
      {state.value.bgcolor != 'white'
        ?
        <StatusBar style="light" backgroundColor={state.value.bgcolor} />
        :
        <StatusBar style="dark" backgroundColor={state.value.bgcolor} />}
      <View style={{
        height: 350, width: 340, borderRadius: 450, marginHorizontal: -250, marginVertical: -100, backgroundColor: '#00535354', top: 0,
      }} />
      <Card style={{ height: 400, width: 300, marginVertical: 110, alignSelf: 'center', borderRadius: 25, justifyContent: 'center', }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 120, }} >
          <View style={{ marginBottom: 30, }}>
            <Image source={require('../../assets/img.png')} style={{ width: 150, height: 150, marginTop: -130, }}></Image>
          </View>
          <TextInput style={{
            height: 40, width: 250, borderRadius: 10, padding: 10, backgroundColor: 'white', elevation: 5,

          }}
            placeholder='Enter Your Email '
            value={Email}
            onChangeText={(val) => setEmail(val)}
          >

          </TextInput>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, }} >
          <TextInput style={{ height: 40, width: 250, borderRadius: 10, padding: 10, marginVertical: 10, backgroundColor: 'white', elevation: 5 }}
            placeholder='Password'
            secureTextEntry={true}
            value={Password}
            onChangeText={(val) => setPassword(val)}
          >
          </TextInput>
        </View>

        <View style={{ alignSelf: 'flex-end', marginRight: 80, marginTop: 5 }}>
          <TouchableOpacity onPress={() => {
            navigation.navigate('ForgetPassword')
          }}>
            <Text>Forgot Password ?</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 70, flexDirection: 'row', width: '50%', marginLeft: '25%', marginRight: '30%', justifyContent: 'space-between' }}>
          <CustomButton
            title='Login'
            onCustomButtonPressed={() => {
              signinaccount()
              console.log('Login pressed')
            }}></CustomButton>
          <CustomButton
            title='SignUp'
            onCustomButtonPressed={() => {
              navigation.navigate('Signup')
            }}></CustomButton>
        </View>
      </Card>
      <View style={{
        height: 350, width: 340, borderRadius: 450, backgroundColor: '#00535354', top: -30, marginLeft: 300,
      }} />
    </View>

  );
}
const style = StyleSheet.create({
  txt: {
    color: '#fff',
  },

})