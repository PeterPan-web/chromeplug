import $ from 'jquery';
/*
    判断是否内容元素，也就是判断是不是我们的弹出框或者是遮罩
*/
export default class {
    constructor(expectClasses) {
        this.expectClasses = expectClasses || [".layuiex", ".layuiex-layer", ".layuiex-layer-shade", ".layuiex-layer-moves", ".mtBP_spider_Selecter_Block"];
    }

  /**
   * true:不包含
   * false:包含
   * @param element
   * @returns {boolean}
   */
    contains(element) {
        var expectClasses = this.expectClasses;
        for (var _i = 0; _i < expectClasses.length; _i++) {
            var els = document.querySelectorAll(expectClasses[_i]);
            for (var a = 0; a < els.length; a++) {
                //$.contains( container, contained )
                //检测一个元素包含在另一个元素之内
                //container	Element类型 指定可能包含其他元素的祖辈容器元素。
                //contained	Element类型 指定可能被其他元素包含的后代元素。
                if ((els[a] !== element && els[a].contains(element)) || els[a] == element) {
                    return false;
                }
            }
        }
        return true;
    };
}
