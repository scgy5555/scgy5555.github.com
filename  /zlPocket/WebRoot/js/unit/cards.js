define(function(require, exports, module) {
	var $ = require("$");// 引用zepto
	/**
	 * 卡片类
	 * @param scene 滚动区对象
	 * @param parts 片段对象
	 */
	var Cards = function(scene,parts){
		this.scene = $(scene);// 镜头
		this.obj_parts = $(parts);// 片段对象组
		// 页面宽度
		this.page={
			width:$(window).width()
		}

		this.index=0;// 当前片段索引
		// 元素位置
		this._style={
			title:"-webkit-transform",// 样式名
			value:"",// 样式值
			/**
			 * 设置样式值
			 * @param v x坐标
			 */
			setValue:function(v){
				this.value="translate3d("+ v +"px,0px,0px);"
			}
		}
		this.parts=[];// 片段组，存储片段
	}
	Cards.prototype = {
		/**
		 * 移动镜头
		 * @param  {[type]}   i  移动到片段组的索引
		 * @param  {Function} fn 回调函数
		 */
		moveScene:function(i,fn){
			var scene = this.scene;// 镜头
			var style = this._style;// 元素位置样式
			var position;
			for (var j = 0; j < this.parts.length; j++) {
				
				if(this.parts[j].index == i){
					position=this.parts[j].position
					this.index = i;
				}
			}
			
			
			style.setValue(position * -1);// 设置终点位置
			scene.css(style.title,style.value);// 移动

			// 执行回调函数
			if(fn){
				fn(i,this.parts.length);
			}
		},
		/**
		 * 获取片段索引
		 * @param  {[type]} i 当前片段位置
		 * @return {[type]}   片段索引号
		 */
		getIndex:function(i){
			if(this.parts.length){
				return this.parts[i-1].index;
			}
		},
		/**
		 * 片段排序
		 */
		range:function(){
			var parts = this.parts;// 片段组
			var style = this._style;// 元素位置样式
			var page = this.page;// 页面属性
			// 片段对象
			var part={
				index:0,// 索引值
				position:0// 位置坐标
			};
			$.each(this.obj_parts,function(i, item){
				// 遍历card
				var part = $(item);
				// 根据索引设置样式
				var index = part.attr("data-index");
				style.setValue(index * page.width);
				part.css(style.title,style.value);
				// 保存位置
				part.index=index;
				part.position=(index * page.width);
				parts.push(part);
			})
		}
	}

	module.exports = Cards;
})