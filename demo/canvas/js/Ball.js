/**
 * 小球类
 * @param radius 半径
 * @param color  颜色
 */
function Ball(radius,color){
	//定义位置属性
	this.x = 0;
	this.y = 0;
	// 速度
	this.vx = 1;
	this.vy = 1;
	//定义半径及缩放
	this.radius = radius||20;
	this.scaleX = 1;
	this.scaleY = 1;
	//定义填充色及画笔宽度
	this.color = color||'#ffff00';
	this.lineWidth = 1;
}
/**
 * 方法
 */
Ball.prototype = {
	/**
	 * 绘制方法
	 * @param context canvas上下文对象
	 */
	paint:function(context){
		//保存场景
		context.save();
		//坐标系转换，缩放
		context.translate(this.x,this.y);
		context.scale(this.scaleX,this.scaleY);
		//定义填充色及画笔
		context.fillStyle = this.color;
		context.lineWidth = this.lineWidth;
		//绘制球
		context.beginPath();
		context.arc(0,0,this.radius,0,Math.PI*2,true);
		context.closePath();
		//填充
		context.fill();
		if(context.lineWidth>0){
			context.stroke();
		}
		context.restore();
	},
	/**
	 * 获取图形范围
	 * @return {[type]} [description]
	 */
	getBounds:function(){
		return {x:this.x-this.radius,y:this.y-this.radius,
				width:2*this.radius,height:2*this.radius};
	}
}