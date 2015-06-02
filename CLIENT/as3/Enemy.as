package as3 {
	
	import flash.display.MovieClip;
	import flash.events.*;
	
	// This class defines the basic information all enemies have.
	public class Enemy extends MovieClip {
		
		// ID values reserved for specific enemy types.
		public static var TURRET:int = 1;
		public static var HOPPER:int = 2;
		public static var AERIAL:int = 3;
		public static var RANGER:int = 4;
		public static var BULLET:int = 5;

		// Which player the enemy is paying attention to at the moment.
		var targetPlayer:Player;
		
		// Worldspace coordinates.
		var worldX:Number, worldY:Number;

		public function Enemy() {
			x = -100;
			y = -100;
			worldX = -100;
			worldY = -100;
		}
		
		public function Update(cam:Camera, player:Player):void{
			this.x = worldX + cam.x;
			this.y = worldY + cam.y;
		}
	}
}
