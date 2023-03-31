import React from 'react';
import { useState, } from 'react';
import {
  Button, View, Text, StyleSheet, Image,
  TextInput, TouchableOpacity,
  KeyboardAvoidingView, StatusBar, Switch
} from 'react-native';






export function SettingScreen({ navigation }) {

  const [checked, setchecked] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TouchableOpacity onPress={() => {
          navigation.navigate('Profiles')
        }}>
          <View style={styles.imgview1}>
            <Image style={styles.img1}
              source={require('../../assets/backarrow.png')} ></Image>
          </View>
        </TouchableOpacity>
        <View style={styles.txtview1}>
          <Text style={styles.settingtxt}>
            Settings
          </Text>
        </View>
        <View style={styles.txtview2}>
          <Text style={styles.acctxt}>
            Accounts
          </Text>
        </View>
        <View style={styles.imgview2}>
          <Image style={styles.img2}
            source={require('../../assets/Profiles.png')}  >
          </Image>
          <View style={styles.txtview3}>
            <Text style={styles.uktxt}>
              Umer Khan
            </Text>
            <Text style={styles.perstxt}>
              Personal Info
            </Text>
          </View>
          
            <View style={styles.imgview3}>
            <TouchableOpacity style={{ height: 40, width: 40,}} onPress={()=>{
            navigation.navigate('Accounts')
          }}>
              <Image style={styles.img3}
                source={require('../../assets/Forwordarrow.png')} ></Image>
                </TouchableOpacity>
            </View>
          
        </View>
        <View style={styles.txtview4}>
          <Text style={styles.settingtxt4}>
            Settings
          </Text>
        </View>
        <View style={styles.langview}>
          <View style={styles.langimg}>
            <Image style={styles.lanimg}
              source={require('../../assets/Language.png')}>
            </Image>
          </View>
          <View style={styles.lantxtview}>
            <Text style={styles.lantxt}>
              Language
            </Text>
          </View>
          <View style={styles.Engtxtview}>
            <Text style={styles.Engtxt}>
              English
            </Text>
          </View>
          <View style={styles.lanbtn}>
            <TouchableOpacity style={{ height: 40, width: 40, }}>
              <Image style={styles.lanbtnimg}
                source={require('../../assets/Forwordarrow.png')} ></Image>
            </TouchableOpacity>
          </View>

        </View>
        <View style={styles.notiview}>
          <View style={styles.notiimgview}>
            <Image style={styles.notiimg} source={require('../../assets/Notification.png')} ></Image>
          </View>
          <View style={styles.notitxtview}>
            <Text style={styles.notitxt}>
              Notifications
            </Text>
          </View>
          <View style={styles.notibtn}>
            <Image style={styles.notibtnimg} source={require('../../assets/Forwordarrow.png')}>

            </Image>
          </View>
        </View>
        <View style={styles.toggleview}>
          <View style={styles.darkview}>
              <Image style={styles.darkimg}
               source={require('../../assets/Darkmode.png')}></Image>
          </View>
          <View style={styles.darktxtview}>
          <Text style={styles.darktxt}>
              Darkmode
          </Text>
          </View>
          <View style={styles.toggle}>
            <Switch
              value={checked}
              onValueChange={() => setchecked(!checked)}
            />
          </View>
        </View>
      </View>
    </View>
  )


}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
  body: {
    top: 50,
    flex: 1,
    backgroundColor: 'white'
  },
  imgview1: {
    height: 40,
    width: 40,
    alignItems: 'center',
    backgroundColor: '#ECE8E8',
    justifyContent: 'center',
    borderRadius: 13,
    left: 35,
    top: 30,
  },
  img1: {
    height: 40,
    width: 40,
  },
  txtview1: {
    height: 55,
    width: 170,
    top: 80,
    left: 40,
  },
  settingtxt: {
    fontSize: 45,
    fontWeight: 'bold',
  },
  txtview2: {
    width: '26%',
    top: 140,
    left: 42,
  },
  acctxt: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  imgview2: {
    height: 70,
    width: '85%',
    left: 42,
    top: 179,
    flexDirection: 'row',
  },
  img2: {
    height: 50,
    width: 50,
    top: 8,
  },
  txtview3: {
    left: 20,

  },
  uktxt: {
    fontSize: 20,
    fontWeight: 'bold',
    top: 7,
  },
  perstxt: {
    fontSize: 15,
    color: '#A29F9F',
    top: 10,
  },
  imgview3: {
    height: 40,
    width: 40,
    alignItems: 'center',
    backgroundColor: '#ECE8E8',
    justifyContent: 'center',
    borderRadius: 13,
    left: 140,
    top: 13
  },
  img3: {
    height: 30,
    width: 30,
    alignSelf:'center',
    top:4
  },
  txtview4: {
    width: 90,
    top: 230,
    left: 41,
  },
  settingtxt4: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  langview: {
    height: 60,
    width: '80%',
    top: 265,
    left: 40,
    flexDirection: 'row',
  },
  langimg: {
    height: 47,
    width: 47,
    borderRadius: 25,
    top: 5,
    backgroundColor: '#FCECDB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lanimg: {
    height: 23,
    width: 23,
    tintColor: '#F69A38',
  },
  lantxtview: {
    height: 50,
    width: 120,
    top: 4,
    left: 15,
  },
  lantxt: {
    fontSize: 24,
    fontWeight: 'bold',
    left: 8,
    top: 7
  },
  lanbtn: {
    height: 40,
    width: 40,
    alignItems: 'center',
    backgroundColor: '#ECE8E8',
    justifyContent: 'center',
    borderRadius: 13,
    left: 65,
    top: 8
  },
  lanbtnimg: {
    height: 30,
    width: 30,
    left: 4,
    top: 4,
  },
  Engtxtview: {
    height: 30,
    width: 60,
    left: 45,
    alignItems: 'center',
    justifyContent: 'center',
    top: 12,
  },
  Engtxt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A29F9F'
  },
  notiview: {
    height: 50,
    width: '80%',
    flexDirection: 'row',
    left: 41,
    top: 285,
  },
  notiimgview: {
    height: 47,
    width: 47,
    borderRadius: 25,
    backgroundColor: '#daf0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notiimg: {
    height: 28,
    width: 28,
    tintColor: '#0D90E8'
  },
  notitxtview: {
    height: 30,
    width: 135,
    left: 19,
    top: 9,
  },
  notitxt: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notibtn: {
    height: 40,
    width: 40,
    alignItems: 'center',
    backgroundColor: '#ECE8E8',
    justifyContent: 'center',
    borderRadius: 13,
    left: 109,
    top: 4
  },
  notibtnimg: {
    height: 30,
    width: 30,
  },
  toggleview: {
    flexDirection: 'row',
    top: 310,
  },
  toggle: {
    width: 50,
    left: 170,
  },
  darkview: {
    height: 47,
    width: 47,
    borderRadius: 25,
    left: 41,
    backgroundColor: '#F7E9F9',
    alignContent:'center',
    justifyContent:'center',
  },
  darkimg:{
    height:30,
    width:30,
    alignSelf:'center',
    tintColor:'#771984'
  },
  darktxtview:{
    height:30,
    left:59,
    top:9,
  },
  darktxt:{
    fontSize:24,
    fontWeight:'bold',
  },

})