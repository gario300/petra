import React, {Component} from 'react';
import {Container, Text, Button, Header, Left, Title,
Content,Footer} from "native-base";

export default class termsandconditions extends Component{
    constructor(proops){
        super(proops);
        this.state = {
            
        }
    }

    render(){
        return(
            <Container>
                <Header
                style={{flexDirection:'column', justifyContent: 'center', alignContent: 'center'}}
                >
                    <Title>
                        Terminos y Condiciones
                    </Title>
                </Header>
                <Content>
                    <Text>Términos y Condiciones del Servicio{"\n"}
                    {"\n"}
Al realizar el pago, confirma que ha leído, entendido y aceptado los 
siguientes términos y condiciones de estos Términos y Condiciones del Servicio. 
Si no está de acuerdo con alguno de estos términos, no debe de realizar algún pago{"\n"}
{"\n"}
1.-Se ofrece un servicio de monitoreo 24 horas en el cual se brindará atención 
personalizada a una emergencia o prevención de ella, luego de elaborar un reporte el personal de la central de monitoreo se encargará de dar seguimiento al mismo hasta completarlo, el personal de la central se compromete a enviar supervisión y generar un reporte basándonos en las anotaciones del supervisor en curso, en caso de inconformidad o un reporte erróneo el personal de la central se compromete a reiniciar el seguimiento al reporte hasta completarse.
Es necesario que usted comprenda que este es un servicio de atención de emergencias 
y todos los reportes son tomados como tal por lo que en caso de una falsa alarma intencional 
el personal de la central de monitoreo se reserva el derecho de dar prioridad baja a cualquier 
reporte futuro o en el peor de los casos anular su suscripción.{"\n"}
{"\n"}
2.-Al realizar el pago de un servicio haremos todo lo posible para 
poder comunicarnos con usted en un plazo de 5 minutos, en ciertas ocasiones 
el plazo podrá ser mayor debido al incremento de solicitudes del servicio pero 
nos comprometemos de no hacerle esperar mas de 20 minutos.{"\n"}
{"\n"}
3.- Su Número de teléfono no será mostrado, dado ni vendido.{"\n"}
{"\n"}
4.-Las personas que brinden información falsa durante la contratación del servicio serán 
sancionadas cancelándose el servicio sin reintegro alguno. {"\n"}
{"\n"}
5.-Todos los pagos han de ser hechos utilizando los medios disponibles en la aplicación. 
Ningún otro método será aceptado.{"\n"}
{"\n"}
6.-Ningún pago es reembolsable. {"\n"}
{"\n"}
7.-Ante algún tipo de inconveniente será necesario que primero que solicite una llamada a atención 
a clientes, ninguna queja o sugerencia será atendida si el medio para hacerla llegar es el uso 
indebido de los canales exclusivos de Alerta y Emergencia, nos reservamos el derecho a cancelar 
el servicio sin derecho a reembolso por motivos de falsa alarma o en su defecto a bajar el nivel 
de prioridad de atención en futuras alertas o reportes.{"\n"}
{"\n"}
8.-Tenemos el derecho de suspender el servicio en cualquier momento por cualquier razón válida 
incluyendo, pero no limitándose a, la violación de nuestros Términos y Condiciones del Servicio.{"\n"}
{"\n"}
9.-Todo servicio suspendido será archivado impidiendo la reutilización del numero telefónico.{"\n"}
{"\n"}
10.-Al contratar nuestro servicio usted debe de estar de acuerdo con los términos y condiciones del servicio que Google Play tenga en el momento, al igual que previamente haber leído la política de privacidad disponible y al alcance en la página de login y registro.
No seremos responsables de ningún tipo de retraso o fallo que no esté directamente relacionado con 
nosotros y que, por tanto, estén fuera de nuestro control.{"\n"}
{"\n"}
Nos reservamos el derecho de alterar los Términos y Condiciones del Servicio en cualquier momento, incluyendo 
tarifas, ofertas especiales, beneficios y reglas, entre otros, y también nos reservamos el derecho d
e cancelar sus servicios en cualquier momento y sin previo aviso.

                    </Text>
                </Content>
                <Footer/>
            </Container>
        )
    }
}