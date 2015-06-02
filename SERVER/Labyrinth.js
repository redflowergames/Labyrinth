
var Socket = require("./Socket.js").Socket;
var PlayerList = require("./PlayerList.js").PlayerList;
var GameList = require("./GameList.js").GameList;
var Game = require("./Game.js").Game;

global.Config = {
	gravity:2,
	tick:33,
	BROADCASTIP: "255.255.255.255",//
	SERVERPORT:1236,
	CLIENTPORT:4326,
	tileSize:64,
	numSpawners:20
};

global.Random = {
	Range:function(min, max){ // max is exclusive
		var num = (Math.random() * (max - min)) + min;
		return num;
	},
	RangeInt:function(min, max){ // max is inclusive
		var num = Math.floor(Math.random() * (max - min + 1)) + min;
		return num;
	},
	ChooseOne:function(array){
		return array[global.Random.RangeInt(0, array.length-1)];
	}
};

global.Labyrinth = {
	roomID:0,
	players:new PlayerList(),
	gamelist:[null],
	joinableGames:0,
	socket:new Socket(),
	Start:function(){
		this.socket.Listen();
		this.socket.BroadcastKickAll();
	},
	Play:function(id){ // call this to start the gameloop
		this.gamelist[id].SetUp();
	},
};

global.Labyrinth.Start();