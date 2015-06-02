
var dgram = require("dgram");
var Protocol = require("./Protocol.js").Protocol;
var Game = require("./Game.js").Game;

exports.Socket = function(){
	var me = this;
	this.socket = dgram.createSocket("udp4");
	this.socket.on("message", function(buff, rinfo){

		var type = buff.readUInt8(0);

		var player = global.Labyrinth.players.GetByAddr(rinfo);

		//console.log("Received message from " + rinfo.address + ":" + rinfo.port);

		if(player == null) { // player wasn't in collection yet
			if(type == Protocol.HOST_LOBBY || type == Protocol.JOIN_LOBBY){ // if it was a join request, add them
				console.log("player joined");
				player = global.Labyrinth.players.Add(rinfo);
				player.Refresh();
			} else { // if not a join request, just disconnect them
				//console.log("disconnecting player");
				//me.SendDisconnect(rinfo);
			}
		}

		// else, player is not null.

		// udp is not connection based, so if we want to tell if they're disconnected, keep track of the last time they sent a packet. if it's been too long, they timed out.
		// this function says they received a packet so don't time out them.
		//player.Refresh();

		switch(type){
			case Protocol.HOST_LOBBY:
				if(!player.hosting){
					//console.log("sending host accept");
					var roomID = ++global.Labyrinth.roomID;
					player.roomID = roomID;
					//console.log("Player " + player.rinfo.address + " created room " + roomID);
					player.hosting = true;
					global.Labyrinth.gamelist.push(new Game(roomID));
					global.Labyrinth.joinableGames++;
					var gameInstance = global.Labyrinth.gamelist[roomID];
					gameInstance.AddPlayer(player, 0);
					me.SendJoinAccept(player, roomID, 0);
					me.SendLobbyState(gameInstance);
					if(global.Labyrinth.joinableGames == 1) me.Update();
				}else{
					// server thought this player was hosting already but they sent another host request
					global.Labyrinth.gamelist[player.roomID] = null;
					global.Labyrinth.joinableGames--;
					player.roomID = null;
					player.hosting = false;
				}
				break;
			case Protocol.JOIN_LOBBY:
			//console.log("sending join accept");
				var roomID = buff.readUInt8(1);
				var gameInstance = global.Labyrinth.gamelist[roomID];
				var emptyIndex = -1;
				for(var i = 0; i < gameInstance.players.length; i++){
					if(gameInstance.players[i] == null){
						emptyIndex = i;
						break;
					}
				}
				// game is full
				if(emptyIndex == -1){ 
					me.SendDeny(player);
				}else{
					gameInstance.AddPlayer(player, emptyIndex);

					//console.log("Player " + player.rinfo.address + " wants to join room " + roomID + "in seat " + emptyIndex);
					player.hosting = false;
					me.SendJoinAccept(player, roomID, emptyIndex);
					me.SendLobbyState(gameInstance);
				}
				break;
			case Protocol.LEAVE_LOBBY:
				player.roomID = null;
				var roomID = buff.readUInt8(1);
				var gameInstance = global.Labyrinth.gamelist[roomID];
				if(player.hosting){
					me.SendHostLeft(global.Labyrinth.gamelist[roomID].players);
					global.Labyrinth.gamelist[roomID] = null;
					global.Labyrinth.joinableGames--;
					player.hosting = false;
				}else{
					gameInstance.RemovePlayer(player);
					global.Labyrinth.players.RemovePlayer(player);
					me.SendLobbyState(gameInstance);
				}
				break;
			case Protocol.START_GAME:
				var roomID = buff.readUInt8(1);
				var gameInstance = global.Labyrinth.gamelist[roomID];
				if(gameInstance.fullSeats >= 2){
					global.Labyrinth.joinableGames--;
					me.SendLobbyState(gameInstance);
					me.SendStartAccept(roomID);
					global.Labyrinth.Play(roomID);
				}
				break;
			case Protocol.INPUT:
				var flags = buff.readUInt8(1);
				//console.log("flags: " + flags);
				var Q = (flags & 64) > 0;
				var W = (flags & 32) > 0;
				var E = (flags & 16) > 0;

				var P = (flags & 8) > 0;
				var J = (flags & 4) > 0;
				var L = (flags & 2) > 0;
				var R = (flags & 1) > 0;

				player.Keys.Update(Q, W, E, P, J, L, R);
				break;
			case Protocol.BROADCAST_LOBBY_LIST:
				//console.log("because it gets broadcasted so yknow.");
				break;
			default:
				console.log("received an unkown packet type: "+type);
		}
	});

	this.socket.on("listening", function(){
		console.log("listening on port " + global.Config.SERVERPORT);
		me.BroadcastServerAddress();
	});

	this.Listen = function(){
		this.socket.bind(global.Config.SERVERPORT, function () {
		    me.socket.setBroadcast(true);
		});
	};

	this.BroadcastServerAddress = function(){
		var buff = new Buffer(1);
		buff.writeUInt8(Protocol.SERVER_IP, 0);
		me.Broadcast(buff);
		console.log("Broadcasting Server IP...");

		setTimeout(me.BroadcastServerAddress, 4000);
	}

	this.Update = function(){
		if(global.Labyrinth.joinableGames > 0){
			me.BroadcastLobbyList();
			setTimeout(me.Update, 4000);
		}
	}

	this.Send = function(buff, rinfo){
		me.socket.send(buff, 0, buff.length, rinfo.port, rinfo.address, function(err, bytes){

		});
	};

	this.SendToPlayers = function(buff, players){
		for(var i = 0; i < players.length; i++){
			if(players[i] != null){
				me.socket.send(buff, 0, buff.length, players[i].rinfo.port, players[i].rinfo.address, function(err, bytes){

				});
			}
		}
	}

	this.Broadcast = function(buff){
		var rinfo = {port:global.Config.CLIENTPORT, address:global.Config.BROADCASTIP};
		//console.log("Attempting to broadcast data to " + rinfo.address + ":" + rinfo.port);
		
		me.socket.send(buff, 0, buff.length, rinfo.port, rinfo.address, function(err, bytes){

		});
	};

	//////////////////////////////////// SEND FUNCTIONS

	this.BroadcastLobbyList = function(){

		var numOpenLobbies = 0;
		for(var i = 0; i < global.Labyrinth.gamelist.length; i++){
			var gameInstance = global.Labyrinth.gamelist[i];
			if(gameInstance != null && gameInstance.fullSeats < 8 && !gameInstance.started){
				numOpenLobbies++;
			}
		}

		var hb = 2; // header bytes; static; same length for every packet
		var vb = 2; // variable bytes; nonstatic; bytes per object in loop
		var len = hb + vb * numOpenLobbies;

		var buff = new Buffer(len);
		buff.writeUInt8(Protocol.BROADCAST_LOBBY_LIST, 0);
		buff.writeUInt8(numOpenLobbies, 1);
		
		var i2 = 0;
		for(var i = 1; i < global.Labyrinth.gamelist.length + 1; i++){
			var gameInstance = global.Labyrinth.gamelist[i];
			if(gameInstance != null && gameInstance.fullSeats < 8 && !gameInstance.started){
				buff.writeUInt8(gameInstance.id, 2 + i2*vb);
				buff.writeUInt8(gameInstance.fullSeats, 3 + i2*vb);
				console.log("Broadcasting game: " + gameInstance.id + ", full seats: " + gameInstance.fullSeats);
				i2++;
			}
		}

		me.Broadcast(buff);
	};

	this.SendJoinAccept = function(player, roomID, playerID){
		var buff = new Buffer(3);
		var gameInstance = global.Labyrinth.gamelist[roomID];
		buff.writeUInt8(Protocol.JOIN_ACCEPT, 0);
		buff.writeUInt8(roomID, 1);
		buff.writeUInt8(playerID, 2);
		me.Send(buff, player.rinfo);
	};

	this.SendDeny = function(player){
		var buff = new Buffer(1);
		var gameInstance = global.Labyrinth.gamelist[roomID];
		buff.writeUInt8(Protocol.DENIED, 0);
		me.Send(buff, player.rinfo);
	};

	this.SendHostLeft = function(players){
		for(var i = 0; i < players.length; i++){
			if(players[i] == null) continue;
			if(players[i].hosting) players[i] = null;
		}
		var buff = new Buffer(1);
		buff.writeUInt8(Protocol.DENIED, 0);
		me.SendToPlayers(buff, players);
	};

	this.BroadcastKickAll = function(){
		var buff = new Buffer(1);
		buff.writeUInt8(Protocol.DENIED, 0);
		me.Broadcast(buff);
	};

	this.SendLobbyState = function(gameInstance){
		var buff = new Buffer(2);
		var takenSeats = 0;

		// host goes in first, will be on left
		for(var i = 0; i < 8; i++){
			if(gameInstance.players[i] != null) takenSeats ++;
			if(i < 7) takenSeats = takenSeats << 1;
		}

		buff.writeUInt8(Protocol.LOBBY_STATE, 0);
		buff.writeUInt8(takenSeats, 1);
		me.SendToPlayers(buff, gameInstance.players);
	};

	this.SendStartAccept = function(roomID){
		var buff = new Buffer(1);
		buff.writeUInt8(Protocol.START_ACCEPT, 0);
		me.SendToPlayers(buff, global.Labyrinth.gamelist[roomID].players);
	};

	/**************************************************
	* Packet Type: KILL_PLAYER
	* 1 for end game, 0 for keep playing
	* ID of player to kill (0-7)
	* ID of winning player (1-8)
	**************************************************/
	this.SendKillPlayer = function(gameInstance, playerID, winner){

		var len = 3;
		var buff = new Buffer(len);

		// header bytes
		buff.writeUInt8(Protocol.KILL_PLAYER, 0);
		buff.writeUInt8(playerID, 1);
		buff.writeUInt8(winner, 2);

		this.SendToPlayers(buff, gameInstance.players);
	};

	/**************************************************
	* Packet Type: WORLDSTATE_PLAYERINFO
	* Number of Players
	*   Player index
	*   worldX
	*   worldY
	**************************************************/
	this.SendWorldstatePlayers = function(gameInstance){

		var numPlayers = gameInstance.fullSeats;
		var hb = 2; // header bytes; static; same length for every packet
		var vb = 9; // variable bytes; nonstatic; bytes per object in loop

		var len = hb + vb * numPlayers;
		var buff = new Buffer(len);

		// header bytes
		buff.writeUInt8(Protocol.WORLDSTATE_PLAYERINFO, 0);
		buff.writeUInt8(numPlayers, 1);

		// variable bytes
		for(var i = 0; i < numPlayers; i++){
			if(gameInstance.players[i] == null) continue;
			buff.writeUInt8(i, 2 + i*vb);
			buff.writeFloatBE(gameInstance.players[i].worldX, 3 + i*vb);
			buff.writeFloatBE(gameInstance.players[i].worldY, 7 + i*vb);

			//console.log("Player " + i + " is at (" + gameInstance.players[i].worldX + ", " + gameInstance.players[i].worldY + ")");
		}

		this.SendToPlayers(buff, gameInstance.players);
	};

	/**************************************************
	* Packet Type: STAT_UPDATE
	* Current HP
	* Total HP
	* Current Energy
	* Total Energy
	**************************************************/
	this.SendStats = function(player){
		var len = 9;
		var buff = new Buffer(len);

		buff.writeUInt8(Protocol.STAT_UPDATE, 0);
		buff.writeUInt16BE(player.health, 1);
		buff.writeUInt16BE(player.maxHealth, 3);
		buff.writeUInt16BE(player.energy, 5);
		buff.writeUInt16BE(player.maxEnergy, 7);

		me.Send(buff, player.rinfo);
	};

	/**************************************************
	* Packet Type: ADD_ENEMY
	* Enemy Type
	**************************************************/
	this.SendAddEnemy = function(gameInstance, eType){
		var len = 2;
		var buff = new Buffer(len);

		buff.writeUInt8(Protocol.ADD_ENEMY, 0);
		buff.writeUInt8(eType, 1);
		this.SendToPlayers(buff, gameInstance.players);
	};


	/**************************************************
	* Packet Type: REMOVE_ENEMY
	* Enemy ID
	**************************************************/
	this.SendRemoveEnemy = function(gameInstance, eID){
		var len = 2;
		var buff = new Buffer(len);

		buff.writeUInt8(Protocol.REMOVE_ENEMY, 0);
		buff.writeUInt8(eID, 1);
		this.SendToPlayers(buff, gameInstance.players);
	};

	/**************************************************
	* Packet Type: WORLDSTATE_ENEMYINFO
	* Number of Enemies
	*   Enemy index
	*	Target player ID
	*   worldX
	*   worldY
	**************************************************/
	this.SendWorldstateEnemies = function(gameInstance){

		var numEnemies = gameInstance.enemies.length;
		var hb = 2; // header bytes; static; same length for every packet
		var vb = 10; // variable bytes; nonstatic; bytes per object in loop

		var len = hb + vb * numEnemies;
		var buff = new Buffer(len);

		// header bytes
		buff.writeUInt8(Protocol.WORLDSTATE_ENEMYINFO, 0);
		buff.writeUInt8(numEnemies, 1);

		// variable bytes
		for(var i = 0; i < numEnemies; i++){
			buff.writeUInt8(i, 2 + i*vb);
			buff.writeUInt8(gameInstance.enemies[i].targetPlayerID, 3 + i*vb);
			buff.writeFloatBE(gameInstance.enemies[i].worldX, 4 + i*vb);
			buff.writeFloatBE(gameInstance.enemies[i].worldY, 8 + i*vb);

			//console.log("enemy " + i + " is at (" + gameInstance.enemies[i].worldX + ", " + gameInstance.enemies[i].worldY + ")");
		}

		this.SendToPlayers(buff, gameInstance.players);
	};

	/**************************************************
	This only runs at gamestart and when spawners are activated, to show new spawners.
	* Packet Type: WORLDSTATE_SPAWNERINFO
	* Number of Spawners
	*   Spawner index
	*   worldX
	*   worldY
	**************************************************/
	this.SendWorldstateSpawners = function(gameInstance){

		var numSpawners = gameInstance.spawners.length;
		var hb = 2; // header bytes; static; same length for every packet
		var vb = 9; // variable bytes; nonstatic; bytes per object in loop

		var len = hb + vb * numSpawners;
		var buff = new Buffer(len);

		// header bytes
		buff.writeUInt8(Protocol.WORLDSTATE_SPAWNERINFO, 0);
		buff.writeUInt8(numSpawners, 1);

		// variable bytes
		for(var i = 0; i < numSpawners; i++){
			buff.writeUInt8(i, 2 + i*vb);
			buff.writeFloatBE(gameInstance.spawners[i].worldX, 3 + i*vb);
			buff.writeFloatBE(gameInstance.spawners[i].worldY, 7 + i*vb);
		}

		this.SendToPlayers(buff, gameInstance.players);
	};

	/**************************************************
	* Packet Type: ADD_PICKUP
	* Pickup Type
	* Pickup Amount
	**************************************************/
	this.SendAddPickup = function(gameInstance, pType, pAmount){
		var len = 3;
		var buff = new Buffer(len);

		buff.writeUInt8(Protocol.ADD_PICKUP, 0);
		buff.writeUInt8(pType, 1);
		buff.writeUInt8(pAmount, 2);
		this.SendToPlayers(buff, gameInstance.players);
	};


	/**************************************************
	* Packet Type: REMOVE_PICKUP
	* Pickup ID
	**************************************************/
	this.SendRemovePickup = function(gameInstance, pID){
		var len = 2;
		var buff = new Buffer(len);

		buff.writeUInt8(Protocol.REMOVE_PICKUP, 0);
		buff.writeUInt8(pID, 1);
		this.SendToPlayers(buff, gameInstance.players);
	};



	/**************************************************
	* Packet Type: WORLDSTATE_PICKUPINFO
	* Number of Moving Pickups (Static ones don't need to be sent anymore)
	*   Pickup index
	*   worldX
	*   worldY
	**************************************************/
	this.SendWorldstatePickups = function(gameInstance){

		var numPickups = gameInstance.pickups.length;

		var numMoving = 0;
		for(var i = 0; i < numPickups; i++){
			if(gameInstance.pickups[i].moving) numMoving++;
		}
		var hb = 2; // header bytes; static; same length for every packet
		var vb = 9; // variable bytes; nonstatic; bytes per object in loop

		var len = hb + vb * numMoving;
		var buff = new Buffer(len);

		// header bytes
		buff.writeUInt8(Protocol.WORLDSTATE_PICKUPINFO, 0);
		buff.writeUInt8(numMoving, 1);

		// variable bytes
		var iMoving = 0;
		for(var i = 0; i < numPickups; i++){
			if(gameInstance.pickups[i].moving){
				buff.writeUInt8(i, 2 + iMoving*vb);
				buff.writeFloatBE(gameInstance.pickups[i].worldX, 3 + iMoving*vb);
				buff.writeFloatBE(gameInstance.pickups[i].worldY, 7 + iMoving*vb);
				iMoving++;
			}
		}

		this.SendToPlayers(buff, gameInstance.players);
	};
};