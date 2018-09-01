var createError = require('http-errors');
var express = require('express');
var bluebird = require('bluebird');
var redis = require('redis');
var cors = require('cors')
bluebird.promisifyAll(redis);
//const {promisify} = require('util');
//var client = redis.createClient();
//obj = {'name':'Ankur', isOnline: true}
//client.set('myKey',JSON.stringify(obj), redis.print);
//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
var MongoClient = require('mongodb').MongoClient;
var URL = 'mongodb://localhost:27017/admin';
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


//ServicesCode
/*app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
*/
app.post('/register', function (req, resp) {
  var self = this
  var userObj = {}
  MongoClient.connect('mongodb://localhost', function (err, client) {
    if (err) throw err;
    var db = client.db('admin');
    db.collection('users').find({ "uid": req.body.uid }).toArray(function (err, docs) {
      self.userObj = JSON.stringify(docs[0]);
      console.log("USER Object: ", self.userObj);
      client.close();
    })
  });

  MongoClient.connect('mongodb://localhost', function (err, client) {
    if (err) throw err;
    var db = client.db('admin');
    console.log("SELF_userObj::", self.userObj);
    if (self.userObj === undefined) {
      console.log("Inside");
      db.collection("users").insertOne(req.body, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");

        resp.send({ "exists": false })
      })
    }
    else
      resp.send({ "exists": true })
  })
})

app.post('/login', function (req, res) {
  var self = this;
  var obj = {};
  var x = {};
  var liveUsers = [];
  MongoClient.connect('mongodb://localhost', function (err, client) {
    if (err) throw err;
    var db = client.db('admin');
    db.collection('users').find({ "uid": req.body.uid, "pwd": req.body.pwd }).toArray(function (err, docs) {
      self.obj = JSON.stringify(docs[0]);
      console.log("LOGIN Object: ", req.body.uid, req.body.pwd);
      client.close();
      if (self.obj === undefined) {
        console.log("FALSE")
        x = { "uid": req.body.uid }
        x["isValid"] = false;
        res.send(x);
      }
      else {
        console.log("TRUE");
        temp = JSON.parse(self.obj);
        x = { "uid": temp["uid"] }
        x["isValid"] = true
      }

      var redisClient = redis.createClient();
      //const getAsync = promisify(redisClient.get).bind(redisClient);
      redisClient.on('connect', function () {
        console.log('Redis client connected');
      });
      redisClient.getAsync('onlineUsers').then((result) => {
        if (result != null) {
          liveUserArr = [result];
          liveUsers = liveUserArr.toString().split(",");

          console.log("LIVE_USERS::", liveUsers.toString().split(","));
          //liveUsers.add(Array.from(result));
          var found = 0;
          for (i = 0; i < liveUsers.length; i++) {
            if (req.body.uid === liveUsers[i]) {
              //console.log("FOUND::",liveUsers[i]);
              found = 1;
              break;
            }
          }
          if (found == 1) {
            found = 0
          }
          else {
            console.log("NOT FOUND")
            liveUsers.push(req.body.uid);
          }
          //console.log("ADDED::",liveUsers);
        }
        else {
          liveUsers.push([req.body.uid]);
        }
        //console.log("ArrayFrom::",Array.from(liveUsers));
        redisClient.set('onlineUsers', liveUsers.toString(), redis.print);
        //redisClient.set("online","hola!",redis.print);
        //console.log("IP::",req.connection.remoteAddress,"PORT::",req.connection.remotePort);
        for (idx = 0; idx < liveUsers.length; idx++) {
          if (liveUsers[idx] == req.body.uid)
            liveUsers.splice(idx)
        }
        x["liveUsers"] = liveUsers;
        console.log("SENDDD::", x);
        res.send(x);
      });
    });
  });
});

app.get('/onlineUsers', function (req, res) {
  var userId = req.param('userId');
  var redisClient = redis.createClient();
  var liveUsersObj = {};
  redisClient.on('connect', function () {
    console.log('getOnlineUsers Redis client connected');
  });
  redisClient.getAsync('onlineUsers').then((result) => {
    //console.log("UserID::",userId,"Result::",result);
    if (result != null) {
      liveUserArr = [result];
      liveUsers = liveUserArr.toString().split(",");
      console.log("UserID::", userId, "Result::", liveUsers.length)
      liveUsersObj["liveUsers"] = liveUsers;
      console.log("SENDDD::", liveUsersObj);
      res.send(liveUsersObj);
    }
  });
})

//challenge API

app.get('/getChallenge', function (req, resp) {
  var self = this
  var id = req.param('id');
  var redisClient = redis.createClient();
  redisClient.on('connect', function () {
    console.log('Redis client connected');
  });
  redisClient.getAsync(id).then((result) => {
    console.log("CHALLENGE::", result);
    resp.send(result);
  });
});

