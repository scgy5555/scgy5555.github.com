/**
 * 通用工具类
 */
var utils={};
/**
 * 获取鼠标坐标,绑定move事件
 * @param element canvas对象
 * @return mouse对象包含x和y坐标
 */
utils.captureMousePosition=function(element){
	var mouse={x:0,y:0};
	element.addEventListener("mousemove",function(event){
		var x,y;
		if(event.pageX||event.pageY){
			x=event.pageX;
			y=event.pageY;
		}else{
			x=event.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
			y=event.clientY+document.body.scrollTop+document.documentElement.scrollTop;
		}
		x-=element.offsetLeft;
		y-+element.offsetTop;
		mouse.x=x;
		mouse.y=y;
	},false);
	return mouse;
}

/**
 * 获取随机色值
 * @return color随机色值
 */
utils.getRandomColor=function(){
	var colorNumber = Math.random()*0xffffff|0;
	var color='#'+('00000'+colorNumber.toString(16)).substr(-6);
	return color;
}
/**
 * 检测碰触
 * @param  rect 被检测对象
 * @param  x 检测对象坐标
 * @param  y 检测对象坐标
 */
utils.containsPoint=function(rect,x,y){
	return !(x<rect.x||x>rect.x+rect.width||
			y<rect.y||y>rect.y+rect.height);
}