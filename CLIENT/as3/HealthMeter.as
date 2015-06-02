package as3 {
	
	import flash.display.MovieClip;
	
	// This class controls the player's health bar GUI.
	public class HealthMeter extends MovieClip {
		
		var bar:MovieClip;
		
		public function HealthMeter() {
			this.x = 20;
			this.y = 20;
			this.bar = barInstance;
		}
		
		public function Update(currentHealth:int, totalHealth:int):void{
			var percentage:Number = currentHealth / totalHealth;
			bar.width = 300 * percentage;
		}
	}
}
