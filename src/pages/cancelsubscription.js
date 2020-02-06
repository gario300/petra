import React, {Component} from 'react';
import {Container, Text, Button, Header, Left, Title, 
Content,Card,CardItem,Icon , Form, Input,
Item, Textarea} from "native-base";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { View, AsyncStorage,Alert,Image} from 'react-native'
import axios from 'axios'

export default class cancelsubscription extends Component{
    constructor(proops){
        super(proops);
        this.state = {
            sendform: false,
            password: ''
        }
    }

    cancelsubscription = async() =>{
        if(this.state.sendform == false){
            this.setState({sendform: true})
            const token = await AsyncStorage.getItem('petra-token')
            axios.post('https://petrapi.herokuapp.com/account/cancelsubscription',{
                password: this.state.password
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }, timeout:60000
                }).then(response => {
                this.setState({password : '', sendform: false})
                Alert.alert('¡Cancelaste tu solicitud con éxito!')
                this.props.navigation.navigate('home')
            }).catch(error =>{
                if(!error.response){
                    this.setState({password : '', sendform: false})
                    Alert.alert('Hay problemas con tu conexión, intentalo más tarde')
                } else{
                this.setState({password : '', sendform: false})
                Alert.alert('Error, debe ser exactamente igual a tu nombre de usuario')
                }
            })

        }
    }

    render(){
        return(
            <Container>
                <Header>

                </Header>
                <Content style={{marginTop:30}}>
                    <Text>Escribe tu nombre de usuario para cancelar tu suscripción</Text>
                    <Input
                    placeholder="Usuario"
                    secureTextEntry={true}
                    onChangeText={(password) =>
                    this.setState({password})}
                    editable={!this.state.sendform}/>
                    { this.state.sendform == false
                    ?
                    <Button onPress={this.cancelsubscription} full>
                        <Text>
                        Cancelar mi subscripción
                        </Text>
                    </Button>
                    :
                    <Button full>
                        <Text>
                            Espera...
                        </Text>
                    </Button>
                    }
                </Content>
            </Container>
        )
    }
}