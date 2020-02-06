import React, {Component} from 'react';
import {Container, Text, Button, Header, Left, Title, 
Content,Card,CardItem,Icon , Form,
Item, Textarea} from "native-base";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { View, AsyncStorage,Alert,Image} from 'react-native'
import axios from 'axios'

export default class reportemergence extends Component {
    constructor(props){
        super(props);
        this.state={
            image: 'https://insidelatinamerica.net/wp-content/uploads/2018/01/noImg_2.jpg',
            sendform: false,
            coment: '', 
            latitude: null,
            longitude: null,
            imagesubir: null
        }
    }

    captureimage = async() =>{
        let { status } = await Permissions.askAsync(Permissions.CAMERA);
        if(status !== "granted"){
            Alert.alert('¡Necesitamos una foto para poder ayudarte!')
        } else {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                base64: true
            })
            if(result.cancelled !== true){
                let base64 = `data:image/jpg;base64,${result.base64}`
                this.setState({image: result.uri, imagesubir: base64})
            } else {
                this.setState({image : 'https://insidelatinamerica.net/wp-content/uploads/2018/01/noImg_2.jpg'})
            }
        }
    }

    send = async() =>{
        if(this.state.sendform == false && this.state.coment !== ''
        && this.state.image !== 'https://insidelatinamerica.net/wp-content/uploads/2018/01/noImg_2.jpg'
        && this.state.latitude !== null && this.state.longitude !== null){
            this.setState({sendform : true})
            const token = await AsyncStorage.getItem('petra-token')
            axios.post('https://petrapi.herokuapp.com/emergence/reportalert',{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                image: this.state.imagesubir,
                coments: this.state.coment
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
                })
            .then(response => {
                this.setState({sendform : false, coment : ''})
                Alert.alert('¡Tu reporte fue enviado con éxito!')
                this.props.navigation.navigate('home')
            })
            .catch(error => {
                this.setState({sendform : false})
                Alert.alert(error.response.data.message)
            })
        } else {
            Alert.alert('Es necesario rellenar los campos y anexar una fotografía')
        }

        }
    
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
        this.setState({
            errorMessage: 'Es necesario que nos permitas acceder a tu ubicación para reportar esto',
        });
        }else {
        let location = await Location.getCurrentPositionAsync({});
        let latitud = await parseFloat( location.coords.latitude )
        let longitud = await parseFloat( location.coords.longitude )
        this.setState({ latitude : latitud, longitude : longitud});

        this.send()
        }
    };

    render(){
        return(
            <Container>
                <Header>
                    <Left>
                        <Title>
                            Reportar
                        </Title>
                    </Left>
                </Header>
                <Content>
                    <Card>
                        <CardItem>
                            <Text>
                                Reporta tu emergencia
                            </Text>
                        </CardItem>
                        <Form>
                            <Item last>
                                <Textarea
                                onChangeText={(coment) =>
                                this.setState({coment})}
                                maxLength={300}
                                placeholder='Escribe que está pasando (25 a 300 caracteres)'
                                editable={!this.state.sendform}
                                />
                            </Item>
                        </Form>
                        <CardItem cardBody>
                            <Image source={{uri: this.state.image}} style={{height: 340, width: null, flex: 1}}/>
                        </CardItem>
                        <CardItem style={{flexDirection:'row', justifyContent: 'center', flex: 1}}>
                            <Button 
                            onPress={this.captureimage}
                            transparent >
                            <Icon type="Entypo" name="camera"/>
                            <Text>Tomar foto</Text>
                            </Button>
                        </CardItem>
                    </Card>
                    { this.state.sendform == false
                    ?
                    <Button 
                    onPress={this._getLocationAsync}
                    block>
                        <Text>
                            Solicitar mi ubicación y enviar reporte
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
        )
    }
}