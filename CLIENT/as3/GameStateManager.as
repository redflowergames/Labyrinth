package as3 {
	import flash.display.MovieClip;
	
	// This class controls game state flow.
	public class GameStateManager extends MovieClip{
		
		var gsCurrent:GameState;

		public function GameStateManager() {
			SwitchToTitle();
			Main.socket.Start();
			/*if(gsCurrent is GSTitle){
				(gsCurrent as GSTitle).GiveAddress(Main.socket.address);
			}*/
		}
		
		public function Update(dt:Number):void{			
			// Only update the current game state.
			if(gsCurrent != null){
				gsCurrent.Update();
			}
		}
		
		public function ReceiveLobbyList(rooms:Array, seats:Array):void{
			if(gsCurrent is GSJoin){
				(gsCurrent as GSJoin).ReceiveLobbyList(rooms, seats);
			}
		}

		public function UpdateLobby(seatsFull:uint){
			if(gsCurrent is GSLobby){
				(gsCurrent as GSLobby).UpdateLobby(seatsFull);
			}
		}
		
		public function ReceiveWorldstatePlayer(pID:uint, px:Number, py:Number):void{
			if(gsCurrent is GSPlay){
				(gsCurrent as GSPlay).ReceiveWorldstatePlayer(pID, px, py);
			}
		}

		// winner will be > 0 if game is over
		public function KillPlayer(playerToKill:uint, winner:uint):void{
			if(gsCurrent is GSPlay){
				(gsCurrent as GSPlay).KillPlayer(playerToKill, winner);
			}
		}

		public function UpdateStats(hp:uint, maxhp:uint, energy:uint, maxenergy:uint):void{
			if(gsCurrent is GSPlay){
				(gsCurrent as GSPlay).UpdateStats(hp, maxhp, energy, maxenergy);
			}
		}
		
		// Adds an enemy to the world. Only works in GSPlay. Use static values assigned in Enemy eType.
		public function AddEnemy(eType:uint):void{
			if(gsCurrent is GSPlay){
				(gsCurrent as GSPlay).AddEnemy(eType);
			}
		}

		public function RemoveEnemy(eID:uint):void{
			if(gsCurrent is GSPlay){
				(gsCurrent as GSPlay).RemoveEnemy(eID);
			}
		}
		
		public function ReceiveWorldstateEnemy(pID:uint, playerID:uint, px:Number, py:Number):void{
			if(gsCurrent is GSPlay){
				(gsCurrent as GSPlay).ReceiveWorldstateEnemy(pID, playerID, px, py);
			}
		}

		public function ReceiveWorldstateSpawner(pID:uint, px:Number, py:Number):void{
			if(gsCurrent is GSPlay){
				(gsCurrent as GSPlay).ReceiveWorldstateSpawner(pID, px, py);
			}
		}

		public function AddPickup(pType:uint, pAmount:uint):void{
			if(gsCurrent is GSPlay){
				(gsCurrent as GSPlay).AddPickup(pType, pAmount);
			}
		}

		public function RemovePickup(pID:uint):void{
			if(gsCurrent is GSPlay){
				(gsCurrent as GSPlay).RemovePickup(pID);
			}
		}

		public function ReceiveWorldstatePickups(pID:uint, px:Number, py:Number):void{
			if(gsCurrent is GSPlay){
				(gsCurrent as GSPlay).ReceiveWorldstatePickups(pID, px, py)
			}
		}

	    public function SwitchToTitle():void {
	    	
			if(gsCurrent != null && contains(gsCurrent)) {
        		removeChild(gsCurrent);
			}
			gsCurrent = new GSTitle(this);
			addChild(gsCurrent);
	    }

	    public function SwitchToLobby(roomID:uint, playerID:uint):void {
			removeChild(gsCurrent);
			gsCurrent = new GSLobby(this, roomID, playerID);
			addChild(gsCurrent);
	    }

	    public function SwitchToJoin():void {
			removeChild(gsCurrent);
			gsCurrent = new GSJoin(this);
			addChild(gsCurrent);
	    }

	    public function SwitchToInstructions():void {
			removeChild(gsCurrent);
			//gsCurrent = new GSInstructions(this);
			addChild(gsCurrent);
	    }

	    public function SwitchToPlay():void {
	    	var players:Array;
	    	var roomID:uint;
	    	var playerID:uint;

			if(gsCurrent is GSLobby){
				players = (gsCurrent as GSLobby).players;
				roomID = (gsCurrent as GSLobby).roomID;
				playerID = (gsCurrent as GSLobby).playerID;
			}

			if(gsCurrent != null) removeChild(gsCurrent);
			gsCurrent = new GSPlay(this, players, roomID, playerID);
			addChild(gsCurrent);
	    }

	    public function SwitchToEnd(winner:uint, yourID:uint):void {
			removeChild(gsCurrent);
			gsCurrent = new GSEnd(this, winner, yourID);
			addChild(gsCurrent);
	    }

	    public function SwitchToCredits():void {
			removeChild(gsCurrent);
			gsCurrent = new GSCredits(this);
			addChild(gsCurrent);
	    }
	}
}
