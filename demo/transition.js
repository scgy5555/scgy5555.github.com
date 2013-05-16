define(function(require, exports, module) {
	var jquery, Routing;
	
	jquery  = require('$');// jquery
	Routing = require('routing');// 路由

	(function($){
	var inited, settings, pageUrls, lastLoadedUrl, ignoreHash, action, history, methods;

	inited        = false;               // 初始化标记
	action        = null;                // 行动对象
	settings      = null;                // 默认值对象
	pageUrls      = {};                  // page记录伪数组
	ignoreHash    = {};                  // hash忽略伪数组
	history       = [];                  // 历史记录数组
	lastLoadedUrl = window.location.href;// 最后加载地址

	methods = {
		/**
		 * 设置默认值
		 * @param  {object}  options                       设置对象
		 * @param  {string}  options.defaultPageTransition 默认效果
		 * @param  {boolean} options.domCache              缓存dom
		 */
		options : function(options) {

			// todo:如果有local则存放
			settings = $.extend({
				defaultPageTransition : 'slide',// 默认效果
				domCache : true                 // 缓存dom
			}, options);
		},

		/**
		 * 页面初始化
		 * @param  {[type]} targetPage 目标页面
		 * @param  {[type]} title      页面标题
		 * @return {[type]} active     当前激活页面
		 */
		init : function(targetPage, title) {
			// 首次加载绑定事件
			if (!inited) {
				inited = true;// 初始化标记

				// 设置默认值
				$(document.body).transition('options', {});

				// 监听页面切换
				$(window).on('hashchange', function(e) {
					var target, hash, path, to, transition, back, direction;

					// 跳转元素对象，默认是超链
					target = (action && action.element) || $(document.body);

					// 如果当前不是忽略列表中的值
					if (!ignoreHash[window.location.hash]) {
						hash       = window.location.hash.slice(1)       // 当前hash访问地址
						route      = "#" + Routing.analysis(hash);       // 当前hash真实地址
						href       = window.location.href                // 当前地址
						path       = '#' + Routing.parseURL(href).path;  // 当前路径
						to         = window.location.hash ? route : path;// 目标页面路径
						transition = null;                               // 切换效果
						back       = action == null;                     // 操作是否为后退
						
						// 后退操作
						if (back) {
							// 操作行为
							action     = history.length ? history.pop() : null;
							// 切换效果
							transition = action ? action.transition : settings.defaultPageTransition;
							// 动画翻转
							back       = action ? !action.reverse : true;
							
						}
						// 前进操作，有切换效果
						else if (action.transition) {
							transition = action.transition;        // 切换效果
							back       = action.reverse;           // 动画翻转
							history.push({transition: transition});// 记录操作行为
						}
						// 前进操作，无切换效果
						else {
							// 切换效果
							transition = action.element.attr('transition') || action.element.data('transition') || settings.defaultPageTransition;
							// 动画方向
							direction  = action.element.attr('direction') || action.element.data('direction');
							// 动画翻转
							if (direction === 'reverse'){
								back = true;
							}
							history.push({transition: transition, reverse: back});// 记录操作行为
						}
						// 执行切换
						target.transition('changePage', to, transition, back);
					}

					action = null;// 清空操作行为
				});
			}
			/*创建外层,初始化样式,设置激活页面*/
			var initial, active, hash, route, href, path, to, pageId;

			hash             = window.location.hash.slice(1)       // 当前hash访问地址
			route            = Routing.analysis(hash);             // 当前hash真实地址
			href             = window.location.href                // 当前地址
			path             = Routing.parseURL(href).path;        // 当前路径
			to               = window.location.hash ? route : path;// 目标页面路径
			pageId           = toId(to);                           // 页面ID
			initial          = $("#"+pageId);                      // 初始化页面
			pageUrls[pageId] = lastLoadedUrl;                      // 记录最后访问地址

			// 创建外层
			if (!initial.length) {
				// 如果this是load获取的div
				if (this.is('div')) {
					this.attr('data-role', 'page');
					this.attr('id', pageId);
					initial = this;
				}
				// 如果this是window
				else {
					initial = $('<div data-role="page" id="' + pageId + '"/>');
					this.children().wrapAll(initial);
				}
			}

			// 设置标题
			title = title || document.title;
			document.title = title;
			initial.data('title', title);

			// 设置样式
			initial.addClass('ui-page');
			
			// todo:控制点击，取消修改连接
			$('a[href]').not('[rel="nav"]').not('[data-rel="back"]').transition('hijackLinks');
			$('[data-rel="back"]').transition('hijackLinks');

			// 设定激活页面,targetPage为hash值，省略id选择器#
			active = targetPage ? $(targetPage) : initial;
			active.addClass('ui-page-active');

			// 触发init事件
			$(document).trigger('pageinit:' + active.attr('id'), active);

			return active;
		},

		to : function(page, transition, reverse) {

			transition = transition || settings.defaultPageTransition;
			
			if (!reverse){
				reverse = false;
			}
			
			action = {transition: transition, reverse: reverse};

			if(page.charAt(0) !== '#'){
				page = '#' + page;
			}

			window.location.hash = page;
		},

		changePage : function(to, transition, back) {
			
			var targetPage, from, handled, toPage, eventData, el;
			
			targetPage = null;                   // 目标id
			handled    = false;                  // 请求标记，未完成请求
			from       = $('div.ui-page-active');// 当前页面
			toPage     = null;                   // 目标页面

			if (to.charAt(0) === '#') {
				toPage = $(toId(to));// 因为值是hash，id选择器省略#
				// 如果找到
				if (toPage.length) {
					$.fn.transition('perform', from, toPage, transition, back);
					handled = true;// 请求标记, 已完成请求
				}
				// 没找到，没设置缓存，已记录
				else if (!settings.domCache && pageUrls[toId(to.slice(1))]) {
					targetPage = toId(to);// 目标id，hash值
					to = pageUrls[toId(to.slice(1))];// 请求地址
				}
				// 没找到
				else{
					to = to.slice(1);// 请求地址
				}
			}

			// 如果需要请求
			if (!handled) {
				eventData = {href: to, element: $(this), back: back};
				$.fn.transition('load', to, eventData, function(body, result, title) {
					var div, to;

					/*把请求内容添加到当前文档*/
					div = $('<div data-role="page-container"/>').html(body);
					$(document.body).append(div).trigger('pageload', eventData);
					to = div.hide().transition('init', targetPage, title);

					// 执行切换动画
					$.fn.transition('perform', from, to, transition, back);
				});

				handled = true;// 请求标记, 已完成请求
			}

			if (!handled){
				$(document).trigger('pagechangefailed');
			}
		},

		load : function(what, eventData, onSuccess) {
			
			// 设置ajax请求参数对象
			what = {url: what, dataType: 'html', global: false};
			what.url = what.url || window.location.href;
			what.success = function(result, textStatus, xhr) {
				var bodyStart,head,body,title,match

				eventData.xhr        = xhr;
				eventData.textStatus = textStatus;
				lastLoadedUrl        = what.url;

				// 如果没使用缓存
				if (!settings.domCache){
					// 添加回收标记
					$('div[data-role="page"]').addClass('transition-recyclable');
				}
				
				/*获取正文和标题*/
				bodyStart = result.search(/<body/i);
				head      = result;
				body      = result;

				if (bodyStart != -1) {
					head = result.slice(0, bodyStart);
					bodyStart = result.indexOf('>', bodyStart);
					bodyEnd = result.search(/<\/body>/i);
					body = result.slice(bodyStart + 1, bodyEnd);
				}
				
				match = head.match(/<title>(.+)<\/title>/im);
				
				if (match){
					title = match[1];
				}
				// todo:相对路径
				onSuccess(body, result, title);
			};
			what.error = function(xhr, textStatus, errorThrown) {
				eventData.xhr = xhr;
				eventData.textStatus = textStatus;
				eventData.errorThrown = errorThrown;
				$(document).trigger('pageloadfailed', eventData);
				$(document).trigger('pagechangefailed', {toPage: what.url});
			};

			$.ajax(what);
		},


		hijackLinks : function() {

			return this.each(function() {
				var el,href;

				el = $(this);
				href = el.attr('href') || "#";

				if (el.data('rel') == 'back') {
					el.off('click.t').on('click.t', function(e) {
						e.preventDefault();
						window.history.back();
					});
					return;
				}
		
				if (href.charAt(0) !== '#') {
					// change all links to be hash links
					href = '#' + href;
					if (el.is('a')){
						el.attr('href', href);
					}
				}

				el.off('click.t').on('click.t', function(){
					// todo:设置监听点击，处理跳转
					action = {element: el};
				});
				
			});
		},

		perform : function(from, to, transition, back) {
			from.trigger('pagebeforehide', from);
			to.trigger('pagebeforeshow', to);

			from.show().siblings().hide();
			
			// 开始执行动画
			window.setTimeout(function() {
				from.addClass(transition + ' out');
				from.removeClass('ui-page-active');

				// todo:初始化位置
				to.addClass(transition + ' in');
				to.addClass('ui-page-active');
				to.show();

				if (back) {
					from.addClass('reverse');
					to.addClass('reverse');
				}
			}, 1);

			// 动画执行结束
			window.setTimeout(function() {
				from.removeClass(transition + ' out');
				from.removeClass('reverse');

				to.removeClass(transition + ' in');
				to.removeClass('reverse');

				document.title = to.data('title');
				
				to.show().siblings().hide();
				to.trigger('pageshow', to)

				// 回收不缓存的div
				if (!settings.domCache) {
					$('div.transition-recyclable').each(function() {
						var e = $.Event('pageremove');
						$(this).trigger(e, $(this));
						if (!e.defaultPrevented){
							$(this).remove();
						}
					});
					$('div[data-role="page-container"]').not(function() {return $(this).children().length}).remove();
				}
			}, 752);
		}

	};

	// 对外接口
	$.fn.transition = function(method) {
		if (methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || !method){
			return methods.to.apply(this, arguments);
		}
		else{
			throw 'Method ' +  method + ' does not exist';
		}
	};

	function toId(url) {
		var i = url.indexOf('?');
		if (i > 0)
			url = url.slice(0, i);
		return url.replace(/[:\.\+\/]/g, '_');
	}

	})( jquery )


})