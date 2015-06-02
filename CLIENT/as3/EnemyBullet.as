package as3 {
	
	import flash.display.MovieClip;
	
	// This class is used to track projectiles.
	public class EnemyBullet extends Enemy {
						
		public function EnemyBullet(degrees:Number) {
			
			super();

			rotation = degrees;

			//if(speedX > 0) rotation = 0 - rotation;
		}
		
		public override function Update(cam:Camera, player:Player):void{		
			super.Update(cam, player);			
		}
	}
}
