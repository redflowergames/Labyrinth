package as3 {
	
	import flash.display.MovieClip;
	import flash.display.Stage;
	import flash.utils.Timer;
	
	// This class keeps track of a bunch of static variables.
	public class Config {
		
		static var StageWidth:int = 800;
		static var StageHeight:int = 600;
		static var StageLeft:int = 0;
		static var StageTop:int = 0;
		static var StageRight:int = 800;
		
		static var deltaTime:Number;
		static var timeElapsed:Number; //how much time has passed in milliseconds
		static var timeElapsedInSeconds:Number; //how much time has passed in seconds
		static var timer:Timer = new Timer(10);
	}
}
