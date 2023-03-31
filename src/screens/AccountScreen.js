import React from 'react';
import { useState, } from 'react';
import {
  Button, View, Text, StyleSheet, Image,
  TextInput, TouchableOpacity,
  KeyboardAvoidingView, StatusBar, Switch
} from 'react-native';






export function AccountScreen ({ navigation }) {
    return(
      <View style={styles.container}>
        <Text>
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
  }
})