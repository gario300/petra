import React, {Component} from 'react';
import {Container, Text, Button, Header, Left, 
Title, Content, Right, Body, Form, Item, Input,
Card,CardItem,Icon} from "native-base";
import Constants from 'expo-constants';
import {AsyncStorage,Alert, KeyboardAvoidingView} from 'react-native'
import axios from 'axios'
const CreditCard = require ('react-native-credit-card')
var stripe = require('stripe-client')('pk_test_SwNMpUovvmYcztMBanAjQhs400doMuUNSk');


export default class payment extends Component{
    constructor(props){
        super(props);
        this.state = {
            type: '',
            name: '',
            numero:'',
            mm: '',
            aa: '',
            cvc: '',
            jwt: '',
            image :'https://gradients.design/public/uploads/files/db15.png',
            myNumber: '',
            email: '',
            sendform: false
        }
    } 
    terminos = () =>{
        this.props.navigation.navigate('termsandconditions')
    }
    onChanged(text){
        let newText = '';
        let numbers = '0123456789';
    
        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("En este campo solo se permiten numeros");
            }
        }
        this.setState({ myNumber: newText });
    }
    onPayment = async () => {
        this.setState({sendform: true})
        let information = 
        {card :{
            number: this.state.myNumber,
            exp_month: this.state.mm,
            exp_year: this.state.aa,
            cvc: this.state.cvc,
            name: this.state.name
        }}
        let card = await stripe.createToken(information);
        let ctoken = card.id
        const petratoken = await AsyncStorage.getItem('petra-token')
        this.setState({jwt: petratoken})
        
        axios.post('https://petrapi.herokuapp.com/buy/premium',{
            tokenId: ctoken,
            email: this.state.email
        }, {headers: {Authorization: `Bearer ${this.state.jwt}`} }
        ).then(response => {
            this.setState({sendform: false})
            Alert.alert('Ahora eres un usuario premium')
              this.props.navigation.navigate('home')
        }).catch(error => {
            this.setState({sendform: false})
            Alert.alert('Tu pago no pudo ser procesado')
        })
        // send token to backend for processing
      }
    render(){
        return(
            <KeyboardAvoidingView style={{flex:1}} 
            behavior='padding'
            keyboardVerticalOffset={10}>
            <Container>
                <Header>
                </Header>
                 <Content>
                     <Card>
                        <CardItem style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
                            <CreditCard
                            type={this.state.type}
                            imageFront={this.state.image}
                            imageBack={this.state.image}
                            shiny={false}
                            bar={false}
                            number={this.state.myNumber}
                            name={this.state.name}
                            expiry={this.state.mm + this.state.aa}
                            cvc={this.state.cvc}
                            />
                        </CardItem>
                        <CardItem style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
                            <Text>
                                  Añade tu información de pago {"\n"}
                                Para contratar el servicio Premium
                            </Text>
                        </CardItem>
                     </Card>
                            <Form>
                                <Item>
                                    <Input
                                        keyboardType={'numeric'}
                                        placeholder="Numero de tarjeta a 16 dígitos"
                                        onChangeText={(numero) =>
                                        this.onChanged(numero)}
                                        value={this.state.myNumber}
                                        editable={!this.state.sendform}
                                        maxLength={16}
                                        />
                                </Item>
                                <Item>
                                    <Input
                                        placeholder="Nombre completo"
                                        onChangeText={(name) =>
                                        this.setState({name})}
                                        editable={!this.state.sendform}
                                        maxLength={16}/>
                                </Item>
                                <Item>
                                <Input
                                        placeholder="Email"
                                        onChangeText={(Email) =>
                                        this.setState({Email})}
                                        editable={!this.state.sendform}
                                        maxLength={40}/>
                                </Item>
                                <Item>
                                    <Input
                                        keyboardType={'numeric'}
                                        placeholder="Vigencia MM"
                                        onChangeText={(mm) =>
                                        this.setState({mm})}
                                        editable={!this.state.sendform}
                                        maxLength={2}/>
                                    <Input
                                        keyboardType={'numeric'}
                                        placeholder="Vigencia AA"
                                        onChangeText={(aa) =>
                                        this.setState({aa})}
                                        editable={!this.state.sendform}
                                        maxLength={2}/>
                                </Item>
                                <Item style={{marginBottom: 10}}>
                                    <Input
                                        keyboardType={'numeric'}
                                        placeholder="CVC"
                                        onChangeText={(cvc) =>
                                        this.setState({cvc})}
                                        editable={!this.state.sendform}
                                        maxLength={3}/>
                                </Item>
                                <Item last style={{marginBottom: 10}}>
                                    <Text style={{fontSize: 10}}>       
                                        <Text style={{fontSize: 12}}>
                                            Cómo usuario Premium podrás:{"\n"}
                                        </Text>
                                        -Solicitar la ayuda de un supervisor{"\n"}
                                        -Solicitar la ronda de un supervisor{"\n"}
                                        -Solicitar Información completa de un reporte{"\n"}
                                        -Solicitar fotos de un reporte{"\n"}
                                        -Solicitar que te llamen para detallar reportes{"\n"}
                                    <Text 
                                    style={{color: '#00ECFF', fontSize: 14, marginTop:5}}
                                    onPress={this.terminos}>Al pagar estarás aceptando nuestros Términos 
                                    y condiciones. 
                                    </Text>
                                    </Text>
                                </Item>
                                </Form>
                                {this.state.sendform == false 
                                ?
                                <Button block onPress={this.onPayment}>
                                    <Text>
                                        Pagar 250.00 MXN
                                    </Text>
                                </Button>
                                :
                                <Button block>
                                    <Text>
                                        Espera...
                                    </Text>
                                </Button>
                                }
                </Content>
            </Container>
            </KeyboardAvoidingView>
        )
    }
}