/**
 * 巨无霸轮播
 */
$.fn.loopSlider = function (option) {
	var setting = {
		// 默认显示的顺序
		initIndex: 1,
		// 加在title节点上的样式
		className: "current",
		// 轮播方向，默认为x轴方向轮播
		direct: "x",
		// 上一张按钮
		prevBtn: "",
		// 下一张按钮
		nextBtn: "",
		// 上下翻页按钮禁用的样式
		btnDisable: "disable",
		// 按钮按下的样式
		btnTouchClass: "",
		// 自动轮播
		auto: false,
		// 自动轮播时间间隔
		timeFlag: 4000,
		// 轮播效果时间
		scrollTime: 350,
		// 轮播效果
		effect: "scroll",
		// 在只有一个轮播元素的时候是否隐藏滑动按钮
		hideBtn: true,
		// 是否循环轮播
		cycle: true,
		// 轮播的内容区的容器路径
		contentContainer: "#imgScroll",
		// 轮播的内容区的节点
		contentChildTag: "li",
		// 标题轮播区域的容器路径
		titleContainer: "#titleScroll",
		// 标题轮播区域的节点
		titleChildTag: "li",
		// 轮播的内容区的数组
		cont: [],
		// 轮播的标题区的数组
		tabs: [],
		// 当前轮播序号
		current: 0,
		// 定时器
		ptr: "",
		// 轮播回调函数，每次轮播调用，参数为当前轮播的序号
		callback: function () {
			return true;
		}
	}
	if (option) {
		$.extend(setting, option);
	}
	// 初始化当前调用类型的函数
	setting.currentMethod = function () {
		return true;
	}
	var boss = $(this);
	// 如果不是第一个元素先轮播
	if (setting.initIndex != 1) {
		setting.current = setting.initIndex - 1;
	}
	// 获取轮播的节点列表
	var childList = boss.find(setting.contentContainer + " " + setting.contentChildTag);
	// 获取轮播标题节点列表
	var titleList = boss.find(setting.titleContainer + " " + setting.titleChildTag);
	// 保存内容区每一个轮播节点
	setting.cont = childList;
	// 保存标题的轮播节点
	setting.tabs = titleList;
	// 如果没有需要轮播的内容，直接返回
	if(setting.cont.length == 0) {
		return;
	}
	// 给内容区和标题区设置index属性
	childList.each(function (index) {
		$(this).attr("index", index);
		titleList.eq(index).attr("index", index);
	});
	// 上下箭头
	var nextBtn = boss.find(setting.nextBtn);
	var prevBtn = boss.find(setting.prevBtn);
	// 长度
	var counts = childList.length;
	// 轮播容器的父节点
	var childParent = childList.parent();
	var titleParent = titleList.parent();
	if (childList.length < setting.initIndex) {
		setting.current = 0;
	}
	// 初始化
	doInit();
	if (childList.length == 1) {
		return;
	}
	/**
	 * 处理无效果的切换
	 */
	var doScrollNone = {
		process: function (i) {
			childList.eq(i).css("display", "block").siblings().css("display", "none");
			titleList.eq(i).addClass(setting.className).siblings().removeClass(setting.className);
			// 记录当前显示的节点
			setting.current = i;
			// 调用回调函数
			setting.callback(setting.current);
		},
		init: function () {
			setting.currentMethod = doScrollNone;
			bindEvent();
			// 自动轮播
			if (setting.auto) {
				processAuto();
			}
			// 初始化的时候也调用回调函数
			setting.callback(setting.current);
		}
	};
	var doScrollXY = {
		c_width: 0,
		c_height: 0,
		init: function () {
			// 轮播元素的宽度
			this.c_width = childList.width();
			// 轮播元素的高度
			this.c_height = childList.height();
			// x轴方向轮播
			if (setting.direct == "x") {
				childParent.width(this.c_width * (childList.length > 1 ? counts + 1 : counts));
				childParent.css("left", - this.c_width * (setting.current));
			} else {
				childParent.height(this.c_height * (childList.length > 1 ? counts + 1 : counts));
				childParent.css("top", - this.c_height * (setting.current));
			}
			titleList.eq(setting.current).addClass(setting.className).siblings().removeClass(setting.className);
			setting.currentMethod = doScrollXY;
			// 绑定事件
			bindEvent();
			// 初始化的时候也调用回调函数
			setting.callback(setting.current);
			// 自动轮播
			if (setting.auto) {
				processAuto();
			}
		},
		process: function (i, needFast) {
			setting.current = i;
		  //alert(i)
			if (setting.direct == "x") {
				// 执行效果动画
				childParent.animate({
					left: "-" + (this.c_width * i)
				}, (needFast ? 50 : setting.scrollTime), function () {
					if (setting.current == counts) {
						doScrollXY.processMove("left", $(this));
					}
					if (setting.auto) {
						processAuto();
					}
				});
			} else {
				childParent.animate({
					top: "-" + (this.c_height * i)
				}, (needFast ? 50 : setting.scrollTime), function () {
					if (setting.current == counts) {
						doScrollXY.processMove("top", $(this));
					}
					if (setting.auto) {
						processAuto();
					}
				});
			}
			if (i == counts) {
				i = 0;
			}
				// 调用回调函数
		setting.callback(setting.current);
			titleList.eq(i).addClass(setting.className).siblings().removeClass(setting.className);
		},
		processMove: function (direct, node) {
			var childs = node.children();
			for (var i = 1; i < childs.length - 1; i++) {
				var removeNode = childs.eq(i).remove();
				node.append(removeNode);
			}
			var first = childs.eq(0).remove();
			node.append(first);
			node.css(direct, "0");
		}
	};
	switch (setting.effect) {
		case "none":
			doScrollNone.init();
			break;
		case "scroll":
			doScrollXY.init();
			break;
	}

	// 一些初始化操作
	function doInit() {
		  childParent.css("position","relative");
		if (!setting.cycle) {
			prevBtn.removeClass(setting.btnDisable);
			nextBtn.removeClass(setting.btnDisable);
			if (setting.current == 0) {
				prevBtn.addClass(setting.btnDisable);
			}
			if (setting.current == counts - 1) {
				nextBtn.addClass(setting.btnDisable);
			}
		}
		// 只有一个元素，并且需要隐藏按钮
		if (childList.length <= 1 && setting.hideBtn) {
			prevBtn.hide();
			nextBtn.hide();
		}
		// 克隆第一个元素到最后
		if (childList.length > 1) {
			var cloneNode = childList.eq(0).clone();
			cloneNode.attr("index", counts);
			cloneNode.appendTo(childParent);
		}
	}
	/**
	 * 绑定轮播事件
	 */
	function bindEvent() {
		nextBtn && nextBtn.bind("click", function (event) {
			// 如果按钮已经被禁用
			if ($(this).hasClass(setting.btnDisable)) {
				return;
			}
			var cur = setting.current;
			if (cur >= 0) {
				prevBtn.removeClass(setting.btnDisable);
			}
			if (cur == counts - 2 && !setting.cycle) {
				$(this).addClass(setting.btnDisable);
			}
			if (cur == counts) {
				setting.current = 1;
			} else if (cur == counts - 1) {
				// 轮播到最后一个
				setting.current = counts;
			} else {
				setting.current = cur + 1;
			}
			if (setting.ptr) {
				clearInterval(setting.ptr);
				setting.ptr = null;
			}
			$(this).addClass(setting.btnTouchClass);
			setting.currentMethod.process(setting.current);
		});
		prevBtn && prevBtn.bind("click", function () {
			if ($(this).hasClass(setting.btnDisable)) {
				return;
			}
			var cur = setting.current;
			if (cur <= counts - 1) {
				nextBtn.removeClass(setting.btnDisable);
			}
			if (cur == 1 && !setting.cycle) {
				$(this).addClass(setting.btnDisable);
			}
			setting.current = cur == 0 ? counts - 1 : cur - 1;
			if (setting.ptr) {
				clearInterval(setting.ptr);
				setting.ptr = null;
			}
			$(this).addClass(setting.btnTouchClass);
			var fast = false;
			if (cur == 0) {
				fast = true;
			}
			setting.currentMethod.process(setting.current, fast);
		});
		titleParent && titleParent.bind("click", function (e) {
			var element = $(e.target);
			// 得到标题节点
			while (element[0].tagName != titleList[0].tagName) {
				element = element.parent();
			}
			if (setting.ptr) {
				clearInterval(setting.ptr);
				setting.ptr = null;
			}
			var index = parseInt(element.attr("index"), 10);
			if (index != 0) {
				prevBtn.removeClass(setting.btnDisable);
			} else if (!setting.cycle) {
				prevBtn.addClass(setting.btnDisable);
			}
			if (index != counts - 1) {
				nextBtn.removeClass(setting.btnDisable);
			} else if (!setting.cycle) {
				nextBtn.addClass(setting.btnDisable);
			}
			setting.currentMethod.process(index);
		});
	  childParent[0].ontouchstart = handleTouchStart; 
		// 触摸屏幕事件
		function handleTouchStart(event) {
			var element = $(event.target);
			// 得到标题节点
			while (element[0].tagName != childList[0].tagName) {
				element = element.parent();
			}
			if (event.changedTouches.length == 0) {
				return;
			}
			var touch = event.changedTouches[0];
			var startX = touch.clientX;
			var startY = touch.clientY;
			var moveDirect = "";
			var currentPosition = setting.direct == "x" ? childParent.css("left") : childParent.css("top");
			if (setting.ptr) {
				clearInterval(setting.ptr);
				setting.ptr = null; 
			}
			// 手指滑动事件
			childParent[0].ontouchmove = handleTouchMove;
			function handleTouchMove(moveEvent) {            
				var movetouch = moveEvent.changedTouches[0];            
				if (setting.direct == 'x') {
					var moveX = movetouch.clientX;
					var moveY = movetouch.clientY;
					var x = moveX - startX;      
					var y = moveY - startY;
				  // 横坐标和纵坐标的差值超过10个像素，才给滑动
				  if(Math.abs(x) - Math.abs(y) > 10) {
					// 阻止默认的事件    
					 moveEvent.preventDefault();
					 childParent.css("left", parseFloat(currentPosition) + x);
					  moveDirect = x > 0 ? "sub" : "add";
				  } else {
					return;
				  }                                        
				} else {
					// Y轴方向滚动
					moveEvent.preventDefault();
					var moveY = touch.pageY;
					var y = moveY - startY;
					childParent.css("top", parseFloat(currentPosition) + y);
					moveDirect = y > 0 ? "sub" : "add";                
				}
				childParent[0].ontouchend = handleTouchEnd;
			}
			//手指离开屏幕
			function handleTouchEnd() {
				//根据手指移动的方向，判断下一个要显示的节点序号
				var fast = false;
				if (moveDirect == "add") {
					if (setting.current == counts) {
						setting.current = 1;
					} else {
						setting.current = setting.current + 1;
					}
				} else {
					if (setting.current == 0) {
						setting.current = counts - 1;
						fast = true;
					} else {
						setting.current = setting.current - 1;
					}
				}
				// 调用对应的处理函数
				setting.currentMethod.process(setting.current, fast);
				childParent[0].ontouchend = null;
				childParent[0].ontouchmove = null;
			}
		}        
	}

	/**
	 * 自动轮播
	 */
	function processAuto() {
		if (setting.ptr) {
			clearInterval(setting.ptr);
			setting.ptr = null;
		}
		// 设置轮播定时器
		setting.ptr = setInterval(function () {
			if (setting.current == counts) {
				setting.current = 1;
			} else if (setting.current == counts - 1) {
				// 轮播到最后一个
				setting.current = counts;
			} else {
				setting.current = setting.current + 1;
			}
			var index = setting.current;
			if (index != 0) {
				prevBtn.removeClass(setting.btnDisable);
			} else if (!setting.cycle) {
				prevBtn.addClass(setting.btnDisable);
			}
			if (index != counts - 1) {
				nextBtn.removeClass(setting.btnDisable);
			} else if (!setting.cycle) {
				nextBtn.addClass(setting.btnDisable);
			}
			setting.currentMethod.process(setting.current);
		}, setting.timeFlag);
	}
	return function(index) {
		if(index < 0) {
			index = 0;
		} else if(index >= counts) {
			index = counts - 1;
		}
		setting.currentMethod.process(index);  
	}
}