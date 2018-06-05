// note, io(<port>) will create a http server for you
const server = require('socket.io');
const _ = require('lodash');
// var io = server(80);

var app = require('express')();
var http = require('http').Server(app);
var io = server(http);

var players = []
var state = 0

const randomInt = num => ~~(Math.random() * num)

app.get('/start', function (req, res) {
  console.log('start');
  state = !state
  res.send();
})
app.get('/restart', function (req, res) {
  console.log('restart');
  return
  // state = !state
  // players = []
  // state = 0
  // server.close(() => {
  //   io = server(http);
  // })
  // res.send();
})
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>' +
      '<div><button onclick="fetch(\'start\')">start</button></div>' +
      '<div><button onclick="fetch(\'restart\')">restart</button></div>' +
      '') + players.map(e => '<div>'+e.playerName+'</div>').join('') + '<div>' + players.length + '</div>'
});

io.on('connection', function(socket){
  console.log('a user connected id: ' + socket.id);
  socket.on('initClient', (data, fn) => {
    data.playerId = socket.id
    players = [...players, data]

    // const __data = data.data
    // __data.v_y = 10;
    // players.push({playerId: 'test', playerName: 'test', data: __data})
    console.log(players);
    fn(socket.id, players)
    io.emit('updatePlayers', players)
  })

  socket.on('playerTap', data => {
    socket.broadcast.emit('playerTap', data);
  })

  socket.on('gameover', data => {
    const time = new Date().getTime();
    players = players.map(e => e.playerId !== data.playerId ? e : _.set(_.set(e, 'isOver', time), 'score', data.score))
    socket.broadcast.emit('gameover', _.set(data, 'time', time));
    if (players.filter(e => !e.isOver).length === 0) {
      io.emit('AllOver', players);
    }
  })

});

setInterval(() => {
  if (!state) return
  io.emit('addPipe', {space_g: randomInt(80), y_g: randomInt(180)})
}, 5000)

http.listen(3001, function(){
  console.log('listening on *:3001');
});

