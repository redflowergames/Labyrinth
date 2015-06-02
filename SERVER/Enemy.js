var EnemyType = require("./EnemyType.js").EnemyType;
var EnemyBullet = require("./EnemyBullet.js");
var AABB = require("./AABB.js").AABB;
var Pickup = require("./Pickup.js").Pickup;

exports.Enemy = function(x, y, w, h, health, enemyType){
	this.enemyType = enemyType;
	this.worldX = x;
	this.worldY = y;
	this.width = w;
	this.height = h;
	this.health = health;
	this.aabb = new AABB(x, y, w, h);

	this.targetPlayer;
	this.targetPlayerID;

	this.grounded = false;

	this.speedX = 0;
	this.speedY = 0;
	this.maxSpeedX = 0;
	this.maxSpeedY = 0;
	this.a = 1500;
	this.damage = 10;
	this.invulnerable = false;
	this.hurtOnContact = false;
	this.bullet = null;

	this.SetTarget = function(player, playerID){
		this.targetPlayer = player;
		this.targetPlayerID = playerID;
	};

	this.Hurt = function(amount){
		this.health -= amount;
		if(this.health <= 0){
			// death! woo!
		}
	};

	this.DropPickups = function(){
		var pickups = [];
		var numToSpawn = global.Random.RangeInt(1, 5);
		for(var i = 0; i < numToSpawn; i++){
			var rx = global.Random.Range(this.aabb.Left, this.aabb.Right);
			var ry = global.Random.Range(this.aabb.Top, this.aabb.Bottom);
			pickups.push(new Pickup(rx, ry));
		}
		return pickups;
	};
};