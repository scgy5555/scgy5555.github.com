/* 触摸 */
define(function(require, exports, module) {
	var touch = {},
		touchTimeout, tapTimeout, swipeTimeout,
		longTapDelay = 750, longTapTimeout,
		hasTouch = 'ontouchstart' in window,
		START_EV = hasTouch ? 'touchstart' : 'mousedown',
		MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
		END_EV = hasTouch ? 'touchend' : 'mouseup',
		CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';

	function parentIfText(node) {
		return 'tagName' in node ? node : node.parentNode
	}

	function swipeDirection(x1, x2, y1, y2) {
		var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
		return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
	}

	function longTap() {
		longTapTimeout = null
		if (touch.last) {
			touch.el.trigger('longTap')
			touch = {}
		}
	}

	function cancelLongTap() {
		if (longTapTimeout) clearTimeout(longTapTimeout)
		longTapTimeout = null
	}

	function cancelAll() {
		if (touchTimeout) clearTimeout(touchTimeout)
		if (tapTimeout) clearTimeout(tapTimeout)
		if (swipeTimeout) clearTimeout(swipeTimeout)
		if (longTapTimeout) clearTimeout(longTapTimeout)
		touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
		touch = {}
	}

	var now, delta

	$(document.body)
		.bind(START_EV, function(ev){
			e = ev.originalEvent,// 获取原生事件对象
			point = e.changedTouches ? e.touches[0] : e,// 兼容性处理
			now = Date.now()
			delta = now - (touch.last || now)
			touch.el = $(parentIfText(e.target))
			touchTimeout && clearTimeout(touchTimeout)
			touch.x1 = e.pageX
			touch.y1 = e.pageY
			if (delta > 0 && delta <= 250) touch.isDoubleTap = true
			touch.last = now
			longTapTimeout = setTimeout(longTap, longTapDelay)


			$(this).bind(MOVE_EV, function(ev){
				
				console.log("进入");
				e = ev.originalEvent,// 获取原生事件对象
				point = e.changedTouches ? e.changedTouches[0] : e,// 兼容性处理
				cancelLongTap()
				touch.x2 = e.pageX
				touch.y2 = e.pageY
				if (Math.abs(touch.x1 - touch.x2) > 10)
					e.preventDefault()
			
			})
			.bind(END_EV, function(ev){

				e = ev.originalEvent,// 获取原生事件对象
				point = e.changedTouches ? e.changedTouches[0] : e,// 兼容性处理
				cancelLongTap()

				// swipe
				if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
					(touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))
						
					swipeTimeout = setTimeout(function() {
						touch.el.trigger('swipe')
						touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
						touch = {}
					}, 0)

				// normal tap
				else if ('last' in touch)
					// delay by one tick so we can cancel the 'tap' event if 'scroll' fires
					// ('tap' fires before 'scroll')
					tapTimeout = setTimeout(function() {

						// trigger universal 'tap' with the option to cancelTouch()
						// (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
						var event = $.Event('tap')
						event.cancelTouch = cancelAll
						touch.el.trigger(event)

						// trigger double tap immediately
						if (touch.isDoubleTap) {
							touch.el.trigger('doubleTap')
							touch = {}
						}

						// trigger single tap after 250ms of inactivity
						else {
							touchTimeout = setTimeout(function(){
								touchTimeout = null
								touch.el.trigger('singleTap')
								touch = {}
							}, 250)
						}
					}, 0)

				$(this).off(MOVE_EV).off(END_EV);
			})
		})
		.bind(CANCEL_EV, cancelAll)

	$(window).bind('scroll', cancelAll);
	
	['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
		$.fn[m] = function(callback){
			return this.bind(m, callback)
		}
	})
})