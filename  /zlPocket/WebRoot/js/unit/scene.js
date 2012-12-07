/**
 * 镜头类，操作显示镜头
 */
define(function(require, exports, module) {
	var $ = require("$");// 引用zepto

	var Scene = function(element){
		this.element = $(element);
		this.index=0;
		this._style={
			title:"-webkit-transform",// 样式名
			value:"",// 样式值
			setValue:function(v){
				// 设置样式值
				this.value="translate3d(-"+ v +"px,0px,0px);"
			}
		}
	}


	Scene.prototype = {
		moveScene:function(position,fn){
			var element = this.element;
			var style = this._style;
			style.setValue(position);
			element.css(style.title,style.value);
			if(fn){
				fn();
			}
		},
		touchMove:function(num,fn){
			var element = this.element;
			element.on("touchstart",function(){
				$(this).removeClass("");
			}).on("touchmove",function(e){
				_style.setValue(e.touches[0].pageX);
				
				element.css(_style.title,_style.value);
			}).on("touchend",function(){
				$(this).addClass("");
			})
		}
	}
	module.exports=Scene
})