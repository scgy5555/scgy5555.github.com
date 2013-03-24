/* 特性检测 */
var dummyStyle = document.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
    hasTouch = 'ontouchstart' in window && !isTouchPad,
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	TRNEND_EV = (function () {
		if ( vendor === false ) return false;

		var transitionEnd = {
				''			: 'transitionend',
				'webkit'	: 'webkitTransitionEnd',
				'Moz'		: 'transitionend',
				'O'			: 'otransitionend',
				'ms'		: 'MSTransitionEnd'
			};

		return transitionEnd[vendor];
	})()

function prefixStyle (style) {
	if ( vendor === '' ){ return style; }
	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

var Support = {
	RESIZE_EV:RESIZE_EV,// 屏幕尺寸变化事件
	START_EV :START_EV, // 触摸开始事件
	MOVE_EV  :MOVE_EV,  // 触摸移动事件
	END_EV   :END_EV,   // 触摸结束事件
	CANCEL_EV:CANCEL_EV,// 取消触摸事件
	TRNEND_EV:TRNEND_EV // 动画结束事件
}