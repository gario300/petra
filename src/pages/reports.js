import React, {Component} from 'react';
import {Container, Text, Button, Header, Left, Title,
Content,  Body,Card,CardItem,Icon
,Thumbnail, Spinner, Footer, FooterTab} from "native-base";
import { Platform, View, AsyncStorage, Share, ScrollView} from 'react-native'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import axios from 'axios'

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };



export default class reports extends Component {
    constructor(proops){
        super(proops);
        this.state = {
                jwt: '',
                reports: [],
                en_proceso: false,
                finalizados: false,
                enviados: true,
                error: false,
                loadmore: true,
                dato: '',
                page: 0,
                active: true,
                nomore: false,

        }
    }

    componentDidMount(){
        this.reports('Enviado')
    }

    godetails = (dato) =>{
        this.props.navigation.navigate('details', {dato})
    }


    reportimage(image){
        if(image == null) {
            return (
                <Thumbnail
                style={{height: 200, width: null, flex: 1,}} 
                source={{uri: 'https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png' }}/>
            )
        } else{
            return (
                <Thumbnail
                style={{height: 200, width: null, flex: 1,}} 
                source={{uri: image }}/>
            )
        }
    }
    
    reports = async(status)=>{
        this.setState({dato : status })
        if(this.state.active == true && this.state.nomore == false){
        this.setState({active : false, loadmore: true});
        this.setState(prevState => ({ page: prevState.page + 1 }));

        if(status == 'Enviado'){
            this.setState({enviados: true, en_proceso:false, finalizados: false})
        } else if(status == 'En proceso'){
            this.setState({enviados: false, en_proceso:true, finalizados: false})
        } else if(status == 'Finalizado'){
            this.setState({enviados: false, en_proceso:false, finalizados: true})
        }
        const token = await AsyncStorage.getItem('petra-token')
         axios.post('https://petrapi.herokuapp.com/emergence/myreports/'+this.state.page,{
            status: status
         }, {
            headers: {Authorization: `Bearer ${token}`}
        })
        .then(response => {
            let ar = response.data.data.data
            if(Array.isArray(ar) && ar.length){
                let arr = response.data.data.data
                let push = this.state.reports.concat(arr)
                this.setState({
                    reports: push, loadmore : false,active : true,nomore: false})
            } else {
                this.setState({loadmore : false, active : true, nomore: true})
            }
        })
    }

    }

    pushbutton = (status) =>{
        if(this.state.active == true){
        this.setState({page: 0 ,reports: [], nomore: false})
        this.reports(status)
        }
    }

