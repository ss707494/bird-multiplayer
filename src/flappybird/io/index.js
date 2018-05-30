import io from 'socket.io-client';
// var io = require('socket.io')();

// require('socket.io-client')

export default (window) => {

  var socket = io.connect('http://localhost:3001');

  socket.on('updatePlayers', players => {
    console.log(players);
    // window.eventsL.push({type: 'addPipe', option: data})

  })

  socket.on('addPipe', data => {
    console.log('addPipe from server')
    window.eventsL.push({type: 'addPipe', option: data})
  })

  return socket
}
