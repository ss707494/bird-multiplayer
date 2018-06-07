const server = require('socket.io');
const io = server(6040)
io.on('connection', function (socket) {
  console.log('one player connected', socket.id);
  socket.on('msg', (msg, callback) => {
    console.log('server get one msg', msg);
    socket.broadcast.emit('msg', msg);
  })
  socket.emit('connected')
});
console.log('6040')
