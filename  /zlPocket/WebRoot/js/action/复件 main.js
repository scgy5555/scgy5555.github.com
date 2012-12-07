define(function(require, exports, module) {
	var $ = require("$");// 引用zepto
	// 页面属性初始化
	var page={
		width:0,
		heigth:0
	}
	// 运动渐变样式
	var style={
		title:"-webkit-transform",// 样式名
		value:"",// 样式值
		setValue:function(v){
			// 设置样式值
			this.value="translate3d("+ v +"px,0px,0px);"
		}
	}

	var _cards=[];
	/**
	 * 初始化方法
	 * 获取页面高宽和状态,初始化card功能
	 */
	exports.init=function(){
		// 获取页面宽高属性
		page.heigth=$(window).height();
		page.width=$(window).width();
		// 获取card对象
		var cards = $(".card");
		$.each(cards,function(i, item){
			// 遍历card
			var card = $(item);
			var index = card.attr("data-index");
			// 设置样式
			style.setValue(index * page.width);
			card.css(style.title,style.value);
			// 保存对象
			var _card = {
				position:index * page.width
			}
			_cards.push(_card);
		})
	}
	/**
	 * 程序开始
	 * 配置触摸
	 */
	exports.start=function(){
		// $("#console").text(_cards.length);
		var i = 0;
		$("#viewcard").on("click",function(e){
			if(i < _cards.length-1){
				i++
			}
			
			$("#console").text("click"+i);
			style.setValue(_cards[i].position*-1);
			$("#scroller").css(style.title,style.value);
			
		}).swipeRight(function(){
			// 向右滑动,页面从左出现
			if(i > 0){
				i--
			}
			// 设置滚动
			style.setValue(_cards[i].position*-1);
			$("#scroller").css(style.title,style.value);
		}).swipeLeft(function(){
			// 向左滑动,页面从右出现
			if(i < _cards.length-1){
				i++
			}
			// 设置滚动
			style.setValue(_cards[i].position*-1);
			$("#scroller").css(style.title,style.value);
		})
	}
})