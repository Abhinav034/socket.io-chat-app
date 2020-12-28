const express = require('express')
const http = require('http')
const path = require('path')
const app = express()
const websocket = require('socket.io') 

const PORT = process.env.PORT || 3000

const server = http.createServer(app)               //used it to make our server work with socket io

const io = websocket(server)                        



const publicPath = path.join(__dirname , './public')        // joining path to current directory
app.use(express.static(publicPath))                         //using static public path

let message = "Welcome users"

io.on('connection' , (socket)=>{
   console.log('Web socket connected') 

    socket.emit('welcomeMsg' , message)        //.emit 'welcomeMsg' method which we have sent from server-side also transferred value of message with it

    socket.emit('initialMsg' , "No messages yet!!")

    socket.broadcast.emit('initialMsg' , 'A new user has joined!!') //broadcast is used for emit message to all the connected users except you

    socket.on('message' , (message , acknowledgementCallback)=>{      //.on 'message' is the method we got form the client side 
        console.log(message)
        io.emit('initialMsg' , message)     //io.emit is emitting the change to all the connections conneted to the server 
        acknowledgementCallback()
    }) 


    socket.on('userLocation' , (location , acknowledgementCallback)=>{  //getting location and callback from client emit 
           io.emit('initialMsg' , location)

           acknowledgementCallback()     //simple callback initialized in client side to acknowledge that particular event is send to server or not
    })

})
server.listen(PORT , ()=>{
    console.log("server working at port"+PORT)
})