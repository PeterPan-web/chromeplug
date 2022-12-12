import $ from "jquery";
import "../css/index.css";
import layer from "../layer/layer";
import template from "../htmls/index.html";
export default function(endSelect) {
    let _confirmLayer = 0;
    let windowHeight = $(window).height();
    let windowWidth = document.body.clientWidth;
    if (windowHeight > window.screen.height) {
        windowHeight = document.body.clientHeight;
    }

    let defOption = {
        type: 1,
        shade: false,
        maxmin: true,
        closeBtn: 1,
        zIndex: 2147483599,
        title: "互联网信息采集器",
        offset: ["40px", "40px"],
        content: template,
        area: [windowWidth*0.4+"px", windowHeight * 0.8 + "px"],
        cancel: function(index) {
            event.stopPropagation();
            if (_confirmLayer > 0) {
                layer.close(_confirmLayer);
            }
            _confirmLayer = layer.confirm(
                "关闭互联网信息采集器？", {
                    icon: 0,
                    title: "信息",
                    zIndex: 2147483615
                },
                function(_index) {
                    event.stopPropagation();
                    endSelect && endSelect();
                    layer.closeAll();
                    _confirmLayer = -1;
                    layer.msg("再见!", {
                        zIndex: 2147483620,
                        time: 3000,
                        icon: 1
                    });
                },
                function(_index) {
                    event.stopPropagation();
                    layer.close(_index);
                    _confirmLayer = -1;
                }
            );
            return false;
        }
    };

    let layerId = layer.open(defOption);

    $("#layuiex-layer" + layerId + " .layuiex-layer-max").bind("click", function() {
        $(this).hide();
    }).hide();

    $("#layuiex-layer" + layerId + " .layuiex-layer-min").bind("click",
        function() {
            $(this).next().show();
        }
    );
}
