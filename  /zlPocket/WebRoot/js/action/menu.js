define(function(require, exports, module) {
	var $ = require("$");// 引用zepto
	var iScroll = require("iscroll");// 引用滚动
	/**
	 * 初始化
	 * @return {[type]} [description]
	 */
	exports.init = function(){
		var wraper_scroll = new iScroll("wraper",{vScrollbar:true,bounce:false,momentum:true});
		var h_scroll = new iScroll("h_wraper",{
			snap:"li",
			hScrollbar:false,
			bounce:false,
			momentum:false,
			onScrollEnd:function(){
				console.log(this.currPageX);
			}
		});
	}

	exports.ie = function(){
		$("body").on("MSPointerDown",function(){
			alert(1);
		});
	}
})