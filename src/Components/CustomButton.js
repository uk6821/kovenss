

import { View, Text, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { styles } from '../../Styles'
import * as Animatable from 'react-native-animatable';


export function CustomButton(props) {

const rubberBandAnimRef = useRef();

  return (
    <View style={styles.container}>
      <Animatable.View ref={rubberBandAnimRef}>
      <TouchableOpacity onPress={()=>{
        props.onCustomButtonPressed()
        if(true){
          rubberBandAnimRef.current.rubberBand (800);
        }
      }}  style={{ backgroundColor: '#00535354', height: 40, width: 85, alignSelf: 'center', alignItems: 'center', marginTop: 20, marginLeft: 10, borderRadius: 10,}}>
        <Text style={{ color: '#000', marginTop: 7, fontSize: 18, fontWeight: 'bold', }}>{props.title}</Text>
      </TouchableOpacity>
      </Animatable.View>
    </View>
  )
}
