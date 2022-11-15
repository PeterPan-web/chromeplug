'选择元素的样式设置'
export default function() {
    String.prototype.replaceAll = function(regx, t) {
        return this.replace(new RegExp(regx, 'gm'), t);
    };

    class CssPathGenerator {
        constructor() {
            this.options = {
                highLight: false, //选择的元素是否高亮显示
                fullPath: false, //是否是全路径
                bgColor: 'yellow', //背景色
                border: 'yellow 1px solid', //边框
                expansion: 3 //扩大边框
            };
        }

        getQuery(dom, options) {
            Object.assign(this.options, options || {});
            if (this.options.highLight) {
                this.highLight(this.options);
            }

            return this.getPath(dom);
        };
        //获取元素Path
        getPath(dom) {
            return this.cssPath(dom, this.options.fullPath);
        };
        //通过属性和Css样式获取Path
        cssPath(el, optimised) {
            if (!(el instanceof Element))
                return;
            var path = [];
            while (el.nodeType === Node.ELEMENT_NODE) {
                var selector = el.nodeName.toLowerCase();
                //存在ID属性时
                if (el.id) {
                    selector += '#' + el.id;
                    path.unshift(selector);
                    break;
                } else {
                    var sib = el,
                        nth = 1;
                    while (sib = sib.previousElementSibling) {
                        if (sib.nodeName.toLowerCase() == selector)
                            nth++;
                    }

                    selector += (el.className ? '.' + el.className.replace(/\s+/g, ".") : '');
                    if (!optimised) {
                        selector += ":nth-of-type(" + nth + ")";
                    }
                }
                path.unshift(selector);
                el = el.parentNode;
            }
            return path.join(">");
        }

        highLight(options) {
            let op = {
                bgColor: 'yellow', //背景色
                border: 'yellow 1px solid', //边框
                expansion: 3, //扩大边框
            };

            Object.assign(op, options || {});

            let div = document.createElement('div');
            div.id = 'abs-box';
            div.style.position = 'absolute';
            div.style.zoom = 1;
            div.style.pointerEvents = 'none';
            div.style.zIndex = -1;
            document.body.appendChild(div);

            if (div != this.options.relativeNode) {
                let pos = this.getOffset(this.options.relativeNode),
                    em = op.expansion;
                div.style.left = pos.left - em;
                div.style.top = pos.top - em;
                div.style.width = this.options.relativeNode.getBoundingClientRect().width + 2 * em;
                div.style.height = this.options.relativeNode.getBoundingClientRect().height + 2 * em;
                div.style.backgroundColor = op.bgColor;
                div.style.border = op.border;
            }
        };

        getOffset(el) {
            const box = el.getBoundingClientRect();

            return {
                top: box.top + window.pageYOffset - document.documentElement.clientTop,
                left: box.left + window.pageXOffset - document.documentElement.clientLeft
            }
        }
    }

    this.getPath = function(options) {
        let cssPathGenerator = new CssPathGenerator();
        try {
            return cssPathGenerator.getQuery(options.relativeNode, options);
        } catch (e) {
            console.log(e);
        }
    }

};
