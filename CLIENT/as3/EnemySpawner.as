package as3 {
	
	import flash.display.MovieClip;
	
	// Controls spaces in the world that create enemies when touched.
	public class EnemySpawner extends MovieClip {
		
		var worldX:Number, worldY:Number;
		
		public function EnemySpawner(x:int, y:int) {
			worldX = x;
			worldY = y;
		}
		
		public function Update(cam:Camera):void{
			this.x = worldX + cam.x;
			this.y = worldY + cam.y;
		}
	}
}
