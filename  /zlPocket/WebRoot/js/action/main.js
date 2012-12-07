define(function(require, exports, module) {
	var $ = require("$");// 引用zepto
	var Cards = require("cards");// 引用镜头
	var iScroll = require("iscroll");// 引用镜头

	var cards;
	var flag=false;
	/**
	 * 初始化方法
	 * 获取页面高宽和状态,初始化card功能
	 */
	exports.init=function(){
		// 获取cards对象
		cards = new Cards("#scroller",".card");
		
		cards.range();
		
		// var position = cards.getIndex(2);
		// cards.moveScene(position,function(i,len){
		// 	$("#console").text(i+" , "+len);
		// });
		
		var sceneX = 0;
		var j = 1;
		$("#viewcard").on("touchstart",function(e){
			
			var translate3d = $("#scroller").css("-webkit-transform");
			var reg = /translate3d\(| |px|,|\)/
			var array = translate3d.split(reg);

			sceneX = Number(array[1]);//array[5] y array[8] z
			pointX = e.touches[0].pageX;
			
			flag = true;
			
			
			$("#scroller").removeClass("ts_tf400ea");
			
		}).on("touchmove",function(e){
			
			if(flag){
				deltaX = e.touches[0].pageX - pointX
				$("#console").text("deltaX"+deltaX);
				if(Math.abs(deltaX)>100){
					var px = deltaX + sceneX;
					$("#scroller").css("-webkit-transform","translate3d("+px+"px, 0px, 0px)");	
				}
			}
		}).on("touchend",function(e){
			flag = false;
			$("#scroller").addClass("ts_tf400ea");
			// var translate3d = $("#scroller").css("-webkit-transform");
			// var reg = /translate3d\(| |px|,|\)/
			// var array = translate3d.split(reg);

			// sceneX = Number(array[1]);//array[5] y array[8] z
			
			// if(deltaX<0){
			// 	if(Math.abs(deltaX) > 240){
			// 		if(j<3){
			// 			j++
			// 		}
			// 	}	
			// }else if(deltaX>0){
			// 	if(Math.abs(deltaX) > 240){
			// 		if(j>0){
			// 			j--
			// 		}
			// 	}
			// }
			// var position = cards.getIndex(j);
			// cards.moveScene(position,function(i,len){});
			

		}).on("MSPointerDown",function(){
			
		})
		var i = cards.index;
		var position;
		$("#viewcard").swipeRight(function(){
			var translate3d = $("#scroller").css("-webkit-transform");
			var reg = /translate3d\(| |px|,|\)/
			var array = translate3d.split(reg);

			sceneX = Number(array[1]);//array[5] y array[8] z

			$("#console").text("首个:"+cards.parts[0].position+"当前:"+sceneX);

			if(Math.abs(sceneX) <= cards.parts[0].position){
				position = cards.getIndex(1);
				cards.moveScene(position);
			}
			else{
				// 向右滑动,页面从左出现
				if(i > 0){
					i--
				}
				// 设置滚动
				position = cards.getIndex(i);
				cards.moveScene(position);
			}
		}).swipeLeft(function(){
			var translate3d = $("#scroller").css("-webkit-transform");
			var reg = /translate3d\(| |px|,|\)/
			var array = translate3d.split(reg);

			sceneX = Number(array[1]);//array[5] y array[8] z

			$("#console").text("末尾:"+cards.parts[cards.parts.length-1].position+"当前:"+sceneX);
			
			if(Math.abs(sceneX) >= cards.parts[cards.parts.length-1].position){
				position = cards.getIndex(cards.parts.length);
				cards.moveScene(position);
			}
			else{
				// 向左滑动,页面从右出现
				if(i < cards.parts.length){
					i++
				}
				// 设置滚动
					position = cards.getIndex(i);
					cards.moveScene(position);
				}
			})

		$("#console").text("进入方法");
	}

	/**
	 * 程序开始
	 * 配置触摸
	 */
	exports.start=function(){
		
		var i = cards.index;
		var position;
		$("#viewcard").on("click",function(e){
			if(i < cards.parts.length){
				i++
			}
			
			$("#console").text("click"+i);
			position = cards.getIndex(i);
			cards.moveScene(position);
			
		}).swipeRight(function(){
			// 向右滑动,页面从左出现
			if(i > 0){
				i--
			}
			// 设置滚动
			position = cards.getIndex(i);
			cards.moveScene(position);
		}).swipeLeft(function(){
			// 向左滑动,页面从右出现
			if(i < cards.parts.length){
				i++
			}
			// 设置滚动
			position = cards.getIndex(i);
			cards.moveScene(position);
		})
	}
	exports.iscroll=function(){
		var myscroll = new iScroll("div",{vScrollbar:true,bounce:false,momentum:true});
	}
})