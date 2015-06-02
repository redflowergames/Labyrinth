exports.AABB = function(x, y, width, height){
	var me = this;

	this.x = x;
	this.y = y;
	this.halfW = width/2;
	this.halfH = height/2;
	this.Left;
	this.Right;
	this.Top;
	this.Bottom;
	
	this.Update = function(x, y){
		this.x = x;
		this.y = y;
		this.Left = x - this.halfW;
		this.Right = x + this.halfW;
		this.Top = y - this.halfH;
		this.Bottom = y + this.halfH;
	};
	
	// simple axis aligned bounding box overlap collision
	this.IsCollidingWith = function(other){
		if(this.Right < other.Left) return false;
		if(this.Left > other.Right) return false;
		if(this.Bottom < other.Top) return false;
		if(this.Top > other.Bottom) return false;
		return true;
	};

	this.GetString = function(){
		return "Left: " + this.Left + "\nRight: " + this.Right + "\nTop: " + this.Top + "\nBottom: " + this.Bottom;
	};
};