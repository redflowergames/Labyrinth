package as3 {
	
	import flash.display.MovieClip;
	
	
	public class EnemyAerial extends Enemy {
				
		public function EnemyAerial() {
			super();
		}
		
		public override function Update(cam:Camera, player:Player):void{
			super.Update(cam, player);			
		}
	}	
}
