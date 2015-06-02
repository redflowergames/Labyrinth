var AABB = require("./AABB.js").AABB;

exports.PlayerAttack = function(x, y, w, h, baseDMG){
	this.worldX = x;
	this.worldY = y;
	this.playerID;
	this.dmg = baseDMG;
	this.aabb = new AABB(this.worldX, this.worldY, w, h);
	this.aabb.Update(this.worldX, this.worldY);
};