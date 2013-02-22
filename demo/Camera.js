/* pjax架构 */
seajs.config({
	alias: {
		'History':'../plugins/history',
	}
});
define(function(require, exports, module){
	require('History');

	var $ = require("$"),// 引用jquery
		Shadow  = require("Shadow"),// 阴影
		Routing = require("Routing");// 路由

	var Camera = (function(){

		/**
		 * 载入页面
		 * @param  url 地址
		 */
		function loading(url){
			var card = CardManage.findCardByUrl(url),
			field = card.getField();

			showField(field,card);
		}

		/**
		 * 展示卡片域
		 * @param field 卡片域对象
		 */
		function showField(field,card){
			var nowField = FieldManage.getNowField();
			
			if(field == nowField){

				langToCard(card);
			}
			else{
				
				shotToCard(card);
				moveField(field);
			}
		}

		/**
		 * 慢速移动[同域使用]
		 * @param url 卡片url
		 */
		function langToCard(card){
			moveToCard(card,500)
			CardManage.reload(card);
		}

		/**
		 * 快速移动[异域使用]
		 * @param url 卡片url
		 */
		function shotToCard(card){
			var field = card.getField(),
				cards = field.getChild();

			CardManage.hideCards(cards);
			moveToCard(field,card,0);
			CardManage.reload(card);
		}

		/**
		 * 移动到卡片
		 * @param card 卡片对象
		 * @param time 延迟时间
		 */
		function moveToCard(field,card,time){

			var fieldEl = field.getElement(),
				t;

			card.getElement().show();
			// todo:延迟时间
			if(time){
				fieldEl.addClass('ts_tf400ea');
			}

			var pos = card.getPos();
			fieldEl.css({'transform':'translate3d(-'+pos+'px,0px,0px'+')'})

			clearTimeout(t);
			t = setTimeout(function(){
				fieldEl.removeClass("ts_tf400ea");
			},4500)
		}


		/**
		 * 移动卡片域
		 * @param field 卡片域对象
		 * @return {[type]}       [description]
		 */
		function moveField(field){

			var newField = field.getElement(),
				nowField = FieldManage.getNowField(),
				oldField = nowField.getElement(),
				t;

			clearTimeout(t);
			newField.addClass("left400ea").css("left",oldField.width()+"px").show()
			oldField.addClass("left400ea");

			setTimeout(function(){
				newField.css({'left':'0px','backface-visibility':'hidden'});
				oldField.css({'left':(oldField.width() * -1)+"px",'backface-visibility':'hidden'})
			},0)

			t = setTimeout(function(){
				newField.removeClass("left400ea");
				oldField.removeClass("left400ea").hide();
				nowField = field;
			},450)
		}




		return {
			/**
			 * 启动方法
			 */
			Run:function(){
				VisionManage.createVision();
				FieldManage.resetField();

				// var History = window.History;
				// //监听url改变事件
				// History.Adapter.bind(window,'statechange',function(){
				// 	var State = History.getState();
				// 	if(!State.data.url){
				// 		var oldUrl = State.data.url,
				// 			newUrl = Routing.analysis(oldUrl);


				// 		loading(newUrl);
				// 	}
				// });

			},
			/**
			 * 设置作用域
			 * @param cards 地址
			 */
			setField:function(cards){
				var cards = CardManage.createCards(cards),
					field = FieldManage.createField(cards);

				VisionManage.fillField(field)
			},
			/**
			 * 配置
			 * @param configObj 配置规则
			 * @param configObj.rules 路由规则
			 * @param configObj.ready 加载完成回调方法
			 * @return 
			 */
			config:function(configObj){
				// Routing.setRules(configObj.rules);
				CardManage.cardComplete(configObj.ready)
			},
			loading:function(url){
				loading(url);
			}
		}
	})();

	/*
	 * 镜头管理
	 */
	var VisionManage = (function(){
		var vision = null,
			visionEl = '<div data-role="Vision"></div>',
			fields = [];

		return {
			/**
			 * 创建固定镜头
			 * @param fields 卡片域数组
			 */
			createVision:function(){
				vision ? vision : new Vision(visionEl,fields);
				return vision;
			},
			/**
			 * 填充卡片域
			 * @param field 卡片域对象
			 */
			fillField:function(field){
				fields.push(field);
			}
		}
	})()
	
	/**
	 * 固定镜头
	 * 处理域关系
	 */
	var Vision = function(elStr,fields){
		this.$element = $(elStr)// 镜头元素
		this.fields = fields; // 卡片域数组

		this.init();// 初始化
	}
	Vision.prototype = {
		/**
		 * 初始化
		 */
		init:function(){
			// 添加卡片域
			this.add();
			// 生成结构
			this.$element.prependTo("body");
		},
		/**
		 * 添加卡片域
		 * @param fields 卡片域数组
		 */
		add:function(){
			var temp_fieldEls = [],
				i = 0,
				len = this.fields.length;

			for (; i < len; i += 1) {
				temp_fieldEls.push(this.fields[i].getElement());
			}
			
			this.$element.append(temp_fieldEls)
		},
		// 获取卡片域对象
		getChild:function(){
			return this.fields;
		},
		// 获取当前元素
		getElement:function(){
			return this.$element;
		}
	}

	/**
	 * 卡片域管理
	 */
	var FieldManage = (function(){
		var fields = [],
			fieldEl = '<div data-role="CardField"></div>',
			nowField = null;


		return {
			/**
			 * 创建卡片域
			 * @param cards 卡片数组
			 */
			createField:function(cards){
				var field = new CardField(fieldEl,cards);

				fields.push(field);

				return field;
			},
			/**
			 * 重置卡片域
			 * @param  {[type]} cardField [description]
			 * @return {[type]}           [description]
			 */
			resetField:function(){
				var i = 0,
					len = fields.length;

				for (;i < len;i += 1) {
					var cards = fields[i].getChild();

					CardManage.resetCard(cards)// 重置卡片
					fields[i].getElement().hide();
				}

				// 设定当前卡片域为首个添加卡片域
				nowField = fields[0];
				nowField.getElement().show();
			},
			/**
			 * 获取当前卡片域
			 * @return [description]
			 */
			getNowField:function(){
				return nowField;
			}
		}
	})()

	/**
	 * 卡片域类
	 * @param cards 卡片数组
	 */
	var CardField = function(elStr,cards){
		this.$element = $(elStr);// 卡片域元素
		this.cards = cards;// 卡片数组

		this.init();// 初始化
	}
	CardField.prototype = {
		/**
		 * 初始化
		 * 卡片添加到卡片域
		 */
		init:function(){
			this.add();
		},
		/**
		 * 创建作用域元素
		 */
		add:function(){
			var temp_cardEls = [],
				i = 0,
				len = this.cards.length;
				
			for (; i < len; i += 1) {
				temp_cardEls.push(this.cards[i].getElement());
				this.cards[i].setField(this);
			}
			this.$element.append(temp_cardEls)// 添加至dom
		},
		/**
		 * 获取卡片域元素
		 * @return $element 卡片域元素
		 */
		getElement:function(){
			return this.$element;
		},
		/**
		 * 获取卡片数组
		 * @return cards 卡片数组
		 */
		getChild:function(){
			return this.cards;
		}
	}

	/**
	 * 卡片管理
	 */
	var CardManage = (function(){
		var cards = [],// 已创建卡片数组
			cardEl = '<div data-role="Card"></div>',// 卡片元素字符串
			iframeEl = '<iframe></iframe>',// iframe元素字符串
			completeCount = 0,
			completeCallBack = null;// 就绪回调函数

		/**
		 * 卡片就绪,onload时调用
		 */
		function complete(){
			completeCount++
			if(completeCallBack && cards.length === completeCount){
				completeCallBack();
			}
		}

		return{
			/**
			 * 创建单张卡片
			 * 记录到cards数组,绑定onload事件用于记录载入进度
			 * @param url 地址
			 * @return card对象
			 */
			createCard:function(url){
				var card = new Card(cardEl,iframeEl,url);

				cards.push(card);

				card.getChild().on("load",function(){
					complete();
				})

				return card;
			},
			/**
			 * 创建卡片数组
			 * @param urls 地址数组
			 * @return temp_cards 卡片对象数组
			 */
			createCards:function(urls){
				var i = 0,
					temp_cards = [],
					len = urls.length;

				for (; i < len; i += 1) {
					temp_cards.push(this.createCard(urls[i]))
				}

				return temp_cards;
			},
			/**
			 * 卡片载入完成,执行iframe下reload方法
			 * @param card 卡片对象
			 */
			reload:function(card){

				// todo:添加阴影,缓存
				var iframe = card.getChild(),
					win = iframe[0].contentWindow;

				if(typeof win["reload"] === "function"){
					win["reload"]();
				}

			},
			/**
			 * 卡片就绪
			 * @param fn 回调函数
			 */
			cardComplete:function(fn){
				completeCallBack = fn;
			},
			/**
			 * 根据url查找卡片
			 * @param url 地址
			 */
			findCardByUrl:function(url){
				var i =0,
					len = cards.length;

				for (; i < len; i += 1) {
					if(cards[i].url === url){
						return cards[i];
					}
				}
			},
			/**
			 * 重置卡片
			 * @param cards 卡片数组
			 * @return {[type]} [description]
			 */
			resetCard:function(cards){
				var i = 0,
					len = cards.length;

				// 遍历卡片
				for (; i < len; i +=1 ) {
					var card = cards[i],
						cardEL = card.getElement(),
						posX = cardEL.width() * i;// 坐标
					
					// 设置样式
					cardEL.css('transform','translate3d('+posX+'px,0px,0px'+')');
					card.setPos(posX);
				}
			},

			/**
			 * 隐藏卡片
			 */
			hideCards:function(cards){
				var i = 0,
					len = cards.length;

				for (; i < len; i += 1) {
					cards[i].getElement().hide();
				}
			}
		}
	})()

	/**
	 * 卡片类
	 * @param elStr 卡片元素字符串
	 * @param childStr 子元素字符串
	 * @param url 地址
	 */
	var Card = function(elStr,childStr,url){
		this.$element = $(elStr);// 卡片元素
		this.$child = $(childStr);// iframe元素
		this.field = null;// 所属卡片域
		this.url = url;// 地址
		this.pos = 0;// 位置

		this.init();// 初始化
	}

	Card.prototype = {
		/**
		 * 获得卡片元素
		 * @return $element 卡片元素
		 */
		getElement:function(){
			return this.$element;
		},
		/**
		 * 获得卡片iframe元素
		 * @return $child 卡片iframe
		 */
		getChild:function(){
			return this.$child;
		},
		/**
		 * 初始化
		 */
		init:function(){
			this.add();
		},
		/**
		 * 创建卡片元素
		 */
		add:function(){
			this.$child.attr("src",this.url);
			this.$element.append(this.$child);
		},
		/**
		 * 设置卡片位置
		 * @param pos 位置
		 */
		setPos:function(pos){
			this.pos = pos;
		},
		/**
		 * 获得卡片位置
		 * @return pos 位置
		 */
		getPos:function(){
			return this.pos;
		},
		/**
		 * 设置作用域
		 * @param field 所属作用域
		 */
		setField:function(field){
			this.field = field
		},
		/**
		 * 获得作用域
		 * @return field 所属作用域
		 */
		getField:function(){
			return this.field;
		}
	}

// 对外接口
module.exports = Camera;
})