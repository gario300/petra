import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  AsyncStorage,
  Image
} from 'react-native'
import {Icon, Button, Text} from 'native-base'
import {createAppContainer, createSwitchNavigator } from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import Login from './pages/login'
import home from './pages/home'
import reports from './pages/reports'
import report from './pages/report'
import payment from './pages/paypremium'
import needsupervition from './pages/needsupervition'
import reportemergence from './pages/reportemergence'
import cancelsubscription from './pages/cancelsubscription'
import details from './pages/details'
import termsandconditions from './pages/Termsandconditions'
import privacy from './pages/privacy'
import axios from 'axios';


const HomeStack = createStackNavigator({
  home: {
    screen: home
  },
  reports: {
    screen: reports
  },
  report: {
    screen:report
  },
  payment: {
    screen :payment
  },
  needsupervition: {
    screen: needsupervition
  },
  reportemergence:{
    screen: reportemergence
  },
  cancelsubscription:{
    screen: cancelsubscription
  },
  details:{
    screen:details
  },
  termsandconditions:{
    screen:termsandconditions
  }
},{headerMode: 'none'})

const LoginStack = createStackNavigator({
  login: {
    screen: Login,
    navigationOptions: {
      title: 'PETRA',
      headerStyle: {backgroundColor: '#494EB3'},
      headerTitleStyle: { color:'white', fontSize: 28}
    },
  },
  privacy: {
    screen: privacy
  }
},{headerLayoutPreset: 'center'})

class AuthLoadingScreen extends Component{
  constructor(props){
    super(props);
    this.state = {
      version : false,
      conection: false,
    }
  }
  componentDidMount(){
    this.getversion()
  }

  getversion = async()=>{
    const current = '1.0.0'
    axios.post('https://petrapi.herokuapp.com/version',{
      appversion: current
    }) .then(response => {
      this._loadData()
    }).catch(error => {
      if(!error.response){
        this.setState({version: false, conection: true})
      } else{
        this.setState({conection: false, version: true})
      }
    })
  }

  vizualizar(){
    if(this.state.conection == false && this.state.version == false){
      return(
        <Image 
         style={{width: 70, height: 70}}
            source={{uri: 'https://res.cloudinary.com/scute/image/upload/v1579660771/logros/petra_v7ynxi.png'}}
        />
      )
    } else if(this.state.version == true && this.state.conection == false){
      return(
        <View style={{alignItems: 'center'}}>
          <Icon type="Feather" name="alert-triangle"/>
          <Text>Tu version de PETRA no es la más reciente porfavor ¡Actualiza!</Text>
        </View>
      )
    } else if(this.state.conection == true && this.state.version == false){
      return(    
        <View style={{flex: 1, 
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'}}>
                <View style={{flex:1}}>
                <Icon type="Feather" name="alert-triangle"/>
                </View>
                <View style={{flex:1}}>
                    <Text>Hubo un error de conexión, intentalo más tarde</Text>
                </View>
                <View style={{flex:1}}>
                    <Button onPress={this.getversion}>
                        <Text>
                            Reintentar
                        </Text>
                    </Button>
                </View>
         </View>
      )
    }
  }

  render(){
    return(
      <View style={{flex: 2, 
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10}}>
        {this.vizualizar()}
      </View>
    )
  }
  _loadData = async()=>{
    try{
    await AsyncStorage.getItem('petra-token').then((value) =>{
      if (value == null){
        this.props.navigation.navigate('Auth')
      } else {
        this.props.navigation.navigate('App')
      }
    })
  } catch(error){
    this.setState({version: false, conection: true})
  }
  }
  
}



export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: HomeStack,
      Auth: LoginStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
