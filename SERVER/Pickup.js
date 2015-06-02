var AABB = require("./AABB.js").AABB;
var PickupType = require("./PickupType.js").PickupType;

exports.Pickup = function(x, y){
	var me = this;
	this.worldX = x;
	this.worldY = y;
	this.aabb;

	this.speedX = global.Random.Range(-20, 20);
	this.speedY = global.Random.Range(-30, 40);
	this.a = 1500;

	this.amount = global.Random.ChooseOne([1, 3, 5]);
	this.type = global.Random.ChooseOne([PickupType.HPUP, PickupType.ATKUP, PickupType.SPDUP, PickupType.ENERGYUP]);

	this.width = 32 * (this.amount/2);
	this.height = 32 * (this.amount/2);

	this.moving = true;
	this.pickupDelay = .3;
	this.canPickup = false;

	this.aabb = new AABB(this.worldX, this.worldY, this.width, this.height);

	this.Update = function(dt){
		this.pickupDelay -= dt;
		if(this.pickupDelay <= 0) this.canPickup = true;
		
		if(this.moving){
			this.speedX *= .8;
			this.speedY *= .8;
			
			if(this.speedX < .5 && this.speedX > -.5 && this.speedY < .5 && this.speedY > -.5){
				this.speedX = 0;
				this.speedY = 0;
				this.moving = false;
			}
		}
		
		/*
		if(aabb.Bottom + speedY * dt > Config.StageHeight){
			this.worldY = Config.StageHeight - aabb.halfH;
			this.speedY = 0;
		}*/ // level update instead
		
		this.worldX += this.speedX;
		this.worldY += this.speedY;
		
		this.aabb.Update(this.worldX, this.worldY);
	};

	this.FixCollisionWithStaticAABB = function(other, omitTop, omitRight, omitBottom, omitLeft){

		if(me.aabb.Right < other.Left) return;
		if(me.aabb.Left > other.Right) return;
		if(me.aabb.Bottom < other.Top) return;
		if(me.aabb.Top > other.Bottom) return;
		
		var overlapB1 = other.Bottom - me.aabb.Top; // distance to move down; OVERLAP B
		var overlapT1 = other.Top - me.aabb.Bottom; // distance to move up; OVERLAP T
		var overlapR1 = other.Right - me.aabb.Left; // distance to move right; OVERLAP R
		var overlapL1 = other.Left - me.aabb.Right; // distance to move left; OVERLAP L

		var overlapB = Math.abs(overlapB1);
		var overlapT = Math.abs(overlapT1);
		var overlapR = Math.abs(overlapR1);
		var overlapL = Math.abs(overlapL1);

		var solutionX = 0;
		var solutionY = 0;

		// find solution
		if (!omitTop && overlapT <= overlapB && overlapT <= overlapR && overlapT <= overlapL) {
			// your bottom side collided
			solutionY = overlapT1;
			me.speedY = 0;
			
		}
		if (!omitRight && overlapR <= overlapT && overlapR <= overlapB && overlapR <= overlapL) {
			// your left side collided
			solutionX = overlapR1;
			me.speedX = 0;
			
		}
		if (!omitBottom && overlapB <= overlapT && overlapB <= overlapR && overlapB <= overlapL) {
			// your top side collided
			solutionY = overlapB1;
			me.speedY = 0;
			
		}
		if (!omitLeft && overlapL <= overlapT && overlapL <= overlapR && overlapL <= overlapB) {
			// your right side collided
			solutionX = overlapL1;
			me.speedX = 0;

		}
		
		me.worldX += solutionX;
		me.worldY += solutionY;
		
		me.aabb.Update(me.worldX, me.worldY);
	};
};