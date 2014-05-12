/****

 **  圆形创建库 **
    zichun.guo
*****/
(function () {
	var Cir = function () {
		var _this = arguments.length ? new Cir.kernel.init(arguments[0]) : (function () {
			console.warn("参数异常 : [arguments] = " + Array.prototype.slice.call(arguments));
			return undefined;
		})()
		return _this;
	};

	Cir.kernel = Cir.prototype = {
		x: 0,
		y: 0,
		_self: undefined,
		id: new Date().getTime(),
		radius: 0,
		transition: "0.3",
		height: 0,
		width: 0,
		state: "infinite",
		iconFont_1: "&#xe602",
		iconFont_2: "&#xe601",
		iconFont_className: " iconfont",
		animateWay: undefined,
		parentEl: undefined,
		color: "#5a9662",
		borderColor: "#5A9662",
		frontColor: "#5A9662",
		backColor: "#66AB70",
		shadowColor: "#000",
		ew_1: 60,
		ew_2: 80,
		ew_normal_fg: "#66AC70",
		ew_normal_bg: "#5A9662",
		ew_normal_shadow: "#4D5641",
		ew_1_fg: "#ECA539",
		ew_1_bg: "#D09132",
		ew_1_shadow: "#675235",
		ew_2_fg: "#D94D4C",
		ew_2_bg: "#C04444",
		ew_2_shadow: "#5F3D3C",
		ew_2_limit: 0,
		ew_2_limit: 0,
		ew_rate: 0,
		init: function (config) {
			for (var cf in config) {
				this[cf] = config[cf] || this[cf];
			}
			if (!this.parentEl) {
				this.parentEl = document.body;
			}
			this.dia = this.radius * 2;
			this.parentEl.appendChild(this.createCir());
			return this;
		},
		createCir: function () {
			var circle = this._self = document.createElement("div");
			circle.id = this.id;
			var cssRule = this.cssRules(this.x, this.y, this.radius);
			for (var style in cssRule) {
				circle.style[style] = cssRule[style];
			}
			if (this.animateWay) {
				this.insertCSSRule(this.animateWay);
				this._self.style.webkitAnimation = this.id + " " + this.transition + "s " + this.state;
				this._self.style.webkitAnimationTimingFunction = "linear";
			}

			this.createAnimateWidget(); //组装内部模块
			return circle;
		},
		cssRules: function () {
			var cssRule = {
				"position": "absolute",
				"left": this.x,
				"top": this.y,
				"width": this.width = this.dia + "px",
				"height": this.height = this.dia + "px",
				"webkitBorderRadius": this.dia + "px",
				"color": this.color,
				"background": "#3a3b3c",
				"border": (~~(this.dia / 38)) + "px solid " + this.borderColor,
				"borderRadius": this.dia + "px",
				"boxShadow": "0 0 " + ~~(this.dia / 3) + "px " + this.shadowColor,
				"overflow": "hidden",
				"transition": ~~(this.transition / 2) + "s",
				"cursor": "pointer"
			};
			return cssRule;
		},
		insertCSSRule: function (_animateWay) {
			if (document.styleSheets && document.styleSheets.length) {
				var rule = this.getKeyframes(_animateWay);
				try {
					document.styleSheets[0].insertRule(rule, 0);
				} catch (ex) {
					console.warn(ex.message, rule);
				}
			} else {
				var style = document.createElement("style");
				style.innerHTML = rule;
				document.head.appendChild(style);
			}
			return;
		},
		deleteCSSRule: function (ruleName) {
			var cssrules = (document.all) ? "rules" : "cssRules",
				i;
			for (i = 0; i < document.styleSheets[0][cssrules].length; i += 1) {
				var rule = document.styleSheets[0][cssrules][i];
				if (rule.name === ruleName || rule.selectorText === '.' + ruleName) {
					document.styleSheets[0].deleteRule(i);
					console.log("Deleted keyframe: " + ruleName);
					break;
				}
			}
			return;
		},
		getKeyframes: function (_animateWay) {
			var keyframes = "@-webkit-keyframes " + _animateWay.name + " { " +
				" 0% { " + _animateWay.direction + ":" + _animateWay.fromValue + "px; }" +
				" 100% { " + _animateWay.direction + ":" + _animateWay.toValue + "px;  }}";
			return keyframes;
		},
		createAnimateWidget: function () {
			var inner_el_1 = document.createElement("div");
			inner_el_1.id = this.id + "_child_1";
			inner_el_1.className += this.iconFont_className;
			inner_el_1.style.color = this.frontColor;
			inner_el_1.innerHTML = this.iconFont_1;
			inner_el_1.style.fontSize = this.dia * 2;
			var inner_el_2 = document.createElement("div");
			inner_el_2.id = this.id + "_child_2";
			inner_el_2.innerHTML = this.iconFont_2;
			inner_el_2.className += this.iconFont_className;
			inner_el_2.style.color = this.backColor;
			inner_el_2.style.fontSize = this.dia * 2;
			this.containWith(this._self, inner_el_1);
			this.containWith(this._self, inner_el_2);
			this.insertCSSRule({
				name: this.id + "_child",
				direction: "left",
				fromValue: -this.dia,
				toValue: 0
			});
			this.ew_rate = this.dia / 100; //转化比率
			this.ew_1_limit = this.ew_1 * this.ew_rate;
			this.ew_2_limit = this.ew_2 * this.ew_rate;
			var childs = this.childs = this._self.children;
			for (var i = 0; i < childs.length; i++) {
				childs[i].style.left = -this.dia;
				childs[i].style.webkitAnimation = this.id + "_child " + this.transition + "s " + this.state;
				childs[i].style.webkitAnimationTimingFunction = "linear";
			}

		},
		containWith: function (fromEl, toEl) {
			return fromEl.appendChild(toEl);
		},
		UDAnimate: function (direction) { //this up or down
			var currentDom = this._self;
			currentDom.style.top = direction.top;
			currentDom.style.left = direction.left;
		},
		childUDAnimate: function (top) {
			var covered_top = top * this.ew_rate;

			for (var i = 0; i < this.childs.length; i++) {
				this.childs[i].style.top = - (covered_top / 2);
			}

			if (covered_top >= this.ew_2_limit) {
				this._self.style.borderColor = this.ew_2_bg;
				this._self.style.boxShadow = "0 0 " + ~~(this.dia / 3) + "px " + this.ew_2_shadow;
				this.childs[0].style.color = this.ew_2_bg;
				this.childs[1].style.color = this.ew_2_fg;
			} else if (covered_top >= this.ew_1_limit) {
				this._self.style.borderColor = this.ew_1_bg;
				this._self.style.boxShadow = "0 0 " + ~~(this.dia / 3) + "px " + this.ew_1_shadow;
				this.childs[0].style.color = this.ew_1_bg;
				this.childs[1].style.color = this.ew_1_fg;
			} else {
				this._self.style.borderColor = this.ew_normal_bg;
				this._self.style.boxShadow = "0 0 " + ~~(this.dia / 3) + "px " + this.ew_normal_shadow;
				this.childs[0].style.color = this.ew_normal_bg;
				this.childs[1].style.color = this.ew_normal_fg;
			}
		}
	};
	Cir.kernel.extend =
		function () {
			var src, copy, name, options,
				target = arguments[0] || {};
			i = 1,
			length = arguments.length;
			if (length === i) {
				target = this;
				i--;
			}
			for (; i < length; i++) {
				if ((options = arguments[i]) != null) {
					for (name in options) {
						src = options[name];
						copy = target[name];

						if (src === copy) {
							continue;
						}
						if (src !== undefined) {
							target[name] = src;
						}
					}
				}
			}
			return target;
	};
	Cir.kernel.init.prototype = Cir.kernel;
	window.Cir = window.$c = Cir;
	return Cir;
})();
