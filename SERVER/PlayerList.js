
var Player = require("./Player.js").Player;

exports.PlayerList = function(){

	this.players = []; // object, but it's an associative array
	this.length = 0;

	this.Get = function(index){
		if(index < players.length - 1)
			return players[index];
		return null;
	};

	// so you can use the object like an array, but rather than index, looks at rinfo to see if it matches
	this.GetByAddr = function(rinfo){
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i] == null){
				//console.log("there is a null player in the array");
				continue;
			}
			if(this.players[i].MatchesAddr(rinfo)) return this.players[i];
		}
		return null;
	};
	
	this.Add = function(rinfo){
		// receives rinfo, add new player
		// check that no existing players have that rinfo
		var player;
		var alreadyExists = false;
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i] == null){
				//console.log("there is a null player in the array");
				continue;
			}
			if(this.players[i].MatchesAddr(rinfo)){
				alreadyExists = true;
				player = this.players[i];
				//console.log("player already exists. returning found player");
			}
		}

		if(!alreadyExists){
			player = new Player(rinfo);
			this.players.push(player);
			this.length++;
		}
		return player;
	};

	// can receive a player or index; if it receives a player, gets the index of that player
	this.RemovePlayer = function(player){
		var returnPlayer;
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i] == null){
				//console.log("there is a null player in the array");
				continue;
			}
			if(this.players[i].MatchesAddr(player.rinfo)){
				returnPlayer = this.players.splice(i, 1)[0];
			}
		}

		if(returnPlayer == null) return; //console.log("Player does not exist.");
		else return returnPlayer;
	};

	this.RemoveIndex = function(index){
		if(index < this.players.length - 1 && this.players[index] != null)
			return this.players.splice(index, 1)[0];
		//else
			//console.log("Player index does not exist or is null.");
	};
};