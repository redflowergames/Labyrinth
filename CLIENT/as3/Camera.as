package as3 {
	
	// This class follows a specific target to keep it in the center of the screen.
	public class Camera {

		var x:Number, y:Number;
		var halfW:int, halfH:int;

		public function Camera() {
			halfW = Config.StageWidth/2;
			halfH = Config.StageHeight/2;
		}
		
		public function Update(targetX:Number, targetY:Number){
			x = -targetX + halfW;
			y = -targetY + halfH;
		}
	}
}
