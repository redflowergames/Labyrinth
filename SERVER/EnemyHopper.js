var EnemyType = require("./EnemyType.js").EnemyType;
var Enemy = require("./Enemy.js").Enemy;
var AABB = require("./AABB.js").AABB;

function EnemyHopper(x, y){
	Enemy.call(this, x, y, 33, 33, 30, EnemyType.HOPPER);

	this.maxSpeedX = 350;
	this.maxSpeedY = 450;
	this.hurtOnContact = true;

	this.jumpTimer = 0;
	this.jumpTimerMin = .2;
	this.jumpTimerMax = 2;
	
	this.moveRight = false;
	this.moveLeft = false;

	this.Jump = function(){
		this.grounded = false;
		this.speedY = -this.maxSpeedY;
		this.jumpTimer = global.Random.Range(this.jumpTimerMin, this.jumpTimerMax);
	};

	this.Land = function(){
		this.grounded = true;
		this.speedX = 0;
		this.speedY = 0;
	};

	this.Update = function(dt){
		if(!this.grounded){
			this.speedY += this.a * dt;
			
			if(this.moveRight){
				this.speedX += this.a * dt;
			}
			else if(this.moveLeft){
				this.speedX -= this.a * dt;
			}else{
				this.speedX *= .85;
			}
			
			if(this.targetPlayer.worldX > this.worldX) this.moveLeft = false;
			if(this.targetPlayer.worldX < this.worldX) this.moveRight = false;
			
			if(this.speedX > this.maxSpeedX) this.speedX = this.maxSpeedX;
			if(this.speedX < -this.maxSpeedX) this.speedX = -this.maxSpeedX;
		}else{
			//console.log("Jumptimer: " + this.jumpTimer);
			if(this.targetPlayer.worldX > this.worldX){
				this.moveRight = true;
				this.moveLeft = false;
			}
			if(this.targetPlayer.worldX < this.worldX){
				this.moveRight = false;
				this.moveLeft = true;
			}

			this.jumpTimer -= dt;
			if(this.jumpTimer <= 0){
				this.Jump();
			}
		}
		
		/*// will be done in level
		if(worldY + speedY * dt > global.Config.StageHeight - this.aabb.halfH*2){
			worldY = Config.StageHeight - aabb.halfH*2;
			speedX = 0;
			speedY = 0;
			grounded = true;
			jumpTimer = Random.Range(jumpTimerMin, jumpTimerMax);
		}*/

		
		this.worldX += this.speedX * dt;
		this.worldY += this.speedY * dt;

		this.aabb.Update(this.worldX, this.worldY);
	};

	this.FixCollisionWithStaticAABB = function(other, omitTop, omitRight, omitBottom, omitLeft){

		if(this.aabb.Right < other.Left) return;
		if(this.aabb.Left > other.Right) return;
		if(this.aabb.Bottom < other.Top) return;
		if(this.aabb.Top > other.Bottom) return;
		
		var overlapB1 = other.Bottom - this.aabb.Top; // distance to move down; OVERLAP B
		var overlapT1 = other.Top - this.aabb.Bottom; // distance to move up; OVERLAP T
		var overlapR1 = other.Right - this.aabb.Left; // distance to move right; OVERLAP R
		var overlapL1 = other.Left - this.aabb.Right; // distance to move left; OVERLAP L

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
			this.Land();
			
		}
		if (!omitRight && overlapR <= overlapT && overlapR <= overlapB && overlapR <= overlapL) {
			// your left side collided
			solutionX = overlapR1;
			this.speedX = 0;
			
		}
		if (!omitBottom && overlapB <= overlapT && overlapB <= overlapR && overlapB <= overlapL) {
			// your top side collided
			solutionY = overlapB1;
			this.speedY = 0;
			
		}
		if (!omitLeft && overlapL <= overlapT && overlapL <= overlapR && overlapL <= overlapB) {
			// your right side collided
			solutionX = overlapL1;
			this.speedX = 0;

		}
		
		this.worldX += solutionX;
		this.worldY += solutionY;
		
		this.aabb.Update(this.worldX, this.worldY);
	};
};

EnemyHopper.prototype = new Enemy();

module.exports = EnemyHopper;







/* put this in the game file

var EnemyHopper = require("./EnemyHopper.js");

var hopper = new EnemyHopper(10, 10, 30, 40, 100);

hopper.Update();

*/