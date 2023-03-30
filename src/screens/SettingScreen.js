
import {
  Button, View, Text, StyleSheet, Image,
  TextInput, TouchableOpacity,
  KeyboardAvoidingView, StatusBar
} from 'react-native';







export function SettingScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TouchableOpacity onPress={()=>{
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
            <TouchableOpacity>
              <Image style={styles.img3}
                source={require('../../assets/Forwordarrow.png')} ></Image>
            </TouchableOpacity>
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
  },
})