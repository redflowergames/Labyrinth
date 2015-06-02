package as3 {
	
	import flash.display.MovieClip;
	
	// This class controls hopper-type enemies.
	public class EnemyHopper extends Enemy {
				
		public function EnemyHopper() {
			super();
		}
		
		public override function Update(cam:Camera, player:Player):void{
			var playerToTheRight:Boolean = player.worldX > this.worldX;
			if(playerToTheRight) scaleX = -1;
			else scaleX = 1;
			
			super.Update(cam, player);			
		}
	}
}
