import React from 'react';
import { useState, useContext } from 'react';
import {
  Button, View, Text, StyleSheet, Image,
  TextInput, TouchableOpacity,
  KeyboardAvoidingView, StatusBar, Switch
} from 'react-native';
import { ThemeContext } from '../store/context/ThemeContext';






export function AccountScreen ({ navigation }) {

  const {state} = useContext(ThemeContext)

    return(
      <View style={[styles.container, {backgroundColor: state.value.bgcolor}]}>
        <Text style={{color: state.value.txtcolor}}>
          Accounts Screen
        </Text>
      </View>
    )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    borderWidth:1,
    alignContent:'center',
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:state.value.bgcolor
  }
})