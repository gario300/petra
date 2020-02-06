import React, {Component} from 'react';
import {Container, Text, Button, Header, Left, 
Title, Content, Right, Body, Form, Item, Input,
Card,CardItem,Icon,CheckBox, Textarea} from "native-base";
import Constants from 'expo-constants';
import {AsyncStorage,Alert, View, KeyboardAvoidingView} from 'react-native'
import axios from 'axios'
var stripe = require('stripe-client')('pk_test_SwNMpUovvmYcztMBanAjQhs400doMuUNSk');

export default class paysupervition extends Component{
    constructor(proops){
        super(proops);
        this.state= {
            casa: false,
            zona:false,
            paycasa: false,
            payzona:false,

            numero: '',
            name: '',
            MM: '',
            AA:'',
            CVC: '',
            
            suscribe: false,
            loading: true,
            err: false,
            sendform: false,
            jwt: '',

            calle: '',
            colonia: '',
            numerocasa:'',
            coments: '',
            tokenpago:''
        }
    }
    async componentWillMount() {
            const token = await AsyncStorage.getItem('petra-token')
            this.setState({ jwt: token });
            await axios.get('https://petrapi.herokuapp.com/account/mypremium', {
                headers: {Authorization: `Bearer ${this.state.jwt}`}
            }).then(response => {
                this.setState({
                    suscribe:response.data.data
                })
            }).catch(error => {
                this.setState({err : true})
            })
        }

    casa = () => {
        this.setState({casa: true, zona:false, paycasa: false, payzona:false})
    }
    zona = () =>{
        this.setState({casa: false, zona:true, paycasa:false, payzona:false})
    }

    pagarcasa = () => {
        if(this.state.suscribe == false && this.state.calle !== ''
        && this.state.colonia !== '' && this.state.numerocasa !== '' &&
        this.state.coments !== ''){
            this.setState({paycasa:true})
        } else {
            Alert.alert('Verifica todos los campos')
        }
    }
    
    pagarzona = () => {
        if(this.state.suscribe == false && this.state.calle !== ''
        && this.state.colonia !== '' && this.state.numerocasa !== '' &&
        this.state.coments !== ''){
            this.setState({payzona:true})
        }else {
            Alert.alert('Verifica todos los campos')
        }
    }

    enviarpremium = async(tipo) =>{
        if(this.state.sendform == false){
            this.setState({sendform : true})
            if(this.state.suscribe == true && this.state.calle !== ''
            && this.state.colonia !== '' && this.state.numerocasa !== '' &&
            this.state.coments !== ''){
                const token = await AsyncStorage.getItem('petra-token')
                this.setState({jwt:token})
                await axios.post('https://petrapi.herokuapp.com/buy/supervition',{
                    tokenId: null,
                    calle: this.state.calle,
                    colonia: this.state.colonia,
                    numerocasa: this.state.numerocasa,
                    coments:this.state.coments,
                    type: tipo,
                    price: null
                },{headers:{Authorization: `Bearer ${this.state.jwt}`} , timeout:60000
                }).then(response => {
                    this.setState({sendform : false, calle: '',
                    colonia: '', coments:'', price: ''})
                    Alert.alert('Tu solicitud fue enviada ¡Estamos en camino!')
                    this.props.navigation.navigate('home')
                }).catch(error => {
                    if(!error.response){
                        this.setState({sendform: false})
                        Alert.alert('Hay problemas con tu conexión, intentalo más tarde')
                    } else{
                        Alert.alert(error.response.data.message)
                        this.setState({sendform: false})
                    }
                })
            } else{Alert.alert('verifica los datos') 
        
                this.setState({sendform: false})} 
        }
    }

