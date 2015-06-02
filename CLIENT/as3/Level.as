package as3 {
	import flash.display.MovieClip;
	import flash.display.DisplayObject;
	import flash.geom.Point;
	
	// This class keeps track of collision information for the level.
	public class Level extends MovieClip{

		var levelData:LevelData = new LevelData();
		var size:uint = 64; //tile size
		var grid:Array;
		var tiles:Array;
		
		public function Level() {
			grid = new Array(levelData.width);
			tiles = new Array();
			var levelString:String = "";
			
			for (var i:uint = 0; i < levelData.width; i++){
				grid[i] = new Array();
				for (var j:uint = 0; j < levelData.height; j++){
					var pixel:uint = levelData.getPixel(i, j); 
					if(pixel.toString(16) == "0"){
						grid[i].push(1);
						var t:Tile = new Tile(size*i, size*j);
						tiles.push(t);
						addChild(t);
					}else{
						grid[i].push(0);
					}
				} // end j loop
			} // end i loop
			
			// Debug loop that prints out a visual representation of the level's collision data to the console.
			for (var i:uint = 0; i < levelData.width; i++){
					levelString += "\n";
				for (var j:uint = 0; j < levelData.height; j++){
					levelString += (", " + grid[j][i]);
				}
			}
			//trace(levelString);
		} 
		
		public function Update(cam:Camera):void{
			for(var i:int = 0; i < tiles.length; i++){
				tiles[i].Update(cam);
			}
		}

		// Converts gridspace to worldspace.
		public function GridToWorld(n:Number):Number{
				return (n * size) - (size/2);
		}

		// Converts worldspace to gridspace.
		public function WorldToGrid(n:Number):int{
				return (int)((n + size/2) / size);
		}
		
		// Returns whether the indicated grid point is solid.
		public function CheckCollisionAt(px:int, py:int):Boolean {
			if (px < 0) return false; // this allows player to move outside grid area
			if (py < 0) return false;
			if (px >= grid.length) return false;
			if (py >= grid[0].length) return false;

			return (grid[px][py] > 0);
		}

		// gets random noncollision space
		public function GetValidSpawnLocation():Point {
			var p:Point = new Point(0,0);
			while(true){
				var gx:int = int(Random.Range(1,levelData.width-1));
				var gy:int = int(Random.Range(1,levelData.height-1));
				
				if(grid[gx][gy] > 0)
					continue;
				else{
					p = new Point(GridToWorld(gx), GridToWorld(gy));
					break;
				}
			}
			return p;
		}
	}	
}
