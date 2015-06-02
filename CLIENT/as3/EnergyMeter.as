package as3 {
	
	import flash.display.MovieClip;
	
	// This class controls the player's energy bar GUI.
	public class EnergyMeter extends MovieClip {
		
		var bar:MovieClip;
		
		public function EnergyMeter() {
			this.x = 20;
			this.y = 55;
			this.bar = barInstance;
		}
		
		public function Update(currentEnergy:int, totalEnergy:int):void{
			var percentage:Number = currentEnergy / totalEnergy;
			bar.width = 300 * percentage;
		}
	}
}
