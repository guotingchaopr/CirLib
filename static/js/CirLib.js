/****

 **  圆形创建库 **
    zichun.guo
*****/
(function () {
    var Cir = function () {
        var _this = arguments.length ? new Cir.fn.init(arguments[0]) : (function () {
            console.warn("参数异常 : [arguments] = " + Array.prototype.slice.call(arguments));
            return undefined;
        })()
        return _this;
    };

    Cir.fn = Cir.prototype = {
        x: 0,
        y: 0,
        constructor:Cir,
        _self: undefined,
        id: new Date().getTime(),
        radius: 0,
        transition: "0.3s",
        state: "infinite",
        iconFont_1: "&#xe602",
        iconFont_2: "&#xe601",
        iconFont_className: " iconfont",
        parentEl: document.body,
        animateWay: undefined,
        parentEl: document.body,
        color: "#5a9662",
        borderColor: "#5A9662",
        frontColor: "#5A9662",
        backColor: "#66AB70",
        shadowColor: "#000",
        init: function (config) {
            for (var cf in config) {
                this[cf] = config[cf] || this[cf];
            }
            this.dia = this.radius * 2;
            if (this.parentEl) {
                this.parentEl.appendChild(this.createCir());
            }
            return this;
        },
        createCir: function () {
            var circle = this._self = document.createElement("div");
           // this.__proto__ = circle.__proto__.__proto__;
           // this.constructor = this;
            circle.id = this.id;
            var cssRule = this.cssRules(this.x, this.y, this.radius);
            for (var style in cssRule) {
                circle.style[style] = cssRule[style];
            }
            if (this.animateWay) {
                this.insertCSSRule(this.animateWay);
                this._self.style.webkitAnimation = this.id + " " + this.transition + " " + this.state;
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
                "width": this.dia + "px",
                "height": this.dia + "px",
                "webkitBorderRadius": this.dia + "px",
                "color": this.color,
                "background": "#3a3b3c",
                "border": (~~(this.dia / 38)) + "px solid " + this.borderColor,
                "borderRadius": this.dia + "px",
                "boxShadow": "0 0 " + ~~(this.dia / 3) + "px " + this.shadowColor,
                "overflow": "hidden",
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
            inner_el_1.style.fontSize = this.radius * 2 * 2;
            var inner_el_2 = document.createElement("div");
            inner_el_2.id = this.id + "_child_2";
            inner_el_2.innerHTML = this.iconFont_2;
            inner_el_2.className += this.iconFont_className;
            inner_el_2.style.color = this.backColor;
            inner_el_2.style.fontSize = this.radius * 2 * 2;
            this.containWith(this._self, inner_el_1);
            this.containWith(this._self, inner_el_2);
            this.insertCSSRule({
                name: this.id + "_child",
                direction: "left",
                fromValue: -this.dia,
                toValue: 0
            });
            var childs = this._self.children;
            for (var i = 0; i < childs.length; i++) {
                childs[i].style.left=-this.dia;
                childs[i].style.webkitAnimation = this.id + "_child " + this.transition + " " + this.state;
                childs[i].style.webkitAnimationTimingFunction = "linear";
            }
        },
        containWith: function (fromEl, toEl) {
            return fromEl.appendChild(toEl);
        }

    };
    Cir.fn.extend =
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
    Cir.fn.init.prototype = Cir.fn;
    window.Cir = window.$c = Cir;
    return Cir;
})();
