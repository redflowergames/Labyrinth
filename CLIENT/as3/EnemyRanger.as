package as3 {
	
	import flash.display.MovieClip;
	
	// This class controls ranger-type enemies.
	public class EnemyRanger extends Enemy {
		
		public function EnemyRanger(x:Number, y:Number) {			
			super();
		}
		
		public override function Update(cam:Camera, player:Player):void{
			// face player
			var playerToTheRight:Boolean = player.worldX > this.worldX;
			if(playerToTheRight) scaleX = -1;
			else scaleX = 1;
						
			super.Update(cam, player);			
		}
	}
}
