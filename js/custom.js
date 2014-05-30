//配置文件读取
;;
(function (window) {
    var reader = new Reader(2);
    var error_times = {};
    var initCir_url = "http://122.10.9.227/init/initCir", //初始化
        transfers_url = "http://122.10.9.227/polling/transfers", //轮询转接量
        earlyVal_URL = "http://122.10.9.227/polling/earlyVal", //轮询预警值
        hangVal_URL = "http://122.10.9.227/polling/hangVal"; //悬挂数值
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
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            var res = "[]";
            error_times[url] = error_times[url] == undefined ? 0 : error_times[url];
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    res = xhr.responseText;
                    error_times[url] = 0;
                } else {
                    if (error_times[url] >= 3) {
                        console.error(" URL  :[" + url + "] 请求错误次数 [" + error_times[url] + "] 延迟请求时间 1/delayTime*3 直到修复完成");
                        delayTime = delayTime * 3;
                    }
                    console.error("请求错误 : 返回状态 [" + xhr.status + "] " + "错误时间 : " + new Date().toLocaleString());
                    error_times[url] += 1;
                }
                setTimeout(function () {
                    _callback(JSON.parse(res));
                }, (~~(delayTime * 1000)));
            }
        }
        xhr.send(null);
    }

    //init configs
    reader.open("js/config.json", function () {
        var configs = {};
        reader.read(51200, function (err, data) {
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
                }, 5000);
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

        //悬挂字段位置初始化
        var hangLabel_builder = function (hang_label) {
            for (var i = 0; i < hang_label.length; i++) {
                var hl = hang_label[i];
                var main_elem = document.createElement("div");
                main_elem.id = hl.id;
                main_elem.style.top = hl.y;
                main_elem.style.left = hl.x;
                main_elem.className = "hangLabel";
                var hangLabel_name_label = document.createElement("i");
                hangLabel_name_label.innerText = "数据接入中....";
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
            if (error_times[transfers_url] <= 0) {
                for (var i = 0; i < _data.length; i++) {
                    var fonts = document.createElement("font");
                    document.querySelector("#transfer_" + (i + 1) + " font").innerText = _data[i];
                }
            }
            ajax(transfers_url, transfers_handler, 1);
        }

        //initCir
        var cir_initBuilder = function (_data) {
            if (error_times[initCir_url] > 0) {
                ajax(initCir_url, cir_initBuilder, 0); //没有正确执行进行重新尝试
                return;
            }
            cir_config = dataset_config.cir_position,
            step = 0;
            for (var cir in _data) {
                var init_params = this._extend(cir_config[step], _data[cir]);
                init_params.id = cir;
                init_params.transition = 2;
                window[cir] = $c(init_params);
                step++;
            }
            // hidden load
            document.getElementById("loader").style.display = "none";
        }

        //earlyVal handler
        var earlyVal_handler = function (_data) {
            if (error_times[earlyVal_URL] <= 0) {
                for (var i = 1; i <= _data.length; i++) {
                    var tmp_cir = eval("circle_" + i);
                    tmp_cir.earlyValAnimate(_data[i - 1]);
                }
            }
            ajax(earlyVal_URL, earlyVal_handler);
        }

        //悬挂字段polling
        var hangVal_polling = function (_data) {
            if (error_times[hangVal_URL] <= 0) {
                for (var i = 0; i < _data.length; i++) {
                    var hang_elem = document.getElementById("hang_label_" + (i + 1));
                    hang_elem.innerHTML = "";
                    var obj = _data[i];
                    if (obj.length == 1) {
                        hang_elem.innerHTML = "<i>" + obj[0].title + "</i><p>" + obj[0].value + "</p>"
                    } else {
                        for (var n = 0; n < obj.length; n++) {
                            hang_elem.innerHTML += "<i>" + obj[n].title + "</i><font>" + obj[n].value + "</font><br/>"
                        }
                    }
                }
            }
            ajax(hangVal_URL, hangVal_polling);
        }

        //polling data
        ajax(initCir_url, cir_initBuilder, 0);
        ajax(transfers_url, transfers_handler);
        ajax(earlyVal_URL, earlyVal_handler);
        ajax(hangVal_URL, hangVal_polling);
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
    }
})(window);
