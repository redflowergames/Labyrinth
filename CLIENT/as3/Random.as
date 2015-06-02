package as3 {
	
	// This is a convenience class for two randomization functions.
	public class Random {
		
		// Returns a random number between min and max.
		static function Range(minNum:Number, maxNum:Number):Number {
			return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
		}
		
		// Returns one item from the passed in array.
		static function ChooseOne(array:Array):int{
			return array[Random.Range(0, array.length-1)];	
		}
	}
}
