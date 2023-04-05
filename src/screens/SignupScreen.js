import { useState, useEffect, useRef, useContext } from 'react';
import { Button, View, Text, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, } from 'react-native';
import { app } from '../config/config'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDocs, doc, getFirestore, setDoc, collection, onSnapshot, query, getCountFromServer, orderBy } from 'firebase/firestore';
import { SafeAreaView } from 'react-native';
import { Card } from 'react-native-shadow-cards';
import { styles } from '../../Styles';
import * as Animatable from 'react-native-animatable';
import { ThemeContext } from '../store/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';


export function SignupScreen(props) {

  const { state } = useContext(ThemeContext)

  const rubberBandAnimRef = useRef();

  const db = getFirestore(app)

  const CustomActivityIndicator = () => {
    return (
      <View style={{ flex: 1, position: 'absolute', justifyContent: 'center', backgroundColor: '#555555DD', left: 0, top: 0, bottom: 0, right: 0 }}>
        <ActivityIndicator color="#FFA600" size="large" />
      </View>
    );
  };

  function customAlert() {
    Alert.alert('Successful', 'User created successfully', [
      {
        text: 'Login',
        onPress: () => { props.navigation.goBack() }

      },
      {
        text: 'Signup new user'

      }
    ])
  }

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [FirstName, setFirstName] = useState("")
  const [LastName, setLastName] = useState("")
  const [Age, setAge] = useState("")
  const [Number, setNumber] = useState("")
  const [profilelist, setProfilelist] = useState([])
  const [loading, setloading] = useState(false)

  const signupaccount = () => {


    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, Email.toLocaleLowerCase(), Password)
      .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        await setDoc(doc(db, "Profiles", Email.toLocaleLowerCase()), {
          firstname: FirstName,
          lastname: LastName,
          age: Age,
          number: Number,
          email: Email.toLocaleLowerCase(),
          dp: ""
        });
        setEmail("")
        setPassword("")
        setAge("")
        setFirstName("")
        setLastName("")
        setNumber("")
        setloading(false)
        customAlert()


        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setloading(false)
        alert(errorMessage)
        // ..
      });

  }

  useEffect(() => {
    const fetchdata = async () => {
      let chat = []
      try {
        const querySnapshot = await getDocs(collection(db, "Profiles"));
        querySnapshot.forEach((doc) => {
          chat.push(doc.data())
        });

      } catch (e) {
        console.log(e)
      }
      setProfilelist(chat)
    }
    fetchdata()
  }, [])

  const checkdata = () => {
    let ret = 'allow'
    profilelist.map((data) => {
      if (data.number == Number) {
        ret = 'notallow'
      }
    })
    return ret
  }



  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: state.value.bgcolor }}>

      {state.value.bgcolor != 'white'
        ?
        <StatusBar style="light" backgroundColor={state.value.bgcolor} />
        :
        <StatusBar style="dark" backgroundColor={state.value.bgcolor} />}

      <View style={{
        height: 350, width: 340, borderRadius: 450, marginHorizontal: -250, marginVertical: -110, backgroundColor: '#00535354', top: 0,
      }} />
      <Card style={{ height: 600, width: 300, marginVertical: 40, alignSelf: 'center', borderRadius: 25, justifyContent: 'center', }}>
        <View style={{ height: '60%', width: 280, alignSelf: 'center', marginTop: -70, }}>
          <View style={{ width: 150, marginVertical: -60, marginLeft: 60, }}>
            <Image source={require('../../assets/img.png')} style={{ width: 150, height: 150, }}></Image>
          </View>
          <View style={{ marginLeft: 15, marginTop: 75, }}>
            <TextInput style={{
              height: 40, width: 250, borderRadius: 10, padding: 10, backgroundColor: 'white', elevation: 5,

            }}
              placeholder='Enter Your First Name '
              value={FirstName}
              onChangeText={(val) => setFirstName(val)}
            >

            </TextInput>
            <TextInput style={{
              height: 40, width: 250, borderRadius: 10, padding: 10, backgroundColor: 'white', elevation: 5, marginTop: 8

            }}
              placeholder='Enter Your Last Name '
              value={LastName}
              onChangeText={(val) => setLastName(val)}
            >

            </TextInput>

            <TextInput style={{
              height: 40, width: 250, borderRadius: 10, padding: 10, backgroundColor: 'white', elevation: 5, marginTop: 8

            }}
              placeholder='Enter Your Number '
              keyboardType='phone-pad'
              value={Number}
              onChangeText={(val) => setNumber(val)}
            >

            </TextInput>

            <TextInput style={{
              height: 40, width: 250, borderRadius: 10, padding: 10, backgroundColor: 'white', elevation: 5, marginTop: 8

            }}
              placeholder='Enter Your Age '
              keyboardType='phone-pad'
              value={Age}
              onChangeText={(val) => setAge(val)}
            >

            </TextInput>
            <TextInput style={{
              height: 40, width: 250, borderRadius: 10, padding: 10, backgroundColor: 'white', elevation: 5, marginTop: 8

            }}
              placeholder='Enter Your Email '
              value={Email}
              onChangeText={(val) => setEmail(val)}
            >

            </TextInput>
            <TextInput style={{
              height: 40, width: 250, borderRadius: 10, padding: 10, backgroundColor: 'white', elevation: 5, marginTop: 8,

            }}
              placeholder='Enter Your Password'
              value={Password}
              secureTextEntry={true}
              onChangeText={(val) => setPassword(val)}
            >

            </TextInput>

            <Animatable.View ref={rubberBandAnimRef} style={{ marginLeft: 178, marginTop: 15, }}>
              <TouchableOpacity
                style={style.animbutton}
                onPress={() => {

                  if (true) {
                    rubberBandAnimRef.current.rubberBand(900);
                  }

                  const status = checkdata()
                  console.log(status)
                  if (status == "notallow") {
                    alert("Number already exist")
                  }
                  else {
                    setloading(true)
                    signupaccount()

                  }
                }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Sign up</Text>
              </TouchableOpacity>
            </Animatable.View>

            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { props.navigation.navigate('Login') }}>
              <Text>Already have an account? Login now</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Card>
      {loading ? CustomActivityIndicator() : null}

      <View style={{
        height: 350, width: 340, borderRadius: 450, backgroundColor: '#00535354', top: -60, marginLeft: 290,
      }} />

    </SafeAreaView>

  );
}
const style = StyleSheet.create({
  animbutton: {
    backgroundColor: '#00535354',
    height: 35,
    width: 75,
    paddingTop: 5,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,

  },
})
