/* 轮播插件 */
$.fn.Slider = function(option){
	// 默认配置
	var setting = {
		// 自动轮播
		auto:false,
		// 自动轮播间隔时间
		timeFlag:3000,
		// 轮播动画执行时间
		scrollTime:300,
		// 容器元素
		contentContainer:"ul",
		// 内容元素
		contentChildTag:"li",
		// 轮播的内容区的数组
		cont: [],
		// 当前轮播序号
		current: 0,
		// 定时器
		ptr: "",
		// 轮播回调函数，每次轮播调用，参数为当前轮播的序号
		callback: function(){
			return true;
		}
	};

	if (option) {
		$.extend(setting, option);
	}

	// 初始化当前调用的函数
	setting.currentMethod = function(){
		return true;
	}

	// 轮播父元素
	var boss = $(this);
	// 轮播容器元素
	var childParent = boss.find(setting.contentContainer);
	// 轮播内容元素
	var childList = childParent.find(setting.contentChildTag);
	// 总数量
	var counts = childList.length + 2;
	// 首序号
	var firstIndex = -1;
	// 尾序号
	var lastIndex  = counts - 2;

	/*初始化*/
	function doInit(){
		var firstNode = childList.eq(-1).clone();// 克隆首元素
		var lastNode  = childList.eq(0).clone(); // 克隆最后内容

		// 首元素序号
		firstNode.attr("data-index",firstIndex);
		// 克隆首位置移到最先
		firstNode.css('transform','translateX(' + (-1 * childList.width()) + 'px) translateZ(0)')
		// 尾元素序号
		lastNode.attr("data-index",lastIndex);
		lastNode.css('transform','translateX(' + (lastIndex * childList.width()) + 'px) translateZ(0)')
		
		// 添加内容到容器
		childParent.append(lastNode,firstNode)

		// 初始化css
		childParent.css("position","relative")

		// 遍历内容元素添加序号
		childList.each(function(index){
			$(this).css('transform','translateX(' + (index * childList.width()) + 'px) translateZ(0)')
			$(this).attr("data-index",index);
		});
	}
	
	// 初始化
	doInit()

	// 处理平滑滚动的切换
	var doScrollXY = {
		_width:0,
		/* 初始化 */
		init:function(){
			this._width = childList.width();// 轮播元素宽度
			// 设置容器元素位置
			childParent.css('transform','translateX(' + (-1 * this._width * setting.current) + 'px) translateZ(0)')
			// todo:设置按钮高亮
			// titleList.eq(setting.current).addClass(setting.className).siblings().removeClass(setting.className);

			// 设置轮播事件为当前事件
			setting.currentMethod = doScrollXY;
			// 绑定事件
			bindEvent();
			// 调用回调函数
			setting.callback(setting.current);
			// 自动轮播
			if(setting.auto){
				processAuto();
			}
		},
		/* 进程开始 */
		process:function(i,needFast){
			var that = this;
			// 设置当前序号
			setting.current = i;
			childParent.css({
				'transition':(setting.scrollTime / 1000) +'s',
				'transform':'translateX('+( -1 * (this._width * i) )+'px) translateZ(0)'
			})
			.on(Support.TRNEND_EV,function(){
				$(this).css('transition','0');
				// 如果轮播到尾序号
				if(setting.current == lastIndex){
					// 父元素移位
					childParent.css('transform','translateX(0) translateZ(0)')
					setting.current = 0;
				}
				// 如果轮播到最前
				if(setting.current == firstIndex){
					// 父元素移位
					childParent.css('transform','translateX('+( -1 * that._width * (lastIndex - 1) )+'px) translateZ(0)')
					// $(this).css("left",-1 * that._width * (lastIndex - 1));
					setting.current = lastIndex - 1;
				}
				// 自动轮播
				if(setting.auto){
					processAuto();
				}
			})
			// 动画开始
			// childParent.animate(
			// 	// 变化属性
			// 	{left:-1 * (this._width * i)},
			// 	// 执行时间
			// 	setting.scrollTime,
			// 	// 回调函数
			// 	function(){
			// 		// 如果轮播到尾序号
			// 		if(setting.current == lastIndex){
			// 			// 父元素移位
			// 			childParent.css('transform','translateX(0) translateZ(0)')
			// 			setting.current = 0;
			// 		}
			// 		// 如果轮播到最前
			// 		if(setting.current == firstIndex){
			// 			// 父元素移位
			// 			childParent.css('transform','translateX('+( -1 * that._width * (lastIndex - 1) )+'px) translateZ(0)')
			// 			// $(this).css("left",-1 * that._width * (lastIndex - 1));
			// 			setting.current = lastIndex - 1;
			// 		}
			// 		// 自动轮播
			// 		if(setting.auto){
			// 			processAuto();
			// 		}
			// 	}
			// );
			
			// 调用回调函数
			setting.callback(setting.current);

			// todo:设置序号高亮
			// // 如果轮播到最后
			// if(i == counts){
			// 	i = 0;// 从序号0个开始
			// }
			// titleList.eq(i).addClass(setting.className).siblings().removeClass(setting.className);
		}
	};
	
	doScrollXY.init();

	/*自动轮播*/
	function processAuto(){
		// 清空计时器
		if(setting.ptr){
			clearInterval(setting.ptr);
			setting.ptr = null;
		}
		// 设置轮播定时器
		setting.ptr = setInterval(function(){
			// 如果滚动到最后
			if(setting.current == lastIndex){
				setting.current = 1; //从序号1开始
			}
			
			// 普通轮播
			else{
				setting.current += 1;// 自增
			}

			var index = setting.current;
			// 执行动画函数
			setting.currentMethod.process(setting.current);
		},setting.timeFlag);
	}
	/*获取位置*/
	function getTranslate(matrix){
		var m = matrix.substr(7, matrix.length - 8).split(', ')
		return Number(m[4]);
	}

	/*绑定轮播事件*/
	function bindEvent(){
		childParent.on(Support.START_EV,handleTouchStart);
		// 触摸屏幕事件
		function handleTouchStart(ev) {
			var event = ev.originalEvent || ev
			var element = $(event.target);
			// 得到标题节点
			while (element[0].tagName != childList[0].tagName) {
				element = element.parent();
			}
			
			var touch = event.changedTouches?event.changedTouches[0]:event;
			var startX = touch.clientX;
			var startY = touch.clientY;
			var moveDirect = "";
			var currentPosition = getTranslate(childParent.css("transform"));
			event.preventDefault();
			if (setting.ptr) {
				clearInterval(setting.ptr);
				setting.ptr = null; 
			}
			// 手指滑动事件
			childParent.on(Support.MOVE_EV,handleTouchMove);
			function handleTouchMove(ev) {
				var moveEvent = ev.originalEvent || ev
				var movetouch = moveEvent.changedTouches?moveEvent.changedTouches[0]:moveEvent;
				
				var moveX = movetouch.clientX;
				var moveY = movetouch.clientY;
				var x = moveX - startX;
				var y = moveY - startY;

				// 横坐标和纵坐标的差值超过10个像素，才给滑动
				if(Math.abs(x) - Math.abs(y) > 10) {
					// 阻止默认的事件    
					moveEvent.preventDefault();
					childParent.css('transform','translateX('+( currentPosition + x )+'px) translateZ(0)')
					
					moveDirect = x > 0 ? "sub" : "add";
				}
				else {
					return;
				}

				childParent.off(Support.END_EV).on(Support.END_EV,handleTouchEnd);
			}
			//手指离开屏幕
			function handleTouchEnd() {
				//根据手指移动的方向，判断下一个要显示的节点序号
				var fast = false;
				// 如果往右
				if (moveDirect == "add") {
					// 如果滚动到最后
					if (setting.current == lastIndex) {
						setting.current = 1;// 从序号1开始
					} else {
						setting.current += 1;
					}
				} 
				// 向左滚动
				else {
					if (setting.current == firstIndex){
						setting.current = lastIndex - 1
					} else {
						setting.current -= 1;
					}
				}
				// 执行动画函数
				setting.currentMethod.process(setting.current);
				childParent.off(Support.MOVE_EV)
			}
		}
	}


	return {
		stop:function(index){
			if(index < 0){
				index = 0;
			}
			else if(index >= lastIndex){
				index = lastIndex - 1;
			}
			// 关闭自动轮播
			setting.auto = false;
			// 停止计时器
			if(setting.ptr){
				clearInterval(setting.ptr);
				setting.ptr = null;
			}
			// 执行动画函数
			setting.currentMethod.process(index);
		},
		start:processAuto
	}
}