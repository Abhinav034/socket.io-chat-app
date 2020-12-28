const welcomeLabel = document.getElementById('welcomeLabel')
const input = document.getElementById('msgInput')
const msgLabel = document.getElementById('msgLabel')
const welcomeDiv = document.getElementById('welcomeDiv')
const locationButton = document.getElementById("locationPressed")
var sender = false
const socket = io()
input.focus()
document.getElementById('sendPressed').addEventListener('click' , ()=>{
    sender = true
        socket.emit('message' , input.value , (error)=>{           // have to set sender = true before emiting the message
            if (error){
                return console.log('Error delivering message')
            }
            input.value = ""
            input.focus()
            console.log('Message delivered !!')
        })
})

locationButton.addEventListener('click' , ()=>{

    if (!navigator.geolocation){
       return alert('Share location not supported')
    }
    sender = true
    locationButton.disabled = true
    navigator.geolocation.getCurrentPosition((userLocation)=>{
        const locObj = {}

        locObj.latitude = userLocation.coords.latitude
        locObj.longitude = userLocation.coords.longitude

        
        socket.emit('userLocation', locObj  , ()=>{
            console.log('Location shared!!')
            locationButton.removeAttribute('disabled')
        })
    })


})

socket.on('welcomeMsg' , (message)=>{

    if (message === "Welcome users"){
      return  welcomeLabel.innerHTML = message
    }   
})



socket.on('initialMsg' , (msg)=>{
    if (msg === 'No messages yet!!'){
        
    msgLabel.innerHTML = msg
    
    }else if (typeof(msg) === 'object'){

        const {latitude , longitude} = msg
        
    const div = document.createElement('div');

        div.className = 'row';
        
        if (sender === true){
            div.innerHTML = `
            <h3>Your location -  <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">https://www.google.com/maps?q=${latitude},${longitude}</a></h3>
            `
            sender = false
        }else{
            div.innerHTML = `
            <h3>Sender's location - <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">https://www.google.com/maps?q=${latitude},${longitude}</a></h3>
            `
        }
        document.getElementById('content').appendChild(div);
       
    }
    else{

        msgLabel.innerHTML = ""

        welcomeDiv.style.display = 'none'

        

        const div = document.createElement('div');

        div.className = 'row';
        
        if (sender === true){
            div.innerHTML = `
            <h3>You - ${msg}</h3>
            `
            sender = false
        }else{
            div.innerHTML = `
            <h3>${msg}</h3>
            `
        }
        document.getElementById('content').appendChild(div);
    }

 
})

