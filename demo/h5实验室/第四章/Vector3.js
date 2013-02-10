var Vector3 = function (x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector3.prototype ={
	sub:function(v1,v2){
		this.x = v1.x-v2.x;
		this.y = v1.y-v2.y;
		this.z = v1.z-v2.z;

		return this;
	},

	rotateXSelf:function(p,theta){
		var v = new Vector3();
		v.sub(this,p);
		theta *= Math.PI / 180;
		var R = [[Math.cos(theta),-Math.sin(theta)],[Math.sin(theta),Math.cos(theta)]];

		this.y = p.y + R[0][0] * v.y + R[0][1] * v.z;
		this.z = p.z + R[1][0] * v.y + R[1][1] * v.z;
	},
	rotateYSelf:function(p,theta){
		var v = new Vector3();
		v.sub(this,p);
		theta *= Math.PI / 180;
		var R = [[Math.cos(theta),-Math.sin(theta)],[Math.sin(theta),Math.cos(theta)]];

		this.x = p.x + R[0][0] * v.x + R[0][1] * v.z;
		this.z = p.z + R[1][0] * v.x + R[1][1] * v.z;
	},
	rotateZSelf:function(p,theta){
		var v = new Vector3();
		v.sub(this,p);
		theta *= Math.PI / 180;
		var R = [[Math.cos(theta),-Math.sin(theta)],[Math.sin(theta),Math.cos(theta)]];

		this.x = p.x + R[0][0] * v.x + R[0][1] * v.y;
		this.y = p.y + R[1][0] * v.x + R[1][1] * v.y;
	}
	
}