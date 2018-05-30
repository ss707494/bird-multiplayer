// note, io(<port>) will create a http server for you
var io = require('socket.io')(80);

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var players = []
var state = 0

const randomInt = num => ~~(Math.random() * num)

app.get('/start', function (req, res) {
  console.log('start');
  state = !state
  res.send();
})
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1><div><button onclick="fetch(\'start\')">asd</button></div>');
});

io.on('connection', function(socket){
  console.log('a user connected id: ' + socket.id);
  socket.on('initClient', (data, fn) => {
    data.id = socket.id
    players = [...players, data]

    const __data = data.data
    __data.v_y = 10;
    players.push({id: 'test', playerName: 'test', data: __data})
    console.log(players);
    fn(socket.id, players)
    socket.emit('updatePlayers', players)
  })

  setInterval(() => {
    if (!state) return
    socket.emit('addPipe', {space_g: randomInt(80), y_g: randomInt(180)})
  },3000)

});

http.listen(3001, function(){
  console.log('listening on *:3001');
});

