
var Player = require("./Player.js").Player;
var PlayerList = require("./PlayerList.js").PlayerList;
var Game = require("./Game.js").Game;

exports.GameList = function(){

	this.games = []; // object, but it's an associative array
	this.length = 0;
	this.gameID = 0;

	this.Get = function(index){
		if(this.games.hasOwnProperty(index)) return this.games[index];
		return null;
	};
	
	this.Add = function(game){
		while(this.Get(++this.gameID)) {} // if it returns a game, someone already has that id. so loops until the ID is not taken.
		
		// if receives rinfo, add new game. if receives game... (??)
		if(!(game instanceof Game)) {
			game = new Game(this.gameID, game);
		} else {
			game.id = this.gameID;
		}

		this.games[this.gameID] = game;
		this.length++;
		return game;
	};

	// receives game/room ID
	this.Remove = function(index){
		// if the game is in the array, remove it
		if(this.games[index] != null) {
			this.games[index] = null;
			this.length--;
		}
		//console.log("Game was not in gamelist");
		return false;
	};

	// pass in a function, and for every game, calls that function by passing in the game
	// inside of the function parameter, 'this' refers to the game(??)
	this.Loop = function(func){
		for(key in this.games){
			func.call(this.games[key]);
		}
	};

	
	this.State = function(){
		var state = {};
		this.loop(function(){
			
		});
	};
};