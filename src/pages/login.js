import React, {Component} from 'react';
import {StyleSheet, View, Image, } from 'react-native'
import {Container, Content, Card, CardItem, Text, Item, Input, 
Form, Button, Footer, Picker, Icon, Label, Header } from "native-base";
import axios from 'axios';
import { AsyncStorage, KeyboardAvoidingView} from 'react-native';
import { Alert } from 'react-native'

export default class AnatomyExample extends Component {

  constructor (){
    super();
      this.state  ={
        register : 0,
        selected: "key0",
        numero: '',
        password: '',
        registrypassword: '',
        nombre: '',
        notierror: '',
        sendform: false,
        myNumber: null
      }
  }

  _handleFocus(event, refName) {
    let node = React.findNodeHandle(this.refs[refName]);
    let extraHeight = 100;
    this.refs.keyboardAwareScrollView.scrollToFocusedInput(event, node, extraHeight);
}

  cambiarformulario = () =>{
    if (this.state.register){
    this.setState({
      register : this.state.register + 1
    })
    } else{
    this.setState({
        register : this.state.register - 1
    })
    }
  }
  privacy = () =>{
      this.props.navigation.navigate('privacy')
  }
  
  onValueChange (value: string) {
    this.setState({
      selected: value
    });
}

    login = async() => {
        this.setState({sendform: true})
         await axios.post('https://petrapi.herokuapp.com/login',{
             number: '961'+this.state.myNumber,
             password: this.state.password,
         },{timeout:60000}).then(response => {
            if(response.data.status == 'success'){
            AsyncStorage.setItem('petra-token', response.data.data.token)
            this.props.navigation.navigate('home')}
        }).catch(error =>{
                this.setState({sendform: false})
                if(!error.response){
                    Alert.alert('Hay problemas con tu conexión, intentalo más tarde')
                } else{
                  Alert.alert(
                      error.response.data.message
                 )}
        }) 
    }

