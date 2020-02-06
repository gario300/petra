import Ws from '@adonisjs/websocket-client'
const ws = Ws('ws://petrapi.herokuapp.com/')

function conectar (topic) {
    try{
        if(topic == 0){
            ws.disconnect()
        } else{
            ws.connect(
                {
                    wsDomain: "ws://petrapi.herokuapp.com/", 
                    jwtToken: null
                }, 
                { 
                    path: 'adonis-ws', 
                    reconnectionAttempts: 300, 
                    reconnectionDelay: 5000 
                }
            )
            ws.socket.on("open", () => {
                suscribir(topic);
            });   
        }

    } catch(error){
        console.log(error)
    }
}

const suscribir = topic => {
    if (topic) {
      let subscription = ws.socket.getSubscription(`notifications:${topic}`);
      if (!subscription) {
        subscription = ws.subscribe(`notifications:${topic}`);
      }
      subscription.on("message", data => {
        console.log('Hello (event handled in src/WsSubscriptions.js)', data)
        return data
      });
    }
  };
