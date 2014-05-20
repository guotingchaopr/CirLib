//配置文件读取
;;
(function (window) {
    var reader = new Reader(2);
    var SELF_HOLD_FLAG = 1;
    var transfers_url = "http://122.10.9.227/polling/transfers", //轮询转接量
        initCir_url = "http://122.10.9.227/init/initCir",
        earlyVal_URL = "http://122.10.9.227/polling/earlyVal"; //轮询预警值

    window._extend = function (jsonbject1, jsonbject2) {
        var resultJsonObject = {};
        for (var attr in jsonbject1) {
            resultJsonObject[attr] = jsonbject1[attr];
        }
        for (var attr in jsonbject2) {
            resultJsonObject[attr] = jsonbject2[attr];
        }
        return resultJsonObject;
    };

    var ajax = function (url, _callback, delayTime) {
        var xhr = new XMLHttpRequest();
        var delayTime = delayTime || 1;
        var _this = this;
        var ajaxs_params_cache = {
            "url": url,
            "_callback": _callback,
            "delayTime": delayTime
        };
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    SELF_HOLD_FLAG = 1;
                    var res = xhr.responseText;
                    setTimeout(function () {
                        _callback(JSON.parse(res));
                    }, (~~(delayTime * 1000)));
                } else
                    console.error("请求错误 : 返回状态 [" + xhr.status + "] " + "错误时间 : " + new Date().toLocaleString());
            }
        }
        xhr.send(null);
    }

    //init configs
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

    //init func
    var init = function (configs) {
        var animate_config = configs.animate_position;
        var dataset_config = configs.dataset_position;
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

        //飞机喷火回调实现 确保加载顺序
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
                }, 30);
        };

        //转接位置生成
        var transfer_builder = function (transfer_name, transfers) {
            for (var i = 0; i < transfers.length; i++) {
                var tf = transfers[i];
                var main_elem = document.createElement("div");
                main_elem.id = tf.id;
                main_elem.className = "transfer";
                main_elem.style.top = tf.y;
                main_elem.style.left = tf.x;
                var transfer_name_label = document.createElement("i");
                var transfer_name_value = document.createElement("font");
                transfer_name_label.innerText = decodeURI(transfer_name);
                transfer_name_value.id = tf.id + "_value";
                transfer_name_value.style.fontSize = "36px";
                transfer_name_value.style.color = "white";
                main_elem.appendChild(transfer_name_label);
                main_elem.appendChild(transfer_name_value);
                document.body.appendChild(main_elem);
            }
        }

        //悬挂字段位置确认
        var hangLabel_builder = function (hang_label) {
            for (var i = 0; i < hang_label.length; i++) {
                var hl = hang_label[i];
                var main_elem = document.createElement("div");
                main_elem.id = hl.id;
                main_elem.style.top = hl.y;
                main_elem.style.left = hl.x;
                main_elem.className = "hangLabel";
                var hangLabel_name_label = document.createElement("i");
                hangLabel_name_label.innerText = "数据接入中";
                main_elem.appendChild(hangLabel_name_label);
                document.body.appendChild(main_elem);
            }
        }

        //scan config invoking
        animateImg(animate_config);
        transfer_builder(dataset_config.transfer_name, dataset_config.transfers);
        hangLabel_builder(dataset_config.hang_label);

        //处理转接值视图
        var transfers_handler = function (_data) {
            // console.log("transfers_handler : " + _data);
            for (var i = 0; i < _data.length; i++) {
                var fonts = document.createElement("font");
                document.querySelector("#transfer_" + (i + 1) + " font").innerText = _data[i];
            }
            ajax(transfers_url, transfers_handler, 1);
        }

        //initCir
        var cir_initBuilder = function (_data) {
            console.log("cir_initBuilder : " + _data);
            cir_config = dataset_config.cir_position,
            step = 0;
            for (var cir in _data) {
                var init_params = this._extend(cir_config[step], _data[cir]);
                init_params.id = cir;
                init_params.transition = 8;
                window[cir] = $c(init_params);
                step++;
            }
        }

        //earlyVal handler
        var earlyVal_handler = function (_data) {
            for (var i = 1; i <= _data.length; i++) {
                var tmp_cir = eval("circle_" + i);
                tmp_cir.earlyValAnimate(_data[i]);
            }
            ajax(earlyVal_URL, earlyVal_handler, 2);
        }

        //polling data
        ajax(initCir_url, cir_initBuilder, 0);
        ajax(transfers_url, transfers_handler);
        ajax(earlyVal_URL, earlyVal_handler, 2);
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

        /* var blackWall_1 = applyStyle(document.createElement("div"), 314, 1296, true);
        var blackWall_2 = applyStyle(document.createElement("div"), 1254, 1296, true);
        var blackWall_2 = applyStyle(document.createElement("div"), 2248, 1374);
        var blackWall_2 = applyStyle(document.createElement("div"), 2727, 1377, true);
        var blackWall_2 = applyStyle(document.createElement("div"), 3208, 1370);*/

        /*var ivr = new $c({
            id: "ivr",
            x: 779,
            y: 141,
            title: ["IVR", "进线"],
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
            title: ["按键", "挂断"],
            x: 225,
            y: 666,
            radius: 105,
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

        });*/
    }
})(window);