    enviarpago = async(tipo, price) =>{
        if(this.state.sendform == false){
            this.setState({sendform : true})
            if(this.state.numero !== '' && this.state.name !== '' && this.state.MM !== ''
            && this.state.AA !== '' && this.state.CVC !== ''){
                const token = await AsyncStorage.getItem('petra-token')
                this.setState({jwt:token})
                
                let information = 
                {card :{
                    number: this.state.numero,
                    exp_month: this.state.MM,
                    exp_year: this.state.AA,
                    cvc: this.state.CVC,
                    name: this.state.name
                }}

                let card = await stripe.createToken(information);
                let ctoken = card.id

                axios.post('https://petrapi.herokuapp.com/buy/supervition', {
                    tokenId: ctoken,
                    calle: this.state.calle,
                    colonia: this.state.colonia,
                    numerocasa: this.state.numerocasa,
                    coments:this.state.coments,
                    type: tipo,
                    price: price
                },{headers:{Authorization: `Bearer ${this.state.jwt}`}, timeout:60000
                }).then(response => {
                    this.setState({sendform : false, calle: '',
                    colonia: '', coments:'', price: '', name: '', MM : '', AA:'', CVC: '',
                    numero:''})
                    Alert.alert('Tu solicitud fue enviada ¡Estamos en camino!')
                    this.props.navigation.navigate('home')
                }).catch(error => {
                    if(!error.response){
                        this.setState({sendform: false})
                        Alert.alert('Hay problemas con tu conexión, intentalo más tarde')
                    } else{
                        Alert.alert(error.response.data.message)
                        this.setState({sendform: false})
                    }
                })
            } else {
                Alert.alert('Porfavor, llena los campos correctamente')
                this.setState({sendform: false})
            }
        }
    }

    casaform(){
        if(this.state.casa == true && this.state.paycasa == false){
            return(
                <Container>
                <Form>
                    <Item>
                        <Input
                        placeholder='Calle (5 a 25 caracteres)'
                        onChangeText={(calle) =>
                        this.setState({calle})}
                        editable={!this.state.sendform}
                        maxLength={25}
                        />
                    </Item>
                    <Item>
                        <Input
                        placeholder='Colonia (5 a 25 caracteres)'
                        onChangeText={(colonia) =>
                        this.setState({colonia})}
                        editable={!this.state.sendform}
                        maxLength={25}/>
                    </Item>
                    <Item>
                        <Input
                        placeholder='Numero de casa (2 a 5 caracteres)'
                        onChangeText={(numerocasa) =>
                        this.setState({numerocasa})}
                        editable={!this.state.sendform}
                        maxLength={5}/>
                    </Item>
                    <Item>
                        <Textarea 
                        placeholder="Comentarios (25 a 300 caracteres)" 
                        onChangeText={(coments) =>
                        this.setState({coments})}
                        editable={!this.state.sendform}
                        maxLength={300}/>
                    </Item>
                </Form>
                { 
                this.state.suscribe == false
                ?
                <Button
                onPress={this.pagarcasa}
                 block>
                    <Text>
                        Pagar 80 MXN
                    </Text>
                </Button>
                :
                <Button
                onPress={() => {this.enviarpremium('casa')}}
                 block>
                    { 
                    this.state.sendform == false
                    ?
                    <Text>
                        Solicitar
                    </Text>
                    :
                    <Text>
                        Espera...
                    </Text>
                    }
                </Button>
                }
                </Container>
            )
        } else if(this.state.casa == true && this.state.paycasa == true){
            return(
                <Container>
                    <CardItem>
                        <Text>
                            Añade tu información de pago
                        </Text>
                    </CardItem>
                    <Form>
                        <Item>
                            <Input
                                keyboardType={'numeric'}
                                placeholder="Numero de tarjeta a 16 dígitos"
                                onChangeText={(numero) =>
                                this.setState({numero})}
                                editable={!this.state.sendform}
                                maxLength={16}/>
                        </Item>
                        <Item>
                            <Input
                                placeholder="Nombre completo"
                                onChangeText={(name) =>
                                this.setState({name})}
                                maxLength={22}/>
                        </Item>
                            <Item>
                                <Input
                                    keyboardType={'numeric'}
                                    placeholder="Vigencia MM"
                                    onChangeText={(MM) =>
                                    this.setState({MM})}
                                    editable={!this.state.sendform}
                                    maxLength={2}/>
                                <Input
                                    keyboardType={'numeric'}
                                    placeholder="Vigencia AA"
                                    onChangeText={(AA) =>
                                    this.setState({AA})}
                                    editable={!this.state.sendform}
                                    maxLength={2}/>
                            </Item>
                            <Item>
                                <Input
                                    keyboardType={'numeric'}
                                    placeholder="CVC"
                                    onChangeText={(CVC) =>
                                    this.setState({CVC})}
                                    editable={!this.state.sendform}
                                    maxLength={3}/>
                            </Item>
                    </Form>
                    {
                    <Button 
                    onPress={() => {this.enviarpago('casa', '80000')}}
                    success block>
                        { this.state.sendform == false
                        ?
                        <Text>
                            Pagar 80.00 MXN
                        </Text>
                        :
                        <Text>
                            Espera...
                        </Text>
                        }
                    </Button>
                    }
                </Container>
            )
        }
    }

