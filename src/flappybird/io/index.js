import io from 'socket.io-client';
// var io = require('socket.io')();

// require('socket.io-client')

export default (window) => {

  var socket = io.connect('http://localhost:3001');

  socket.on('updatePlayers', players => {
    console.log(players);
    window.eventsL.push({type: 'updatePlayers', option: {data: players}})
  })

  socket.on('addPipe', data => {
    console.log('addPipe');
    window.eventsL.push({type: 'addPipe', option: data})
  })

  socket.on('playerTap', data => {
    console.log('playerTap', data);
    window.eventsL.push({type: 'playerTap', option: data})
  })

  socket.on('gameover', data => {
    console.log('gameover', data);
    window.eventsL.push({type: 'gameover', option: data})
  })

  socket.on('AllOver', data => {
    console.log('AllOver', data);
    window.eventsL.push({type: 'AllOver', option: data})
  })

  return socket
}