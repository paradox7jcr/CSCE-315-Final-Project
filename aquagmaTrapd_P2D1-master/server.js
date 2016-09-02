var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var port = process.env.PORT || 12795;

// serve static files from the current directory
app.use(express.static(path.join(__dirname, '/views')));

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

var PLAYERS = [];
var QUEUE = [];
var TRAPPERS = [];
var RUNNERS = [];

var mapInfo1 = {};

server.listen(port, function() {
	console.log('Server listening at port %d', port);
});


io.on('connection', function(socket){
  console.log('User ' + socket.id + ' connected');
  PLAYERS.push(socket);
  console.log('Number of Players: %d', PLAYERS.length);

  socket.on('PlayerReady', function(){
      QUEUE.push(socket);
      console.log('Queue Size is %d', QUEUE.length);
  });
  
  socket.on('pairPlayers', function(){
      if(QUEUE.length >= 2) {
        console.log(QUEUE[0]);
        console.log(QUEUE[1]);
        console.log('pairing players');
        var rand = Math.round(Math.random());
        if(rand == 0) {
          QUEUE[0].emit('MazeRunnerStart');
          RUNNERS.push(QUEUE[0]);
          QUEUE[1].emit('TrapMasterStart');
          TRAPPERS.push(QUEUE[1]);
          QUEUE.splice(0,2);
        }
        else {
          QUEUE[1].emit('MazeRunnerStart');
          RUNNERS.push(QUEUE[1]);
          QUEUE[0].emit('TrapMasterStart');
          TRAPPERS.push(QUEUE[0]);
          QUEUE.splice(0,2);
        }
        console.log('Queue Size is %d', QUEUE.length);
      }
      
  });

  socket.on('timerStart', function(serverTime){

    var gameTimer = setInterval(function() {
      if (serverTime.startTime > 0) serverTime.startTime--;
    }, 1000);
    
    socket.on('timerTick', function(){ //take in variable total time and countdown server side
      socket.emit('timerTock', serverTime.startTime);
    });
  
  });

  socket.on('sendMapInfo', function(mapInfo){
    var i = TRAPPERS.indexOf(socket);
    RUNNERS[i].emit('receiveMapInfo', mapInfo);
    console.log('Got map info from Trapper');
  });
  
  
  socket.on('runnerReady', function(runnerInfo){
	var i = RUNNERS.indexOf(socket);
    TRAPPERS[i].emit('otherPlayerReady', runnerInfo);
    console.log('MazeRunner is ready.');
  });
  

  socket.on('trapperReady', function(mapInfo) {
	var i = TRAPPERS.indexOf(socket);
    RUNNERS[i].emit('trapMapDone', mapInfo);
    console.log('TrapMaster is ready.');
  });
  
  socket.on('moveLeft', function(playerInfo) {
	var i = RUNNERS.indexOf(socket);
	TRAPPERS[i].emit('movingLeft', playerInfo);
  });
  
  socket.on('moveRight', function(playerInfo) {
	var i = RUNNERS.indexOf(socket);
	TRAPPERS[i].emit('movingRight', playerInfo);
  });
  
  socket.on('moveDown', function(playerInfo) {
	var i = RUNNERS.indexOf(socket);
	TRAPPERS[i].emit('movingDown', playerInfo);
  });
  
  socket.on('moveUp', function(playerInfo) {
	var i = RUNNERS.indexOf(socket);
	TRAPPERS[i].emit('movingUp', playerInfo);
  });
  
  socket.on('dealHalf', function(currentHealth) {
	var i = RUNNERS.indexOf(socket);
	TRAPPERS[i].emit('damageHalf', currentHealth);
  });
  
  socket.on('dealFull', function(currentHealth) {
	var i = RUNNERS.indexOf(socket);
	TRAPPERS[i].emit('damageFull', currentHealth);
  });

  socket.on('antidoteUsed', function() {
  var i = RUNNERS.indexOf(socket);
  TRAPPERS[i].emit('usingAntidote');
  });

  socket.on('potionUsed', function(interval) {
  console.log('using potion in server');
  var i = RUNNERS.indexOf(socket);
  TRAPPERS[i].emit('usingPotion', interval);
  });




  socket.on('disconnect', function(){
    console.log('user ' + socket.id + ' disconnected');
    PLAYERS.splice(PLAYERS.indexOf(socket.id),1);
    QUEUE.splice(QUEUE.indexOf(socket.id),1);
    console.log('Number of Players: %d', PLAYERS.length);
    console.log('Queue Size is %d', QUEUE.length);
  });
});



app.get('*', function (req, res) {
      res.sendFile(__dirname + '/views/index.html');
});

//server.listen(12795);