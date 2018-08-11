import io from 'socket.io-client';
import common from '../lib/common'

const {alert} = common

export default (window) => {

  // var socket = io.connect('http://104.225.154.119:3001');
  var socket = io.connect('http://localhost:3001');

  socket.on('updatePlayers', players => {
    console.log(players);
    window.eventsL.push({type: 'updatePlayers', option: {data: players}})
  })

  socket.on('nameRepeat', data => {
    console.log('nameRepeat');
    alert('重名了')
    window.location.reload();
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
