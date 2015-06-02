
package as3 {
	
	import flash.display.MovieClip;
	import flash.net.DatagramSocket;
	import flash.events.DatagramSocketDataEvent;
	import flash.utils.ByteArray;
	
	import flash.net.InterfaceAddress;
	import flash.net.NetworkInfo;
	import flash.net.NetworkInterface;
	
	// an object for sending 
	public class MySocket extends DatagramSocket {

		// server/client address info
		//var ipClient:String = "";
		var ipServer:String = "";//
		var portClient:int = 4326;
		var portServer:int = 1236;
		public var address;
		
		// constructor
		function MySocket() {
			var networkInfo = NetworkInfo.networkInfo;
			var interfaces = networkInfo.findInterfaces();
			var interfaceObj;
			var tempAdd;
	
			//Get available interfaces
			for (var i = 0; i < interfaces.length; i++){
				interfaceObj = interfaces[i];
				
				for (var j = 0; j < interfaceObj.addresses.length; j++){
					tempAdd = interfaceObj.addresses[j];
					if (tempAdd.ipVersion == "IPv4" && tempAdd.address != "127.0.0.1" && interfaceObj.displayName.indexOf("Local Area Connection") < 0) {
						trace(tempAdd.address + "displayname: " + interfaceObj.displayName + "\n");
						address = tempAdd.address;
					}
				}
			}
		}
		
		// sets up the socket to begin sending/receiving packets
		public function Start():void {
			addEventListener(DatagramSocketDataEvent.DATA, HandleData);
			bind(portClient/*, ipClient*/);
			receive();
		}
		
		// the event handler for receiving incoming packets
		// e	datagramsocketevent	the event that triggered the handler
		// return void
		function HandleData(e:DatagramSocketDataEvent):void {
			var type:uint = e.data.readUnsignedByte(); // get message type
			switch(type){
				case Protocol.SERVER_IP:
					if(ipServer == ""){
						trace("Server IP set to: " + e.srcAddress);
						ipServer = e.srcAddress;
					}
					break;
				case Protocol.BROADCAST_LOBBY_LIST:
					var numRooms:uint = e.data.readUnsignedByte();
					//trace("packet received: lobby list");
					//trace("Rooms received: " + numRooms);
					var rooms:Array = new Array();
					var seats:Array = new Array();
					if(numRooms > 0){
						for(var i:int = 0; i < numRooms; i++){
							var roomID:uint = e.data.readUnsignedByte();
							var seatsAvail:uint = e.data.readUnsignedByte();
							rooms.push(roomID);
							seats.push(seatsAvail);
						}
						
						Main.gsm.ReceiveLobbyList(rooms, seats);
					}
					break;
				case Protocol.DENIED:
					//trace("packet received: lobby full or host left");
					Main.gsm.SwitchToTitle();
					break;
				// Join request accepted
				case Protocol.JOIN_ACCEPT:		
					//trace("packet received: join request accepted");
					var roomID:uint = e.data.readUnsignedByte();
					var playerID:uint = e.data.readUnsignedByte();
					Main.gsm.SwitchToLobby(roomID, playerID);
					break;
				// Update to the lobby
				case Protocol.LOBBY_STATE:		
					//trace("packet received: update lobby seats");
					var seatsFull:uint = e.data.readUnsignedByte();
					Main.gsm.UpdateLobby(seatsFull);
					break;
				// Begin game
				case Protocol.START_ACCEPT:
					Main.gsm.SwitchToPlay();
					break;
				// Info on all players
				case Protocol.WORLDSTATE_PLAYERINFO:
					var numPlayers:uint = e.data.readUnsignedByte();
					for(var i:int = 0; i < numPlayers; i++){
						var pID:uint = e.data.readUnsignedByte();
						var px:Number = e.data.readFloat();
						var py:Number = e.data.readFloat();
						Main.gsm.ReceiveWorldstatePlayer(pID, px, py);
					}
					break;
				// Request to kill a specific player
				case Protocol.KILL_PLAYER:
					var playerToKill:uint = e.data.readUnsignedByte();
					var winner:uint = e.data.readUnsignedByte();
					Main.gsm.KillPlayer(playerToKill, winner);
					break;
				// Request to update this player's stats
				case Protocol.STAT_UPDATE:
					var hp:uint = e.data.readUnsignedShort();
					var maxhp:uint = e.data.readUnsignedShort();
					var energy:uint = e.data.readUnsignedShort();
					var maxenergy:uint = e.data.readUnsignedShort();
					Main.gsm.UpdateStats(hp, maxhp, energy, maxenergy);
					break;
				// Request to add enemy to the world
				case Protocol.ADD_ENEMY:
					var eType:uint = e.data.readUnsignedByte();
					Main.gsm.AddEnemy(eType);
					break;
				// Request to kill a specific enemy
				case Protocol.REMOVE_ENEMY:
					var eID:uint = e.data.readUnsignedByte();
					Main.gsm.RemoveEnemy(eID);
					break;
				// Info on all enemies
				case Protocol.WORLDSTATE_ENEMYINFO:
					var numEnemies:uint = e.data.readUnsignedByte();
					for(var i:int = 0; i < numEnemies; i++){
						var pID:uint = e.data.readUnsignedByte();
						var playerID:uint = e.data.readUnsignedByte();
						var px:Number = e.data.readFloat();
						var py:Number = e.data.readFloat();
						Main.gsm.ReceiveWorldstateEnemy(pID, playerID, px, py);
					}
					break;
				// Info on all spawners
				case Protocol.WORLDSTATE_SPAWNERINFO:
					var numSpawners:uint = e.data.readUnsignedByte();
					for(var i:int = 0; i < numSpawners; i++){
						var pID:uint = e.data.readUnsignedByte();
						var px:Number = e.data.readFloat();
						var py:Number = e.data.readFloat();
						Main.gsm.ReceiveWorldstateSpawner(pID, px, py);
					}
					break;
				// REquest to add a pickup to the world
				case Protocol.ADD_PICKUP:
					var pType:uint = e.data.readUnsignedByte();
					var pAmount:uint = e.data.readUnsignedByte();
					Main.gsm.AddPickup(pType, pAmount);
					break;
				// Request to remove a specific pickup
				case Protocol.REMOVE_PICKUP:
					var pID:uint = e.data.readUnsignedByte();
					Main.gsm.RemovePickup(pID);
					break;
				// Info on all pickups
				case Protocol.WORLDSTATE_PICKUPINFO:
					var numPickups:uint = e.data.readUnsignedByte();
					for(var i:int = 0; i < numPickups; i++){
						var pID:uint = e.data.readUnsignedByte();
						var px:Number = e.data.readFloat();
						var py:Number = e.data.readFloat();
						Main.gsm.ReceiveWorldstatePickups(pID, px, py);
					}
					break;
				default:
			}
		}
		
		// creates and sends a HOST packet
		function SendPacketHostLobby():void {
			var data:ByteArray = new ByteArray();
			data.writeByte(Protocol.HOST_LOBBY);
			// start countdown for host accept
			SendPacket(data);
		}
		
		// creates and sends a JOIN packet
		function SendPacketJoinLobby(roomID:int):void {
			var data:ByteArray = new ByteArray();
			data.writeByte(Protocol.JOIN_LOBBY);
			data.writeByte(roomID);
			SendPacket(data);
		}
		
		// creates and sends a LEAVE packet
		function SendPacketLeaveLobby(roomID:int):void {
			var data:ByteArray = new ByteArray();
			data.writeByte(Protocol.LEAVE_LOBBY);
			data.writeByte(roomID);
			SendPacket(data);
		}
		
		// creates and sends a START packet
		function SendPacketStartGame(roomID:int):void {
			var data:ByteArray = new ByteArray();
			data.writeByte(Protocol.START_GAME);
			data.writeByte(roomID);
			SendPacket(data);
		}
		
		// creates and sends an input packet and caches it.
		// pc	playercommand	the command to send to the server
		// @return void
		function SendPacketInput(bits:uint):void {
			var data:ByteArray = new ByteArray();
			data.writeByte(Protocol.INPUT);
			data.writeByte(bits);
			SendPacket(data);
		}
		
		// sends any packets that you give to it.
		// buff	bytearray	the packet to send.
		function SendPacket(buff:ByteArray):void {
			try {
				send(buff, 0, buff.length, ipServer, portServer);
				
			} catch (e:Error) {
				trace("error sending: " + e.toString());
			}
		}
	}
}
