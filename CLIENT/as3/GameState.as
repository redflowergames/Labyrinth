package as3{
	import flash.display.MovieClip;
	
	// This class is used a superclass for all game states. Doesn't do much on its own.
	public class GameState extends MovieClip{
		
		public var gsm:GameStateManager;
		
		public function GameState(gsm:GameStateManager){
			this.gsm = gsm;
		}
			
		public function Update():void{
			
		}
	}
}
