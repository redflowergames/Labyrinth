package as3 {
	
	import flash.events.*;
	
	public class GSEnd extends GameState {
		
		public function GSEnd(gsm:GameStateManager, winner:uint, yourID:uint) {
			super(gsm);
			
			if(winner == yourID+1)
				winnerText.text = "You win!";
			else
				winnerText.text = "Player " + winner + " wins!";
				
			bttnBack.addEventListener(MouseEvent.CLICK, BackFunction);
		}
		
		public override function Update():void{
			
		}
		
		public function BackFunction(e:MouseEvent):void{
			gsm.SwitchToTitle();
		}
	}
}
