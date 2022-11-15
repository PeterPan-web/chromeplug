import sDom from './shelterDom';
import validateSelect from './validateSelected';
import isContentElement from "./isContentElement";

//选择遮罩
export default class {
    constructor(parentDom, shelterDom, blockDom) {
        this.shelter = shelterDom || sDom(); //选择过程中的div
        this.block = blockDom || sDom(); //鼠标移动到元素上的边框
        this.parentDom = parentDom || document.body;

        this.lastSelectEl = null; //当前鼠标移动到元素
        this.shelterInterval = null; //shelter中监视器

        this.isContentElement = new isContentElement();
    }

    beginSelect(onDomClick, onContextMenu, callback) {
        let that = this;
        this.shelter.style.position = "absolute";
        this.shelter.style.display = "block";
        this.shelter.classList.add("mtBP_spider_Selecter_Block");
        this.shelter.addEventListener("click", onDomClick, false);
        this.shelter.style.width = "100%";
        this.shelter.style.height = this.getDocumentHeight() + "px";
        this.shelter.style.left = "0";
        this.shelter.style.top = "0";
        this.shelter.addEventListener("mousemove", this.onShelterMouseMove(callback), false);

        this.parentDom.appendChild(this.shelter);
        this.parentDom.appendChild(this.block);

        //初始化遮罩
        function initCover() {
            that.shelterInterval = setInterval(function() {
                //如果遮罩层的高度小于页面高度，则将遮罩的高度设置成页面高度
                if (that.getDocumentHeight() > that.shelter.getBoundingClientRect().height) {
                    that.hideCover();
                    that.showCover();
                }
            }, 500);
        }

        //鼠标移动到遮罩层上的时候，重置遮罩层高度
        this.shelter.addEventListener("mouseover", function() {
          //鼠标在遮罩层移动异常监听器
            if (that.shelterInterval) {
                clearInterval(that.shelterInterval);
                that.shelterInterval = null;
            }
        }, false);

        this.shelter.addEventListener("mouseout", initCover, false);

        this.block.style.position = "absolute";
        this.block.style.display = "block";
        this.showShelter(); //显示遮罩阴影
        this.block.style.zIndex = "19891009";
        this.shelter.style.zIndex = "19891010";

        //绑定右键事件
        document.oncontextmenu = onContextMenu;

        //鼠标滚动事件，目的是防止页面滚动
        this.shelter.addEventListener("mousewheel", function(evt) {
            event.stopPropagation();
            event.preventDefault();
            var height = evt.wheelDelta;
            if (!that.lastSelectEl) return;
            var el = that.lastSelectEl;
            while (el) {
                if (el.scrollHeight > el.offsetHeight || el.tagName == "BODY") {
                    var lastTop = el.scrollTop;
                    el.scrollTop = el.scrollTop - height;
                    if (lastTop !== el.scrollTop) {
                        break;
                    }
                }
                el = el.parentElement;
            }
        }, false);
        initCover();
    };

    endSelect(callback) {
        try {
            if (this.shelterInterval) {
                clearInterval(this.shelterInterval);
                this.shelterInterval = null;
            }
            this.shelter.parentNode.removeChild(this.shelter);
            this.block.parentNode.removeChild(this.block);
            document.oncontextmenu = function() {};
            callback && callback();
        } catch (error) {}
    };

    showShelter() {
        this.block.style.boxShadow = "0 0 3px #d4930d";
    };

    hideShelter() {
        this.block.style.boxShadow = "none";
    };

    //鼠标移动时的操作
    onShelterMouseMove(callback) {
        let that = this;
        var position = {
            x: 0,
            y: 0
        };

        return function(e) {
            event.stopPropagation();
            //鼠标和上次移动有一段距离再计算元素
            if (Math.abs(position.x - e.pageX) > 10 || Math.abs(position.y - e.pageY) > 10) {
                //隐藏蒙层
                that.hideCover();
                //返回当前鼠标所在位置的最顶层元素，也就是鼠标所在的页面元素
                var el = document.elementFromPoint(e.clientX, e.clientY);
                // console.log("当前元素1：",el);
                //显示蒙层
                that.showCover();

                //如果是弹出框或者是遮罩则返回
                if (!that.isContentElement.contains(el)) return;

                //如果元素中有我们生成的属性，则取父元素；如果是a标签则取父元素
                if (!validateSelect(el)) {
                    el = el.parentNode;
                }
                if (!that.lastSelectEl || that.lastSelectEl != el) {
                    that.lastSelectEl = el;
                }
                position = {
                    x: e.pageX,
                    y: e.pageY
                };
                that.setPosition(el, that.block);
                callback && callback(that.lastSelectEl);
            }
        }
    }

    setShelterPosition(el) {
        this.setPosition(el, this.shelter);
    }

    /**
     * 把选择框设置当当前选择元素的位置
     * @param {Jquery Dom Element} el 选择的元素
     * @param {Jquery Dom Element} shelter 遮罩层
     */
    setPosition(el, shelter) {
        // console.log('当前元素2：',el,el.getBoundingClientRect(),el.tagName,el.children);
        if ((el.getBoundingClientRect().width == 0 || el.getBoundingClientRect().height == 0) && el.tagName == 'A' && el.children.length) {
            that.setPosition(el.children[0], shelter);
            return;
        }

        var paddingObject = {
            left: parseInt(el.style.paddingLeft),
            top: parseInt(el.style.paddingTop),
            right: parseInt(el.style.paddingRight),
            bottom: parseInt(el.style.paddingBottom)
        };

        var _width = 0,
            _height = 0;
        if (!isNaN(paddingObject.left)) {
            _width += paddingObject.left;
        }
        if (!isNaN(paddingObject.right)) {
            _width += paddingObject.right;
        }
        if (!isNaN(paddingObject.top)) {
            _height += paddingObject.top;
        }
        if (!isNaN(paddingObject.bottom)) {
            _height += paddingObject.bottom;
        }

        var top = parseInt(this.getOffset(el).top);
        var height = el.getBoundingClientRect().height + _height;
        var availHeight = this.getDocumentHeight() - top;
        height = height > availHeight ? availHeight : height;

        shelter.style.left = parseInt(this.getOffset(el).left) + "px";
        shelter.style.top = top + "px";
        shelter.style.width = el.getBoundingClientRect().width + _width + "px";
        shelter.style.height = height + "px";
    };

    hideCover() {
        this.block.style.zIndex = "-2";
        this.shelter.style.zIndex = "-1";
        this.shelter.style.display = "none";
        this.block.style.display = "none";
    };

    showCover() {
        this.shelter.style.display = "block";
        this.block.style.display = "block";
        this.block.style.zIndex = "19891009";
        this.shelter.style.zIndex = "19891010";

        this.shelter.style.width = "100%";
        this.shelter.style.height = this.getDocumentHeight() + "px";
        this.shelter.style.left = "0";
        this.shelter.style.top = "0";
    };

    //和jquery的$(document).height();相同
    getDocumentHeight() {
        const body = document.body;
        const html = document.documentElement;
        return Math.max(
            body.offsetHeight,
            body.scrollHeight,
            html.clientHeight,
            html.offsetHeight,
            html.scrollHeight
        );
    }

    getOffset(el) {
        const box = el.getBoundingClientRect();

        return {
            top: box.top + window.pageYOffset - document.documentElement.clientTop,
            left: box.left + window.pageXOffset - document.documentElement.clientLeft
        }
    }

    setBlockCss(key, value) {
        this.block.style[key] = value;
    }

    setShelterCss(key, value) {
        this.shelter.style[key] = value;
    }
}