    zonaform(){
        if(this.state.zona == true && this.state.payzona == false){
            return(
                <Container >
                <Form>
                    <Item>
                        <Input
                        placeholder='Calle (5 a 25 caracteres)'
                        onChangeText={(calle) =>
                        this.setState({calle})}
                        editable={!this.state.sendform}
                        maxLength={25}
                        />
                    </Item>
                    <Item>
                        <Input
                        placeholder='Colonia (5 a 25 caracteres)'
                        onChangeText={(colonia) =>
                        this.setState({colonia})}
                        editable={!this.state.sendform}
                        maxLength={25}/>
                    </Item>
                    <Item>
                        <Input
                        placeholder='Tu numero de casa (1 a 5 caracteres)'
                        onChangeText={(numerocasa) =>
                        this.setState({numerocasa})}
                        editable={!this.state.sendform}
                        maxLength={5}/>
                    </Item>
                    <Item>
                        <Textarea placeholder="Comentarios (25 a 300 caracteres)" 
                        onChangeText={(coments) =>
                        this.setState({coments})}
                        editable={!this.state.sendform}
                        maxLength={300}/>
                    </Item>
                </Form>
                { 
                this.state.suscribe == false
                ?
                <Button
                onPress={this.pagarzona}
                 block>
                    <Text>
                        Pagar 120 MXN
                    </Text>
                </Button>
                :
                <Button
                onPress={() => {this.enviarpremium('zona')}}
                 block>
                    { this.state.sendform == false
                    ?
                    <Text>
                        Solicitar
                    </Text>
                    :
                    <Text>
                        Espera...
                    </Text>
                    }
                </Button>
                }
                </Container>
            )
        } else if(this.state.zona == true && this.state.payzona == true){
            return(
                <Container>
                    <CardItem>
                        <Text>
                            Añade tu información de pago
                        </Text>
                    </CardItem>
                    <Form>
                        <Item>
                            <Input
                                keyboardType={'numeric'}
                                placeholder="Numero de tarjeta a 16 dígitos"
                                onChangeText={(numero) =>
                                this.setState({numero})}
                                editable={!this.state.sendform}
                                maxLength={16}/>
                        </Item>
                        <Item>
                            <Input
                                placeholder="Nombre completo"
                                onChangeText={(name) =>
                                this.setState({name})}
                                editable={!this.state.sendform}
                                maxLength={22}/>
                        </Item>
                            <Item>
                                <Input
                                    keyboardType={'numeric'}
                                    placeholder="Vigencia MM"
                                    onChangeText={(MM) =>
                                    this.setState({MM})}
                                    editable={!this.state.sendform}
                                    maxLength={2}/>
                                <Input
                                    keyboardType={'numeric'}
                                    placeholder="Vigencia AA"
                                    onChangeText={(AA) =>
                                    this.setState({AA})}
                                    editable={!this.state.sendform}
                                    maxLength={2}/>
                            </Item>
                            <Item>
                                <Input
                                    keyboardType={'numeric'}
                                    placeholder="CVC"
                                    onChangeText={(CVC) =>
                                    this.setState({CVC})}
                                    editable={!this.state.sendform}
                                    maxLength={3}/>
                            </Item>
                    </Form>
                    <Button 
                    onPress={() => {this.enviarpago('zona', '120000')}}
                    success block>
                        { this.state.sendform == false
                        ?
                        <Text>
                            Pagar 120.00 MXN
                        </Text>
                        :
                        <Text>
                            Espera...
                        </Text>
                        }
                    </Button>
                </Container>
            )
        }
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
                        <CardItem>
                            <Left>
                                <Text>
                                Supervisar Casa
                                </Text>
                            </Left>
                            <Body/>
                            <Right>
                                <CheckBox 
                                checked={this.state.casa}
                                onPress={this.casa}/>
                            </Right>
                        </CardItem>
                        { this.state.casa == true
                        ?
                        <View style={{height: 285}}>
                        {this.casaform()}
                        </View>
                        :
                        <View>

                        </View>
                        }
                    </Card>
                    <Card>
                        <CardItem>
                            <Left>
                                <Text>
                                Supervisar Zona
                                </Text>
                            </Left>
                            <Body/>
                            <Right>
                                <CheckBox 
                                checked={this.state.zona}
                                onPress={this.zona}/>
                            </Right>
                        </CardItem>
                        {this.zonaform()}
                    </Card>
                </Content>
            </Container>
            </KeyboardAvoidingView>
        )
    }
}