    async onshare(id){

        try {
          const result = await Share.share({
            message: 'Ha compartido un codigo de seguimiento a emergencia de PETRA : '+id
          });
    
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          } 
        } catch (error) {
          alert(error.message);
        }
      };

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
                  <View style={{flex: 1, backgroundColor: '#c3d125', height:20}}>
  
                  </View>
                  <View style={{flex: 1, backgroundColor: '#c3d125', height:20}}>
  
                  </View>
                  <View style={{flex: 1, backgroundColor: '#a69f9f', height:20}}>
  
                  </View>
              </View>
              )
          } else if (status == 'Finalizado'){
          return(
          <View style={{flexDirection: 'row', height:30}}>
              <View style={{flex: 1, backgroundColor: '#d1201a', height:20}}>
  
              </View>
              <View style={{flex: 1, backgroundColor: '#d1201a', height:20}}>
  
              </View>
              <View style={{flex: 1, backgroundColor: '#d1201a', height:20}}>
  
              </View>
          </View>
          )
          }
      }

    parsedata() {

        return this.state.reports.map((data) => {
            
            const dato = data.alert.id

          return (
            <ScrollView>
            <Card>
                <CardItem>
                    <Left>
                        { data.alert.image == null
                        ?
                        <Thumbnail source={{uri:
                        'https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png' }}
                        
                            style={{height: 50, width: 50}}/>
                        :
                        <Thumbnail source={{uri: data.alert.image}}
                        style={{height: 50, width: 50}}/>
                        }
                    </Left>
                    <Body>
                        <Text>
                            {data.status}
                        </Text>
                        {this.proccesbar(data.status)}
                    </Body>
                </CardItem>
                <CardItem cardBody>
                    {  data.alert.image == null && data.alert.latitude !== null || data.alert.longitude !== null
                    ?
                    <MapView 
                    region=
                    {{
                    latitude: parseFloat(data.alert.latitude) ,
                    latitudeDelta:0.001,
                    longitude: parseFloat(data.alert.longitude ),
                    longitudeDelta: 0.001,}}
                    style={{height: 200, width: null, flex: 1,}}        
                    moveOnMarkerPress = {false}
                    scrollEnabled={false}>
                    <Marker
                    coordinate={{
                        latitude: parseFloat(data.alert.latitude) , 
                        longitude: parseFloat(data.alert.longitude )}}
                        title={data.user.name}
                        description={data.alert.type}
                    />
                    </MapView>
                    :
                    <View style={{height: 200, width: null, flex: 1,}}>
                        {this.reportimage(data.alert.image)}
                    </View>
                    }
                </CardItem>
                <CardItem>
                    <Body>
                        <Button onPress={() => {
                            this.onshare(dato)
                        }}
                        full iconLeft success>
                            <Icon type="FontAwesome" name="whatsapp"/>
                            <Text>Compartir código de seguimiento</Text>
                        </Button>
                    </Body>
                </CardItem>
                <CardItem>
                    <Body>       
                        <Button onPress={() => {
                            this.godetails(data.id)
                        }} iconLeft full>
                            <Icon type="Feather" name="eye"/>
                            <Text>Ver detalles</Text>
                        </Button>
                    </Body>
                </CardItem>
            </Card>
            </ScrollView>
          )
        })
    
    }

    container(){
         if(this.state.error == true && this.state.loadmore == false){
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
                            <Button onPress={() => {
                            this.reports('Enviado')
                            }} >
                                <Text>
                                    Reintentar
                                </Text>
                            </Button>
                        </View>
                 </View>
            )
        }else if(this.state.error == false){
            return(
                    <Content   
                    onScroll={({nativeEvent}) => {
                      if (isCloseToBottom(nativeEvent)) {
                        this.reports(this.state.dato);
                      }
                    }}
                    scrollEventThrottle={400}>
                        {this.parsedata()}
                    </Content>
            )
        }
    
    }

    spinner(){
        if(this.state.loadmore == true){
        return(        
            <View style={{
                justifyContent: 'center',
                flexDirection: 'row'}}>
                <Spinner />
            </View>
        )}
    }


    render(){
        return(
            <Container> 
                <Header>
                    <Body>
                        <Title>
                            Reportes
                        </Title>
                    </Body>
                </Header>
                {this.container()}
                {this.spinner()}
                <Footer>
                    
                    <FooterTab>
                        {this.state.enviados == true
                        ?
                        <Button active true>
                            <Text>Enviados</Text>
                        </Button>
                        :
                        <Button onPress={() => {
                            this.pushbutton('Enviado')
                        }} >
                            <Text>Enviados</Text>
                        </Button>
                        }
                    </FooterTab>
                    <FooterTab>
                        {this.state.en_proceso == true
                        ?
                        <Button active true>
                            <Text>En proceso</Text>
                        </Button>
                        :
                        <Button  onPress={() => {
                            this.pushbutton('En proceso')
                        }} >
                            <Text>En proceso</Text>
                        </Button>
                        }
                    </FooterTab>
                    <FooterTab>
                        {this.state.finalizados == true
                        ?
                        <Button active true>
                            <Text>Finalizados</Text>
                        </Button>
                        :
                        <Button  onPress={() => {
                            this.pushbutton('Finalizado')
                        }} >
                            <Text>Finalizados</Text>
                        </Button>
                        }
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}