app.post('/postChallenge', function (req, res) {
  var fromId = req.body.fromId;
  var toId = req.body.toId;
  var redisClient = redis.createClient();
  redisClient.on('connect', function () {
    console.log('Redis client connected');
  });
  var challengeObj = { "fromId": fromId, "toId": toId, "isAccepted": false };
  redisClient.set(toId, JSON.stringify(challengeObj), redis.print);
  res.send({ "res": "Voila! Challenge is added to DB" });
});

app.post('/initializeGame', function (req, res) {
  var toId = req.body.toId;
  var fromId = req.body.fromId;
  var gameId = fromId + toId + "_Game";
  var redisClient = redis.createClient();
  redisClient.on('connect', function () {
    console.log('InitializeGame Redis client connected');
  });
  var challengeObj = req.body;
  var moveMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  redisClient.set(toId, JSON.stringify(challengeObj), redis.print);
  var gameObject = { "fromId": fromId, "toId": toId, "turn": fromId, "moveMatrix": moveMatrix, "win": "", "lose": "", "turnCount": 0 };
  redisClient.set(gameId, JSON.stringify(gameObject), redis.print);
  res.send("REDIS UPDATED!!")
});

app.get('/getGame', function (req, resp) {
  var self = this
  var gameId = req.param('gameId');
  var redisClient = redis.createClient();
  redisClient.on('connect', function () {
    console.log('Redis client connected');
  });
  redisClient.getAsync(gameId).then((result) => {
    console.log("GET_GAME::Game::", result);
    resp.send(result);
  });
});

app.get('/getMove', function (req, resp) {
  var self = this
  var gameId = req.param('gameId');
  var redisClient = redis.createClient();
  redisClient.on('connect', function () {
    console.log('Redis client connected');
  });
  redisClient.getAsync(gameId).then((result) => {
    console.log("GET_MOVE::Game::", result);
    resp.send(result);
  });
});

app.post('/updateMove', function (req, res) {
  var gameId = req.body.fromId + req.body.toId + "_Game";
  var fromId = req.body.fromId;
  //console.log("FROM_ID:",fromId);
  //console.log("TO_ID::",req.body.toId);
  var madeBy = req.body.madeBy;
  var turn = req.body.turn;
  var x = req.body.x;
  var y = req.body.y;
  var count = req.body.turnCount;
  var gameData = {};
  var redisClient = redis.createClient();
  redisClient.on('connect', function () {
    console.log('Redis client connected');
  });
  redisClient.getAsync(gameId).then((result) => {
    gameData = JSON.parse(result);
    //console.log("GAME_DATA:",gameData);
    gameData["turn"] = turn;
    if (gameData["moveMatrix"][x][y] == 0) {
      gameData["moveMatrix"][x][y] = madeBy;
      gameData["lastX"] = x;
      gameData["lastY"] = y;
      gameData["turnCount"] = count;
      redisClient.set(gameId, JSON.stringify(gameData), redis.print);
      res.send({ "madeBy": madeBy, "x": x, "y": y, "turn": turn, "moveMatrix": gameData["moveMatrix"], "invalidMove": false });
    }
    else {
      res.send({ "invalidMove": true });
    }
  })
});

app.post("/finishGame", function (req, res) {
  var gameId = req.body.fromId + req.body.toId + "_Game";
  var win = req.body.winId;
  var gameData = {}
  var redisClient = redis.createClient();
  redisClient.on('connect', function () {
    console.log('finishGame Redis client connected');
  });
  console.log("FINISH_GAME_OBJECT::", req.body);
  redisClient.getAsync(gameId).then((result) => {
    gameData = JSON.parse(result);
    gameData["win"] = win;
    redisClient.set(gameId, JSON.stringify(gameData), redis.print);
    redisClient.del(req.body.toId);
    res.send({ "updated": true });
  });
});

app.get("/clearGame", function (req, resp) {
  var self = this
  var gameId = req.param('gameId');
  var redisClient = redis.createClient();
  redisClient.on('connect', function () {
    console.log('Redis client connected');
  });
  redisClient.getAsync(gameId).then((result) => {
    redisClient.del(gameId);
  })

});

app.get("/signout", function (req, resp) {
  var self = this
  var userId = req.param('uid');
  var redisClient = redis.createClient();
  redisClient.on('connect', function () {
    console.log('Redis client connected');
  });
  redisClient.getAsync('onlineUsers').then((result) => {
    if (result != null) {
      let m;
      liveUserArr = [result];
      liveUsers = liveUserArr.toString().split(",");
      if (liveUsers.length > 1) {
        for (m = 0; m < liveUsers.length; m++) {
          if (userId === liveUsers[m]) {
            liveUsers.splice(m, 1);
          }
        }
        redisClient.set('onlineUsers', liveUsers.toString(), redis.print);
      }
      else{
        redisClient.del('onlineUsers');
      }

    }
  });
  resp.send({});
});
app.listen(3001);
