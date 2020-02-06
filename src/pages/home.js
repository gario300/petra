import React, {Component} from 'react';
import {Container, Text, Button, Header, Left, Title, Content, Right, Body,Card,CardItem,Icon,Spinner
, Badge} from "native-base";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import {View, AsyncStorage,Alert} from 'react-native'
import axios from 'axios'

export default class home extends Component{
    constructor(props){
        setInterval(async() => {await this.settimer()}, 60000)
        super(props);
        this.state = {
            loading: true,
            err: false,
            Location: {},
            errorMessage: null,
            me:{},
            jwt: '',
            sendalert : true,
        
            Latitude: '',
            longitude: '',
            
            suscribe: false,
            notification: 0,

            logout: false
        }
        this.props.navigation.addListener('willFocus', async() => {
            this.suscription()
          })
    }
    
    settimer = async() => {
        const token = await AsyncStorage.getItem('petra-token')
        if(token !== null){
        await this.suscription()
        }
    }

    async componentDidMount() {
        await this.me()
    }

    me = async() => {
        this.setState({loading: true, err: false})
        try{
            let push = null
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
            const token = await AsyncStorage.getItem('petra-token')
            if (status == 'granted'){
                push = await Notifications.getExpoPushTokenAsync()
            }
            await axios.get('https://petrapi.herokuapp.com/account/me/'+push, {
                headers: {Authorization: `Bearer ${token}`}, timeout:60000})
            .then(response => {
            this.setState({
                me: response.data.data,
                suscribe: response.data.data.is_premium,
                loading: false,
                error: false,
                sendalert: false
            })
            this.suscription()
            }).catch(error => {
                console.log(error)
                this.setState({
                    loading: false,
                    err: true
                })
            })
        }catch(error){
            console.log(error)
            this.setState({
                loading: false,
                err: true
            })
        }
    }

    suscription = async() => {
        const token = await AsyncStorage.getItem('petra-token')
        await axios.get('https://petrapi.herokuapp.com/account/mypremium', {
            headers: {Authorization: `Bearer ${token}`}, timeout:50000
        }).then(response =>{
            this.setState({suscribe: response.data.data, notification: response.data.total})
        })
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
        this.setState({
            errorMessage: 'Para acceder a la función de pánico es necesario saber tu ubicación',
        });
        }else {
        let location = await Location.getCurrentPositionAsync();
        let latitud = location.coords.latitude
        let longitud = location.coords.longitude
        let latitudl = latitud.toString()
        let longitudl = longitud.toString()
        this.setState({ latitude : latitudl, longitude : longitudl});
        }
    };
