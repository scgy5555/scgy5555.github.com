	var Matrix4 = function (n11,n12,n13,n14,n21,n22,n23,n24,n31,n32,n33,n34,n41,n42,n43,n44) {
		this.set(
			n11||1, n12||0, n13||0, n14||0,
			n21||0, n22||1, n23||0, n24||0,
			n31||0, n32||0, n33||1, n34||0,
			n41||0, n42||0, n43||0, n44||1
		)
	}
	Matrix4.prototype = {
		set:function(n11,n12,n13,n14,n21,n22,n23,n24,n31,n32,n33,n34,n41,n42,n43,n44){
			this.n11 = n11;this.n12 = n12;this.n13 = n13;this.n14 = n14;
			this.n21 = n21;this.n22 = n22;this.n23 = n23;this.n24 = n24;
			this.n31 = n31;this.n32 = n32;this.n33 = n33;this.n34 = n34;
			this.n41 = n41;this.n42 = n42;this.n43 = n43;this.n44 = n44;

			return this;
		},

		multiplyVector4:function(v){
			var vx = v.x, vy=v.y, vz=v.z, vw=v.w;
			v.x = this.n11*vx + this.n21*vy + this.n31*vz + this.n41*vw;
			v.y = this.n12*vx + this.n22*vy + this.n32*vz + this.n42*vw;
			v.z = this.n13*vx + this.n23*vy + this.n33*vz + this.n43*vw;
			v.w = this.n14*vx + this.n24*vy + this.n34*vz + this.n44*vw;

			return v;
		}
	}