/* 动画库 */
define(function(require, exports, module) {
	var $, Animation;

	$ = require('$');

	Animation = {
		/**
		 * 执行动画
		 * @param  {element} to      目标元素
		 * @param  {boolean} reverse 动画执行方式
		 */
		show:function(to, reverse, callback) {
			var activePage, url, pageWidth, transitionEvent;

			transitionEvent = 'webkitTransitionEnd transitionend';

			activePage = $('.active');// 获取当前活动的页面
			pageWidth = activePage.width();// 计算页面宽度

			/*如果活动页面正在执行*/
			if (activePage.data('transited')){ return; }

			/*添加执行状态*/
			activePage.data('transited', true);
			to.data('transited', true);


			/*填充返回连接*/
			$('[data-rel=back]', to).attr('data-url', activePage.data('href'));


			/*当前页面，监听动画执行结束事件*/
			activePage.one(transitionEvent, function(){
				$(this).removeClass('active')// 删除活动状态
				.css({'transition':'0s','backface-visibility':null})// 停止动画
				.removeData('transited')// 删除状态标记
				.hide();// 隐藏
			});
			/*目标页面，监听动画执行结束事件*/
			to.show().one(transitionEvent, function(){
				$(this).addClass('active')// 添加活动状态
				.css({'transition':'0s','backface-visibility':null})// 停止动画
				.removeData('transited');// 删除状态标记
				callback && callback($(this), reverse);// 执行回调
			});

			/*动画第一步，初始化位置*/
			activePage.css('transform', 'translateX(0px)');
			to.css('transform', (reverse ? 'translateX(-' + pageWidth + 'px)' : 'translateX(' + pageWidth + 'px)'));

			/*动画第二步，移动位置*/
			setTimeout(function () {
				activePage.css({'transition':'0.35s','backface-visibility':'hidden'});
				to.css({'transition':'0.35s','backface-visibility':'hidden'});

				activePage.css('transform', (reverse ? 'translateX(' + pageWidth + 'px)' : 'translateX(-' + pageWidth + 'px)'));
				to.css('transform', 'translateX(0px)');
			}, 50);
		}
	}

	module.exports = Animation;
});