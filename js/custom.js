//配置文件读取
;;
(function (window) {
    var reader = new Reader(2);
    reader.open("js/config.json", function () {
        var configs = {};
        reader.read(51200, function (err, data) {
            //console.log();
            var configs_str = String.fromCharCode.apply(null, new Uint8Array(data));
            configs = JSON.parse(configs_str);
            load_flow(configs);
            window.onload = init(configs);
        });
    });
    var init = function (configs) {
            var animate_config = configs.animate_position;
            var dataset_config = configs.dataset;
            //动画图片处理
            var animateImg = function (animate_configs) {
                for (var conf in animate_configs) {
                    var params = animate_configs[conf];
                    var img = new Image();
                    eval("window." + params.name + " = img;");
                    img.className = params.name;
                    img.src = "img/" + (params.file == undefined ? params.name : params.file) + ".png";
                    img.style.position = "absolute";
                    img.style.left = params.x + "px";
                    img.style.top = params.y + "px";
                    img.style.zIndex = "-999";
                    img.onload = function () {
                        if (params.callback != undefined) eval(params.callback + ".call()");
                    }
                    (function (_img) {
                        document.body.appendChild(_img);
                    }(img)) //prevent coverage by dom hack
                }
            }

            //飞机喷火回调实现 (TODO :确保加载顺序)
            var flame_callBack = function () {
                var i = 0,
                    flameInterval = setInterval(function () {
                        if (i == 0) {
                            window.flame.style.visibility = "visible";
                            i = 1;
                        } else {
                            window.flame.style.visibility = "hidden";
                            i = 0;
                        }
                    }, 5000);
            };

            //数据位置生成
            var dataset_builder = function (dataset) {
                for (var data in dataset) {
                    var elem = document.createElement("div");
                    elem.id = data;
                    elem.className = "dataset";
                    elem.style.top = dataset[data].y;
                    elem.style.left = dataset[data].x;
                    document.body.appendChild(elem);
                    var elements = dataset[data].elements;
                    for (var _elements in elements) {
                        var elem_child = document.createElement("p");
                        elem_child.innerHTML = decodeURI("<i>" + elements[_elements] + "</i>");
                        elem.appendChild(elem_child);
                    }

                }
            }

            //scan config invoking
            animateImg(animate_config);
            dataset_builder(dataset_config);

        }
        /*  页面业务拼装 */
    var load_flow = function (configs) {
        var applyStyle = function (elem, left, top, hasShadow) {
            elem.style.backgroundColor = "#000";
            elem.style.position = "absolute";
            elem.style.width = "433px";
            elem.style.height = "588px";
            elem.style.borderRadius = "15px";
            elem.style.boxShadow = hasShadow ? "0 0 120px #69CAFF" : "none";
            elem.style.top = top;
            elem.style.left = left;
            document.body.appendChild(elem);
            return elem;
        }

        var blackWall_1 = applyStyle(document.createElement("div"), 314, 1296, true);
        var blackWall_2 = applyStyle(document.createElement("div"), 1254, 1296, true);
        var blackWall_2 = applyStyle(document.createElement("div"), 2248, 1374);
        var blackWall_2 = applyStyle(document.createElement("div"), 2727, 1377, true);
        var blackWall_2 = applyStyle(document.createElement("div"), 3208, 1370);
        var ivr = new $c({
            id: "ivr",
            x: 779,
            title: ["IVR", "进线"],
            y: 141,
            radius: 170,
            transition: 8,
            borderColor: "#339588",
            ew_normal_fg: "#339588",
            ew_normal_bg: "#3AAA99",
            ew_normal_shadow: "#1B423C",
            ew_2_fg: "#339588",
            ew_2_bg: "#3AAA99",
            ew_2_shadow: "#1B423C",
            _callback: function () {
                this.childUDAnimate(80);
            }
        });
        var hand_up = new $c({
            id: "hand_up",
            title: ["按键挂断"],
            x: 225,
            y: 666,
            radius: 102,
            transition: 8,
            borderColor: "#747E80",
            ew_normal_fg: "#3E5158",
            ew_normal_bg: "#747E80",
            ew_normal_shadow: "#3E5158",
            ew_2_fg: "#3E5158",
            ew_2_bg: "#747E80",
            ew_2_shadow: "#3E5158",
            ew_1_fg: "#3E5158",
            ew_1_bg: "#747E80",
            ew_1_shadow: "#3E5158"
        });
        var self_service = new $c({
            id: "self_service",
            title: ["自助", "服务"],
            x: 1399,
            y: 666,
            radius: 110,
            transition: 8
        });
        var a_quene = new $c({
            id: "a_quene",
            title: ["人工", "队列"],
            x: 835,
            y: 666,
            radius: 110,
            transition: 8
        });

        var hotline_selfsupport = new $c({
            id: "hotline_selfsupport",
            title: ["热线", "自营"],
            x: 384,
            y: 1201,
            radius: 141,
            transition: 8
        });
        var hotline_wb = new $c({
            id: "hotline_wb",
            title: ["热线", "外包"],
            x: 1325,
            y: 1201,
            radius: 141,
            transition: 8
        });

        var online = new $c({
            id: "online",
            x: 2780,
            title: ["在&nbsp;&nbsp;线", "online"],
            y: 100,
            isAnimate: "false",
            radius: 170,
            transition: 8,
            borderColor: "#879FCB",
            bgColor: "#879FCB",
            ew_normal_shadow: "#7089b2"
        });

        /*  var pc = new $c({
		id: "pc",
		x: 2655,
		title:["PC"],
		y:616,
		radius: 100,
		transition: 8,
      borderColor: "#3a889f",
		bgColor: "#429cb7",
		ew_normal_shadow: "#3a889f",
		isAnimate:"false"
	});

    var wireless = new $c({
		id: "wireless",
		x: 3045,
		title:["无线"],
		y:616,
		radius: 100,
		transition: 8,
      borderColor: "#3a889f",
		bgColor: "#429cb7",
		ew_normal_shadow: "#3a889f",
		isAnimate:"false"
	});*/
        var pc_selfHelp = new $c({
            id: "pc_selfHelp",
            title: ["PC", "自助"],
            x: 2329,
            y: 1339,
            radius: 104,
            transition: 8
        });
        var wireless_selfHelp = new $c({
            id: "wireless_selfHelp",
            title: ["无线", "自助"],
            x: 3361,
            y: 1339,
            radius: 104,
            transition: 8
        });

        var artificial_selfHelp = new $c({
            id: "pc_slefHelp",
            title: ["人工", "在线服务"],
            x: 2808,
            y: 1314,
            radius: 130,
            transition: 8,
            _callback: function () {
                this.childUDAnimate(60);
            }

        });
    }
})(window);
