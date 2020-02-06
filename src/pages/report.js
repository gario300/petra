import React, {Component} from 'react';
import {Container, Text,
Form, Item, Button, Header, Left, 
Content, Right, Body,
Card,CardItem, Footer,
Thumbnail ,Input} from "native-base";
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Constants from 'expo-constants';
import {View, AsyncStorage, Alert} from 'react-native'
import axios from 'axios'


export default class report extends Component{
    constructor(props){
        super(props);
        this.state = {
            finder: '',
            sendform: false,
            jwt: '',
            report: null,
            alert: 'Porfavor Escribe un Código valido',
            mostrar: false
        }
    }

    getreportbycode = async() => {
        this.setState({mostrar : false})
        if(this.state.finder !== ''){
            const token = await AsyncStorage.getItem('petra-token');
            this.setState({ jwt: token, sendform: true });
            axios.post('https://petrapi.herokuapp.com/emergence/find', {
                report_id : this.state.finder
        }, {headers: {
                Authorization: `Bearer ${this.state.jwt}`
        }
            }).then(response => {
                this.setState({report: response.data.data, sendform:false})
                this.setState({mostrar : true})

        }).catch(error => {
            this.setState({finder:'', sendform:false})
            Alert.alert(error.response.data.message)
        })
        }
    }
    
    proccesbar(status){
        if(status == 'Enviado'){
            return(
                <View style={{flexDirection: 'row', height:30}}>
                    <View style={{flex: 1, backgroundColor: '#23d160', height:20}}>

                    </View>
                    <View style={{flex: 1, backgroundColor: '#a69f9f', height:20}}>

                    </View>
                    <View style={{flex: 1, backgroundColor: '#a69f9f', height:20}}>

                    </View>
                </View>
            )
        } else if(status == 'En proceso'){
            return(
            <View style={{flexDirection: 'row', height:30}}>
                <View style={{flex: 1, backgroundColor: '#23d160', height:20}}>

                </View>
                <View style={{flex: 1, backgroundColor: '#c3d125', height:20}}>

                </View>
                <View style={{flex: 1, backgroundColor: '#a69f9f', height:20}}>

                </View>
            </View>
            )
        }
    }

    report(report){
        if(this.state.mostrar == true){
            return(
                <Card>
                    <CardItem>
                            <Left>
                            { report.alert.image == null
                            ?
                            <Thumbnail source={{uri:
                            'https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png' }}
                            
                                style={{height: 50, width: 50}}/>
                            :
                            <Thumbnail source={{uri: report.alert.image}}
                            style={{height: 50, width: 50}}/>
                            }
                        </Left>
                        <Body>
                            <Text>
                                Creador: {report.user.name}
                            </Text>
                            {this.proccesbar(report.status)}
                        </Body>
                    </CardItem>
                    <CardItem cardBody>
                        { report.alert.latitude !== null || report.alert.longitude !== null
                        ?
                        <MapView 
                        region=
                        {{
                        latitude: parseFloat(report.alert.latitude),
                        latitudeDelta:0.001,
                        longitude: parseFloat(report.alert.longitude ),
                        longitudeDelta: 0.001,}}
                        style={{height: 200, width: null, flex: 1,}}        
                        moveOnMarkerPress = {false}>
                        <Marker
                        coordinate={{
                            latitude: parseFloat(report.alert.latitude) , 
                            longitude: parseFloat(report.alert.longitude )}}
                            title={ report.user.name}
                            description={ report.alert.type}
                        />
                        </MapView>
                        :    
                        <Thumbnail
                        style={{height: 200, width: null, flex: 1,}} 
                        source={{uri:
                        'https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png' }}/>
                    }
                    </CardItem>
                    <CardItem>
                        <Text>
                            <Text
                            style={{fontWeight: 'bold'}}>Tipo de emergencia: </Text>
                            {report.alert.type}
                        </Text>
                    </CardItem>
                    <CardItem>
                        <Text style={{fontWeight: 'bold'}}>
                            Descripción
                        </Text>
                    </CardItem>
                    { report.alert.image == null
                    ?
                    <CardItem>
                        <Thumbnail
                        source={{uri: 
                        'https://parisdayhotel.com/assets/images/noimage.png'}}
                        style={{height: 300, width: 200, flex: 1}}
                        />
                    </CardItem>
                    :
                    <CardItem>
                        <Thumbnail
                        source={{uri: 
                        report.alert.image}}
                        style={{height: 300, width: 200, flex: 1}}
                        />
                    </CardItem>
                    }
                    <CardItem>
                        { report.alert.coments == null
                        ?
                        <Text>
                            No hay mayores detalles sobre
                            esta emergencia
                        </Text>
                        :
                        <Text>
                            {report.alert.coments}
                        </Text>
                        }
                    </CardItem>
                    <CardItem>
                        <Text style={{fontWeight: 'bold'}}>
                            Reporte de la central
                        </Text>
                    </CardItem>
                    { report.image == null
                    ?
                    <CardItem>
                        <Thumbnail
                        source={{uri: 
                        'https://parisdayhotel.com/assets/images/noimage.png'}}
                        style={{height: 300, width: 200, flex: 1}}
                        />
                    </CardItem>
                    :
                    <CardItem>
                        <Thumbnail
                        source={{uri: 
                        report.image}}
                        style={{height: 300, width: 200, flex: 1}}
                        >
                        </Thumbnail>
                    </CardItem>
                    }
                    { report.report == null
                    ?
                    <CardItem>
                        <Text>
                            Aún no hay un reporte
                        </Text>
                    </CardItem>
                    :
                    <CardItem>
                        <Text>
                           {report.report}
                        </Text>
                    </CardItem>
                    }<CardItem>
                        <Text style={{
                            fontWeight: 'bold'
                        }}>
                            Atendió
                        </Text>
                    </CardItem>
                    <CardItem>
                        { report.operador_name == null
                        ?
                        <Text>
                        Aún se está atendiendo este reporte
                        </Text>
                        :
                        <Text>
                        {report.operador_name}
                        </Text>
                    }</CardItem>
                    <CardItem>
                        <Text style={{fontWeight: 'bold'}}>
                            Supervisó
                        </Text>
                    </CardItem>
                    <CardItem>
                        { this.state.report.supervisor_name == null
                        ?
                        <Text>
                        Aún se está atendiendo este reporte
                        </Text>
                        :
                        <Text>
                        {this.state.report.supervisor_name}
                        </Text>
                    }</CardItem>
                </Card>
            
            )
        } else {
            return(
            <Text>{this.state.alert}</Text>
            )
        }
    }

render(){
    return(
        <Container>
            <Header>

            </Header>
            <Content>
                <Form>
                    <Item last>
                        <Input
                        keyboardType={'numeric'}
                        placeholder="Escribe tu Código"
                        onChangeText={(finder) => this.setState({finder})}
                        />
                        <Button
                        onPress={this.getreportbycode}>
                            { this.state.sendform == false
                            ?
                            <Text>
                                Buscar
                            </Text>
                            :
                            <Text>
                                Espera
                            </Text>
                            }
                        </Button>
                    </Item>
                </Form>
                {this.report(this.state.report)}
            </Content>
            <Footer/>
        </Container>
    )
}

}