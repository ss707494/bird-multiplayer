// note, io(<port>) will create a http server for you
const server = require('socket.io');
const _ = require('lodash');
// var io = server(80);

var app = require('express')();
var http = require('http').Server(app);

var players = []
var state = 0
var space = 5
var timeId, io

const randomInt = num => ~~(Math.random() * num)


app.get('/startServer', function (req, res) {

})

app.get('/start', function (req, res) {
  console.log('start');
  state = !state
  res.send();
})
app.get('/space--', function (req, res) {
  space = space > 1 ? space - 1 : 5
  console.log('space--');
  res.send(''+space);
})

function init(req, res) {
  console.log('init');
  io && io.close()
  clearInterval(timeId);
  players = [];
  state = 0;
  space = 5
  io = server(http);
  io.on('connection', function(socket){
    console.log('a user connected id: ' + socket.id);
    socket.on('initClient', (data, fn) => {
      if (_.findIndex(players, e => e.playerName === data.playerName) > -1) {
        socket.emit('nameRepeat');
        return
      }
      data.playerId = socket.id
      players = [...players, data]

      console.log(players);
      console.log(players.length);
      fn(socket.id, players)
      io.emit('updatePlayers', players)
    })

    socket.on('playerTap', data => {
      socket.broadcast.emit('playerTap', data);
    })

    socket.on('gameover', data => {
      const time = new Date().getTime();
      players = players.map(e => e.playerId !== data.playerId ? e : _.set(_.set(e, 'isOver', time), 'score', data.score))
      io.emit('gameover', _.set(data, 'time', time));
      if (players.filter(e => !e.isOver).length === 0) {
        state = 0
        io.emit('AllOver', players);
        players = players.map(e => e.playerId !== data.playerId ? e : _.set(_.set(e, 'isOver', ''), 'score', 0))
      }
    })

    socket.on('gameStart', data => {
      console.log('start.....')
      state = !state
    })

    socket.emit('connected');

  });
  timeId = setInterval(() => {
    if (!state) return
    io.emit('addPipe', {space_g: randomInt(space * 20), y_g: randomInt(180)})
  }, 5000)
  http.listen(3001, function(){
    console.log('listening on *:3001');
  });
  res.send();
  return
}

app.get('/init', init)
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>' +
      '<input id="number"/>' +
      '<div><button onclick="fetch(\'start\')">start</button></div>' +
      '<div><button onclick="fetch(\'startServer\')">startServer</button></div>' +
      '<div><button onclick="fetch(\'init\')">init</button></div>' +
      '<div><button onclick="fetch(\'space--\')">space--</button></div>' +
      '') + players.map(e => '<div>'+e.playerName+'</div>').join('') + '<div>' + players.length + '</div>'
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});


