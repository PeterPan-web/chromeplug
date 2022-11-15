export default {
    methods: {
        clearSelectedDom(selectedEl) {
            try {
                let that = this;
                let path = selectedEl.path;
                let cssSelector = selectedEl.cssSelector;
                //xpath修改样式
                // document.querySelectorAll(path).forEach(function(el) {
                //     el.style.boxShadow = "none";
                //     el.removeAttribute(that.selectAttr);
                //     el.removeAttribute("_data_index");
                //     el.classList.remove(that.rowClass);
                // });
                //css选择器设置样式
                if(cssSelector){
                  document.querySelectorAll(cssSelector).forEach(function(el) {
                    el.style.boxShadow = "none";
                    el.removeAttribute(that.selectAttr);
                    el.removeAttribute("_data_index");
                    el.classList.remove(that.rowClass);
                  });
                }
            } catch (error) {
            }
        },
        addSelectedDom(selectedEl) {
            try {
                let that = this;
                let path = selectedEl.path;
                let color = selectedEl.color;
                let cssSelector = selectedEl.cssSelector;
                //通过xpath设置样式
                // document.querySelectorAll(path).forEach(function(el) {
                //     let currentEl = el;
                //     currentEl.style.boxShadow = "0 0 10px " + color + ",0 0 20px " + color + " inset";
                //     currentEl.setAttribute(that.selectAttr, "1");
                // });
                //通过css选择器设置样式
                if(cssSelector){
                  let allEles=document.querySelectorAll(cssSelector);
                  allEles.forEach(function(el) {
                    let currentEl = el;
                    currentEl.style.boxShadow = "0 0 10px " + color + ",0 0 20px " + color + " inset";
                    currentEl.setAttribute(that.selectAttr, "1");
                  });
                }

            } catch (error) {
            }
        },
        //获取元素兄弟节点
        getEleSiblings(elem) {
          var r = [];
          var n = elem.parentNode.firstChild;
          for ( ; n; n = n.nextSibling ) {
            if ( n.nodeType === 1 && n !== elem ) {
              r.push( n );
            }
          }
          return r;
        }
    }
}
