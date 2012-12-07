define(function(require, exports, module) {
	var $ = require("$");// 引用zepto
	
	var Parts = function(parts){
		this.parts = $(parts);
		this._style={
			title:"-webkit-transform",// 样式名
			value:"",// 样式值
			setValue:function(v){
				// 设置样式值
				this.value="translate3d("+ v +"px,0px,0px);"
			}
		}
		this._positions=[];
		this.page={
			width:$(window).width()
		}
		
	}
	Parts.prototype = {
		getPostion:function(i){
			if(this._positions.length){
				return this._positions[i-1];
			}
		},
		range:function(){
			var parts = this.parts;
			var style = this._style;
			var page = this.page;
			var positions = [];
			$.each(parts,function(i, item){
				// 遍历card
				var part = $(item);
				var index = part.attr("data-index");
				// 设置样式
				style.setValue(index * page.width);
				part.css(style.title,style.value);
				// 保存位置
				positions.push(index * page.width);
			})
			this._positions = positions;
		}
	}
	module.exports = Parts;
})