//menu
    _Logout = async() => {
        if(this.state.logout == false){
            this.setState({logout: true})
            let push = null
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
            if (status == 'granted'){
                push = await Notifications.getExpoPushTokenAsync()
            }
            const token = await AsyncStorage.getItem('petra-token')
            await axios.post('https://petrapi.herokuapp.com/account/logout', {
                expotoken:push
            }, {headers: { Authorization: `Bearer ${token}` }, timeout:50000})
            .catch(error => {

            console.log(error)
                Alert.alert('Al parecer hay problemas con tu conexión a internet')
                this.setState({logout:false})
            })
            await AsyncStorage.clear();
            this.setState({logout:false})
            this.props.navigation.navigate('Auth')
        }
    }

    gotoreports = () =>{
        this.props.navigation.navigate('reports')
    }

    goreport = () =>{
        this.props.navigation.navigate('report')
    }
     
    paymenu = () =>{
        this.props.navigation.navigate('payment')
    }


    supervition = () => {
        this.props.navigation.navigate('needsupervition')
    }
    reportemercence = () =>{
        this.props.navigation.navigate('reportemergence')

    }

    cancelsubscription = () =>{
        this.props.navigation.navigate('cancelsubscription')
    }
 
    panic = async() => {
        if(this.state.me !== {}){
        this.setState({sendalert: true})
        await this._getLocationAsync()
        const token = await AsyncStorage.getItem('petra-token')
        this.setState({ jwt: token });
        await axios.post('https://petrapi.herokuapp.com/emergence/newalert',{
            type : 'panic',
            latitude: this.state.latitude,
            longitude: this.state.longitude,
        },{
        headers: {
            Authorization: `Bearer ${this.state.jwt}`
        }, timeout:75000
        }).then(response => {
            console.log(this.state.latitude)
        this.setState({sendalert: false})
            Alert.alert(
                '¡Alerta enviada!'
           )
        }).catch(error => {
            console.log(error)
            Alert.alert('Hubo un error al conectar con internet, intentalo de nuevo más tarde')
            this.setState({sendalert: false})
        })
        }
    }

    onClose(){
        this.setState({paymenu : false})
    }

    loading(){
        if(this.state.loading == true){
            return(      
                <View style={{flex: 1, 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 10}}>
                    <Spinner />
                </View>
            )
        } else if(this.state.loading == false && this.state.err == true){  
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
                            <Button onPress={this.me}>
                                <Text>
                                    Reintentar
                                </Text>
                            </Button>
                        </View>
                 </View>
            )
        } else if(this.state.loading == false && this.state.err == false){
            return(
                <Container>  
                    <Header>
                        <Left style={{flex:1}}>
                            <Title>
                                {this.state.me.name}
                            </Title>
                        </Left>
                        <Body style={{flex:1}}>
                            <Title>
                            ¿Todo bien?
                            </Title>
                        </Body>
                        <Right style={{flex:1}}>
                            <Button transparent onPress={this._Logout}>
                                { this.state.logout == false
                                ?
                                <Title>Salir</Title>
                                :
                                <Title>Espera</Title>
                                }
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        {this.payment}
                        {
                        this.state.suscribe == false
                        ?
                        <Button block info onPress={this.paymenu}>
                            <Text>Actualízate a premium</Text>
                        </Button>
                        :
                        <Button 
                        onPress={this.cancelsubscription}
                        block info>
                            <Text>Cancelar suscripción</Text>
                        </Button>
                        }
                        <Button block onPress={this.supervition}>
                            <Text>Solicitar supervisión</Text>
                        </Button>
                        <Card>
                            <CardItem>
                                <Body style={{flexDirection: "row", justifyContent: 'center'}}>
                                    <Button onPress={this.goreport}
                                    iconLeft success>
                                    <Icon type="FontAwesome" name="whatsapp"/>
                                        <Text>
                                            Código de emergencia
                                        </Text>
                                    </Button>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Body style={{flexDirection: "row", justifyContent: 'center'}}>
                                    <Button onPress={this.reportemercence}
                                    iconLeft warning>
                                        <Icon type="Feather" name="alert-triangle"/>
                                        <Text>
                                            Reportar Emergencia
                                        </Text>
                                    </Button>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Body style={{flexDirection: "row", justifyContent: 'center'}}>
                                    <Button iconLeft style={{backgroundColor:"#572364"}}
                                    onPress={this.gotoreports}>
                                        <Icon type="MaterialIcons" name="notifications-none"/>
                                        <Badge>
                                            <Text>
                                            {this.state.notification}
                                            </Text>
                                        </Badge>
                                        <Text>
                                            Seguir mis Reportes 
                                        </Text>
                                    </Button>
                                </Body>
                            </CardItem>
                        </Card>
                        <Body style={{flexDirection: "row", justifyContent: 'center', marginTop: 10}}>
                            { this.state. sendalert == false
                            ?
                            <Button onPress={this.panic}
                            large danger rounded style={{width:200, height:200, justifyContent:'center'
                            , borderRadius: 200, borderWidth: 5}}>
                                <Text style={{fontSize:40}}>Pánico</Text>
                            </Button>
                            :
                            <Button
                            large danger rounded style={{width:200, height:200, justifyContent:'center'
                            , borderRadius: 200, borderWidth: 5}}>
                                <Text style={{fontSize:40}}>Espera</Text>
                            </Button>
                            }
                        </Body>
                    </Content>
                </Container>)
            
        }
    }
    
    render(){
        return (
            <Container>
                {this.loading()}
            </Container>
        )
    }
}