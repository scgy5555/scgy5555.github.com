/**
 * 箭头类
 */
function Arrow(){
	//定义位置属性
	this.x = 0;
	this.y = 0;
	//定义旋转角度及缩放
	this.rotation = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	//定义填充色及画笔宽度
	this.color = '#00ff00';
	this.lineWidth = 1;
}
/**
 * 方法
 */
Arrow.prototype = {
	/**
	 * 绘制方法
	 * @param context canvas上下文对象
	 */
	paint:function(context){
		//保存场景
		context.save();
		//坐标系转换，缩放及旋转
		context.translate(this.x,this.y);
		context.scale(this.scaleX,this.scaleY);
		context.rotate(this.rotation);
		//定义填充色及画笔
		context.fillStyle = this.color;
		context.lineWidth = 1;
		//绘制箭头
		context.beginPath();
		context.moveTo(-50,-25);
		context.lineTo(0,-25);
		context.lineTo(0,-50);
		context.lineTo(50,0);
		context.lineTo(0,50);
		context.lineTo(0,25);
		context.lineTo(-50,25);
		context.closePath();
		//填充
		context.fill();
		if(context.lineWidth>0){
			context.stroke();
		}
		context.restore();
	}
}