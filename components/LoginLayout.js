import React from 'react'
import { StyleSheet, View, Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Item, Input, Form } from "native-base";

function LoginLayout(){
    return(
        <Container>
            <Header/>
            <View style={{alignItems: 'center', marginTop: 20, marginBottom:20}}>
            <Image
                style={{width: 50, height: 50}}
                source={{uri: 'https://res.cloudinary.com/scute/image/upload/v1566225323/logros/centrodeatencion_oxplzq.png'}}
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
                        <Input
                         keyboardType={'numeric'}
                         placeholder="Numero"/>
                    </Item>
                    <Item last>
                        <Input 
                        placeholder="Contraseña"
                        secureTextEntry={true}/>
                    </Item>
                </Form>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
  })

  export default LoginLayout