    signup = async() =>{
        this.setState({sendform: true})
        await axios.post('https://petrapi.herokuapp.com/signup', {
            name: this.state.nombre,
            gender: this.state.selected,
            number: '961'+this.state.myNumber,
            password: this.state.registrypassword,
        },{timeout:60000}).then(response => {
            AsyncStorage.setItem('petra-token', response.data.data.token)
            this.props.navigation.navigate('home')
        }).catch(error =>{ 
            this.setState({sendform: false})
            if(!error.response){
                Alert.alert('Hay problemas con tu conexión, intentalo más tarde')
            } else{
              Alert.alert(
                  error.response.data.message
             )}
        })

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
                alert("En este campo solo se permiten números");
            }
        }
        this.setState({ myNumber: newText });
    }

  render() {

    return (
    <KeyboardAvoidingView style={{flex:1}} 
    behavior='padding'
    keyboardVerticalOffset={10}>
    <Container>
    {
    this.state.register == 0
    ?
    <Container style={{marginTop: 40}}>
        <View style={{alignItems: 'center', marginTop: 20, marginBottom:20}}>
        <Image
            style={{width: 50, height: 50}}
            source={{uri: 'https://res.cloudinary.com/scute/image/upload/v1579660771/logros/petra_v7ynxi.png'}}
        />
        </View>
        <Content>
            <Card>
                <CardItem header>
                    <Text>
                        Accede para que monitoreemos tu seguridad
                    </Text>
                </CardItem>
            </Card>
            <Form style={{marginTop: 30}}>
                <Item>
                    <Picker
                    mode="dropdown"
                    placeholder="LADA"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    style={{ width: 2 }}
                        >
                        <Picker.Item label="961" value="961" />
                    </Picker>
                    <Input
                    keyboardType={'numeric'}
                    placeholder="Numero"
                    onChangeText={(numero) =>
                    this.onChanged(numero)}
                    value={this.state.myNumber}
                    maxLength={7}
                    editable={!this.state.sendform}/>
                </Item>
                <Item>
                    <Input 
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    onChangeText={(password) =>
                    this.setState({password})}
                    editable={!this.state.sendform}
                    />
                </Item>
            </Form>
                    { this.state.sendform == false
                    ?
                    <Button block onPress={this.login}>
                        <Text>
                            Acceder
                        </Text>
                    </Button>
                    :
                    <Button block >
                        <Text>
                            Espera un segundo...
                        </Text>
                    </Button>
                    }
                <Text 
                onPress={this.privacy}
                style={{color: '#00ECFF', fontSize: 14, marginTop:5}}>
                Consulta aquí nuestra política de privacidad</Text>
        </Content>
        <Footer style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
            { this.state.sendform == false ?
            <Text style={{color:'white'}}
            onPress={this.cambiarformulario}> Registrate Gratis Aquí</Text>
            :
            <Text style={{color:'white'}}> Registrate Gratis Aquí</Text>
            }
        </Footer>
    </Container>
    :
    <Container>
         <View style={{alignItems: 'center', marginTop: 20, marginBottom:20}}>
            <Image
                style={{width: 50, height: 50}}
                source={{uri: 'https://res.cloudinary.com/scute/image/upload/v1579660771/logros/petra_v7ynxi.png'}}
            />
            </View>     
            <Content>
                <Card>
                    <CardItem header>
                        <Text>
                            Registrate resguardaremos tu seguridad
                            ¡Gratis!
                        </Text>
                    </CardItem>
                </Card>
                <Form style={{marginTop: 30}}>
                    <Item>
                        <Input
                         placeholder="Nombre (10 Caracteres)"
                         maxLength={10}
                         onChangeText={(nombre) => this.setState({nombre})}
                         editable={!this.state.sendform}/>
                    </Item>
                    <Item>
                        <Picker
                        mode="dropdown"
                        placeholder="LADA"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ width: 2 }}
                            >
                            <Picker.Item label="961" value="961" />
                        </Picker>
                        <Input
                         keyboardType={'numeric'}
                         placeholder="Numero"
                         onChangeText={(numero) =>
                         this.onChanged(numero)}
                         value={this.state.myNumber}
                         maxLength={7}
                         editable={!this.state.sendform}/>
                    </Item>
                    <Item>
                        <Input 
                        placeholder="Contraseña (De 8 a 15 caracteres)"
                        secureTextEntry={true}
                        onChangeText={(registrypassword) => this.setState({registrypassword})}
                        maxLength={15}
                        editable={!this.state.sendform}
                        />
                    </Item>
                    <Item>
                    <Picker
                        mode="dropdown"
                        iosHeader="Sexo"
                        iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: "#007aff", fontSize: 25 }} />}
                        style={{ width: undefined }}
                        selectedValue={this.state.selected}
                        onValueChange={this.onValueChange.bind(this)}
                        editable={!this.state.sendform}
                        >
                        <Picker.Item label="Sexo" value="No_binary" />
                        <Picker.Item label="Masculino" value="Masculino" />
                        <Picker.Item label="Femenino" value="Femenino" />
                    </Picker>
                    </Item>
                </Form>
                        { this.state.sendform == false
                        ?
                        <Button block onPress= {this.signup}>
                            <Text>
                            Regístrame
                            </Text>
                        </Button>
                        :
                        <Button block>
                            <Text>
                            Espera...
                            </Text>
                        </Button>
                        }
                        <Text 
                        onPress={this.privacy}
                        style={{color: '#00ECFF', fontSize: 14, marginTop:5}}>
                        Consulta aquí nuestra política de privacidad</Text>
            </Content>
        <Footer style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
        {   this.state.sendform == false ? 
            <Text 
            style={{color:'white'}} 
            onPress={this.cambiarformulario}>Regresar</Text>
            :
            <Text style={{color:'white'}} >Regresar</Text>
        }
        </Footer>
    </Container>
    
    }
    </Container>
    </KeyboardAvoidingView>
    );
  }
}