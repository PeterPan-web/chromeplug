'监视选择元素后，页面上设置元素样式'
export default {
    watch: {
        selectedElList: {
            handler(els) {
                let that = this;
                //删除所有已选元素外面的层
                this.lastSelectedElList.forEach(el => {
                    that.clearSelectedDom(el);
                });
                els.forEach(el => {
                    that.addSelectedDom(el);
                });
                //上次选择的元素样式更新，否则后续清除样式清除不掉
                this.lastSelectedElList=JSON.parse(JSON.stringify(els));
            },
            deep: true //对象内部的属性监听，也叫深度监听
        },
      saveServerElList: {
        handler(els) {
          let that = this;
          //删除所有已选元素外面的层
          this.lastSaveServerElList.forEach(el => {
            that.clearSelectedDom(el);
          });
          els.forEach(el => {
            that.addSelectedDom(el);
          });
          //上次选择的元素样式更新，否则后续清除样式清除不掉
          this.lastSaveServerElList=JSON.parse(JSON.stringify(els));
        },
        deep: true //对象内部的属性监听，也叫深度监听
      }
    }
}
