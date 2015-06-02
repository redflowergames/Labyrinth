package as3 {
	
	import flash.display.MovieClip;
	import flash.events.*;	
	import flash.system.Security;
	
	// This class controls the game state in which players join a lobby.
	public class GSJoin extends GameState {
		
		var roomID:int;
		
		public function GSJoin(gsm:GameStateManager) {
			super(gsm);
			
			if(stage) Init();
			else addEventListener(Event.ADDED_TO_STAGE, Init);
			
			bttnJoin.addEventListener(MouseEvent.CLICK, HandleJoin);
			bttnJoin.visible = false;
			bttnBack.addEventListener(MouseEvent.CLICK, HandleBack);
		}

		private function Init(e:Event = null):void{
			removeEventListener(Event.ADDED_TO_STAGE, Init);
			lobbyList.addEventListener(Event.CHANGE, UpdateSelection);
		}
		
		// Deal with incoming lobby information.
		public function ReceiveLobbyList(rooms:Array, seats:Array):void{
			lobbyList.removeAll();
			for(var i:int = 0; i < rooms.length; i++){
				lobbyList.addItem( {label:"Lobby #" + rooms[i] + " : " + (8 - seats[i]) + " seats available",     data:rooms[i]} );
			}
		}
		
		public function UpdateSelection(e:Event){
			roomID = e.target.selectedItem.data;
			selectedLobbyText.text = "Selected Lobby: #" + roomID;
			if(!bttnJoin.visible) bttnJoin.visible = true;
		}

		// Sends joining packet to the server.
		public function HandleJoin(e:MouseEvent):void{
			Main.socket.SendPacketJoinLobby(roomID);
		}
		
		// Returns to the main title screen.
		public function HandleBack(e:MouseEvent):void{
			gsm.SwitchToTitle();
		}
		
		public override function Update():void{
		
		}
	}
}
