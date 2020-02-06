import React from 'react'
import { StyleSheet, Text, View, Image, Button, TextInput} from 'react-native';

function AppLayout(){
    
}

const styles = StyleSheet.create({
    container :{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      },
      login:{
          flex:1
      },
      logo: {
          flex: 1,
          marginTop: 40,
      },
      number :{
          flex: 1
      }, 
      password :{
          flex: 1
      },
      button:{
          flex:1
      },
      imagen: {
          width: 50,
          height: 50,
          resizeMode: 'contain'
      },
      signup:{
          flex: 1,
          padding: 10
      }
  })

export default AppLayout