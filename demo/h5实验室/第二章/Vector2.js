var Vector2 = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

Vector2.prototype = {
	constructor: Vector2,
	set: function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
		return this;
	},

	multiplyScalar: function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	},

	divideScalar: function(s) {
		if(s) {
			this.x /= s;
			this.y /= s;
		} else {
			this.set(0, 0);
		}
		return this;
	},

	distanceToSquared:function(v){
		var dx = this.x - v.x,
			dy = this.y - v.y;
		return dx * dx + dy * dy;
	},

	distanceTo:function(v){
		return Math.sqrt(this.distanceToSquared(v));
	},
	
	subSelf:function(v){
		this.x -= v.x;
		this.y -= v.y;
		return this;
	},

	dot: function (v) {
		return this.x * v.x + this.y * v.y;
	},

	vertical:function(){
		return new Vector2(-this.y,this.x);
	},

	lengthSq: function() {
		return this.x * this.x + this.y * this.y;
	},

	length: function() {
		return Math.sqrt(this.lengthSq());
	},

	normalize: function() {
		return this.divideScalar(this.length());
	},

	reflectionSelf: function(v) {
		var nv = v.normalize();
		this.subSelf(nv.multiplyScalar(2 * this.dot(nv)));
	},

	distanceToLine:function(p1,p2){
		if(p2.x === p1.x){
			return Math.abs(this.y - p1.y);
		}
		else if(p2.y === p1.y){
			return Math.abs(this.x - p1.x);
		}
		else{
			var A =(p2.y - p1.y)/(p2.x - p1.x);
			var B = -1;
			var C = p1.y - A * p1.x;
			return Math.abs(A * this.x + B * this.y + C) / Math.sqrt(A * A + B * B);
		}
	}
}

Vector2.sub=function(v1,v2){
	return new Vector2(v1.x - v2.x, v1.y - v2.y);
}