export default function() {
    String.prototype.replaceAll = function(regx, t) {
        return this.replace(new RegExp(regx, 'gm'), t);
    };

    function isNullOrEmpty(o) {
        return null == o || 'null' == o || '' == o || undefined == o;
    }

    class XPathGenerator {
        constructor() {
            this.options = {
                highLight: false, //选择的元素是否高亮显示
                fullPath: true, //是否是全路径
                preferenceAttr: 'class', //属性偏好 'id' or 'class'
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

            let path = this.getPath(dom, this.options.relativeNode, '');
            let query = '//' + path;
            if (query[query.length - 1] !== ']') {
                query += "[1]";
            }

            return query;
        };

        getPath(currentNode, relativeNode, path) {
            let tn = currentNode.tagName; //获得元素类型
            if (isNullOrEmpty(currentNode) || isNullOrEmpty(tn)) {
                return path;
            }
            let attr = this.getAttr(currentNode); //获得id或者class
            tn = tn.toLowerCase() + attr;
            path = isNullOrEmpty(path) ? tn : tn + "/" + path;

            let parentE = currentNode.parentNode;
            if (isNullOrEmpty(parentE) || (!this.options.fullPath && attr.substring(0, 5) == '[@id=')) {
                return path;
            }

            if (this.options.fullPath) {
                return this.getPath(parentE, relativeNode, path);
            }

            let curr = currentNode;
            if (relativeNode != null && relativeNode != undefined && (relativeNode !== curr && relativeNode.contains(curr))) {
                return this.getPath(parentE, relativeNode, path);
            } else {
                //[1]无法定位
                let c = attr.substring(attr.length - 2, attr.length - 1);
                if (c != "'" && c != '"') {
                    return this.getPath(parentE, relativeNode, path);
                } else {
                    let test = document.evaluate('//' + tn, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (test.snapshotLength == 1) {
                        return path;
                    } else {
                        return this.getPath(parentE, relativeNode, path);
                    }
                }
            }
        };

        getAttr(currentNode) {
            let tn = currentNode.tagName;
            if (tn == "HTML" || tn == "BODY") return "";
            if (this.options.preferenceAttr == 'class') {
                let theClass = currentNode.getAttribute('class');
                let theHasClass = !isNullOrEmpty(theClass);
                if (theHasClass && !/\d+/.test(theClass)) return "[@class='" + theClass + "']";
            } else if (this.options.preferenceAttr == 'id') {
                let id = currentNode.getAttribute('id');
                let hasId = !isNullOrEmpty(id);
                if (hasId) return "[@id='" + id + "']";
            }

            //如果是当前节点
            if (Array.from(currentNode.parentNode.children).filter((child) =>
                    child !== tn
                ).length > 0) {
                let i = this.prevAll(currentNode, tn).length;
                i++;
                return '[' + i + ']';
            }

            return '';
        };

        prevAll(node, selector) {
            var list = [];
            var prev = node.previousElementSibling;

            while (prev && prev.nodeType === 1) {
                list.unshift(prev);
                prev = prev.previousElementSibling;
            }

            if (selector) {
                var node = [].slice.call(document.querySelectorAll(selector));

                list = list.filter(function(item) {
                    return node.indexOf(item) !== -1;
                });
            }

            return list;
        };

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
        let xPathGenerator = new XPathGenerator();
        try {
            return xPathGenerator.getQuery(options.relativeNode, options);
        } catch (e) {
            options.preferenceAttr = "id";
            options.fullPath = false;
            try {
                return xPathGenerator.getQuery(options.relativeNode, options);
            } catch (e) {
                options.preferenceAttr = "class";
                return xPathGenerator.getQuery(options.relativeNode, options);
            }
        }
    }

};