package as3 {
	
	import flash.display.MovieClip;
	
	// This class controls the tiles that make up the level.
	public class Tile extends MovieClip {
		
		var worldX:Number;
		var worldY:Number;
		//var aabb:AABB;
		
		public function Tile(px:Number, py:Number) {
			worldX = px;
			worldY = py;
			//aabb = new AABB(worldX, worldY, width, height);
		}
		
		public function Update(cam:Camera):void{
			this.x = worldX + cam.x;
			this.y = worldY + cam.y;
			
			//aabb.Update(worldX, worldY);
		}
	}
}
