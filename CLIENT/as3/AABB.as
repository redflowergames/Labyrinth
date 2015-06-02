package as3 {
	
	// This class represents an axis-aligned bounding box. Used for collision information.
	public class AABB {
		
		public var x:Number, y:Number, halfW:Number, halfH:Number;
		public var Left:Number, Right:Number, Top:Number, Bottom:Number;

		public function AABB(x:Number, y:Number, width:Number, height:Number) {
			this.x = x;
			this.y = y;
			this.halfW = width/2;
			this.halfH = height/2;
		}
		
		public function Update(x:Number, y:Number):void{
			this.x = x;
			this.y = y;
			this.Left = x - halfW;
			this.Right = x + halfW;
			this.Top = y - halfH;
			this.Bottom = y + halfH;
		}
		
		// Compares this bounding box to another to see if there's any overlap.
		public function IsCollidingWith(other:AABB):Boolean{
			if(this.Right < other.Left) return false;
			if(this.Left > other.Right) return false;
			if(this.Bottom < other.Top) return false;
			if(this.Top > other.Bottom) return false;
			return true;
		}
	}
}
