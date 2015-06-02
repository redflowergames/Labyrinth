package as3 {
	
	import flash.display.MovieClip;
	import flash.events.*;	
	
	// This class controls the lobby screen.
	public class GSLobby extends GameState {
		
		public var players:Array = new Array(null, null, null, null, null, null, null, null);
		var numPlayers:int
		var nameTexts:Array = new Array();
		var alerts:Array = new Array();
		public var roomID:uint;
		public var playerID:uint;
		var hosting:Boolean = false;
		
		public function GSLobby(gsm:GameStateManager, roomID:uint, playerID:uint) {
			super(gsm);

			this.roomID = roomID;
			this.playerID = playerID;

			this.players[playerID] = new Player(Config.StageWidth/2, Config.StageHeight/2, 1);
			if(playerID == 0) hosting = true;
			else this.players[0] = new Player(-100, -100, 2);
			
			nameTexts.push(name1, name2, name3, name4, name5, name6, name7, name8);
			lobbyText.text = "Lobby #" + roomID;
			
			// Checks to see whether you're the host player or not.
			if(hosting){
				name1.text = "Player 1 (You)";
			}else{
				name1.text = "Player 1 (Host)";
				nameTexts[playerID].text = "Player " + (playerID + 1) + " (You)";
			}
			
			bttnStart.visible = false;
			bttnStart.addEventListener(MouseEvent.CLICK, HandleStart);
			bttnBack.addEventListener(MouseEvent.CLICK, HandleBack);
		}

		public function UpdateLobby(fullSeats:uint):void{
			numPlayers = 0;
			for(var i:int = 7; i >= 0; i--){
				if(i == 0 || i == playerID){
					numPlayers++;
					if(i != 0) fullSeats >>= 1; // skip host and yourself
					continue;
				}

				if(fullSeats & 128 == 128){
					nameTexts[i].text = "Player " + (i+1);
					players[i] = new Player(-100, -100, 2);
					numPlayers++;
				}else{
					nameTexts[i].text = "empty seat";
					players[i] = null;
				}
				fullSeats >>= 1;
			}
			if(hosting && numPlayers > 1) bttnStart.visible = true;
		}
		
		//////////BUTTON FUNCTIONS
		public function HandleStart(e:MouseEvent):void{
			Main.socket.SendPacketStartGame(roomID);
		}
		
		public function HandleBack(e:MouseEvent):void{
			gsm.SwitchToTitle();
			Main.socket.SendPacketLeaveLobby(roomID);
		}		
	}
}
