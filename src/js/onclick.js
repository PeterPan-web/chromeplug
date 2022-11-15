'点击元素设置选中元素样式'
import $ from 'jquery'
import md5 from "md5"
import layer from "../layer/layer"
import eventEnum from "./enum/eventEnum"
export default {
    methods: {
        onDomClick() {
            let csspath = this.generateCssSelector(this.selectedEl);
            //添加选择元素
            let len = this.selectedElList.length;
            let identifierFlg = "column" + len++;
            let color = this.propertyColors[this.colorIndex++ % this.propertyColors.length];
            let $sls= $(this.selectedEl);
            let id= this.selectedEl.id;
            let selector=id?'#'+id:(this.selectedEl.className?'.'+this.selectedEl.className.replace(/\s+/g, "."):csspath);
            //创建选中元素的对象
            let item = {
              identifierFlg: identifierFlg,//唯一标识符，用于后台统计
              cssSelector: selector,//jquery选择器,(ID、类、XPath选择器)
              eleID: id,//元素ID
              eleClass: this.selectedEl.className,//元素Class
              eleName: $sls.attr('name'),//元素Name
              eleText: $sls.text(),
              tagName: this.selectedEl.tagName,//元素Tag
              path: csspath, //csspath
              color: color, //选中后的颜色
              eventType: eventEnum.Click,//内容选择上传事件类型
              uniquecode: '' //选中元素的唯一ID
            };
        
            //生成唯一ID
            let uniquecode = md5(JSON.stringify(item));
            if (this.selectedElList.filter(function(val) {
              return val.uniquecode == uniquecode;
            }).length == 0) {
              item.uniquecode = uniquecode;
              this.selectedElList.push(item);
            } else {
              layer.msg("当前元素已经添加过了！", {
                zIndex: 2147483620,
                time: 3000,
                icon: 2
              });
            }
            this.lastSelectedElList = this.selectedElList;
        }
    }
}
