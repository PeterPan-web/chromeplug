/**
 * 判断是否有我们生成的元素，即被我们标记为选中的元素
 * true:未选中过的元素
 * false:标记选中的元素
 * @param {*} element
 */
export default function(element) {
    var el = element;

    //a 标签会过滤掉
    // if (!!el) {
    //     return false;
    // }

    if (el.getAttribute("__mtBP_select")) {
        return false;
    }

    if (el.classList.contains("__mtBP_selectrow")) {
        return false;
    }
    return true;
};
