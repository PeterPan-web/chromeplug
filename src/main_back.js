import Vue from 'vue' ;
import './layer/layer.css';
// import 'css-loader!./layer/layer.css';
import data from './js/data';
import watch from './js/watch';
import layer from "./layer/layer";
import layerForm from './js/form';
import FileSaver from 'file-saver';
import onclick from './js/onclick';
import getcsspath from './js/getCsspath';
import selectedDom from './js/selectedDom';
import shelter from './js/selector/shelter';
import html2markdown from './js/html2markdown';
Vue.config.productionTip = false;

let shelterUi = new shelter();

new Vue({
  el: "#__mtBP_configure_container",
  mixins: [data, onclick, getcsspath, watch, selectedDom],
  data() {
    return {
      finished: false, //是否完成配置
      save_type: 'markdown', //保存类型
      selectedEl: null, //当前选中的元素
      selectedElList: [], //选中的元素集合
      lastSelectedElList: [], //上一次选中的元素集合
      isSelectedExcludeEl: false, //是否是选择排除元素
      currentItemIndex: null //当前要添加排除元素的对象索引
    };
  },
  methods: {
    //导出数据
    exportdata() {
      let that = this;
      let savedData = [];

      this.selectedElList.forEach(function(el) {
        that.removeElement(el.exclude_els);
        savedData.push(html2markdown(that.getElContent(el)));
      });
      var blob = new Blob(savedData, { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, "exportdata.md");
    },
    //点击排除内部元素复选框的操作
    excludeElChkClk(index) {
      this.currentItemIndex = index;
    },
    //开始选择排除内部元素
    beginSelectExcludeEl(index) {
      this.currentItemIndex = index;
      this.isSelectedExcludeEl = true;
    },
    //结束选择排除内部元素
    endSelectExcludeEl() {
      this.currentItemIndex = null;
      this.isSelectedExcludeEl = false;
    },
    //删除选择的排除元素
    delExcludeEl(index, itemIndex) {
      let that = this;
      layer.confirm('您确定要删除这个排除的元素吗？', {
        icon: 3
      }, function(i) {
        that.lastSelectedElList = JSON.parse(JSON.stringify(that.selectedElList));
        that.selectedElList[itemIndex].exclude_els.splice(index, 1);
        layer.close(i);
      });
    },
    //删除排除的元素
    removeElement(els) {
      try {
        document.querySelectorAll(els.join(",")).forEach(function(el) {
          el.parentNode.removeChild(el);
        })
      } catch (error) {}
    },
    //获得元素内容
    getElContent(el) {
      let arr = [];
      try {
        let path = el.path;
        let selectType = el.selectType;
        let selectedEls = document.querySelectorAll(path);
        switch (selectType) {
          case 'label':
            selectedEls.forEach(function(el) {
              arr.push(el.outerHTML);
            });
            break;
          case 'text':
          default:
            selectedEls.forEach(function(el) {
              arr.push(el.innerText);
            });
        }
      } catch (error) {
        console.log(error);
      }
      return arr;
    },
    //移动元素
    move(index, to) {
      var swapItems = function(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
      };
      this.lastSelectedElList = JSON.parse(JSON.stringify(this.selectedElList));
      if (to == -1) {
        swapItems(this.selectedElList, index, index - 1);
      } else {
        swapItems(this.selectedElList, index, index + 1);
      }
    },
    del(index) {
      let that = this;
      layer.confirm('您确定要删除这个吗？', {
        icon: 3
      }, function(i) {
        that.lastSelectedElList = JSON.parse(JSON.stringify(that.selectedElList));
        that.selectedElList.splice(index, 1);
        layer.close(i);
      });
    },
    delAll() {
      let that = this;
      layer.confirm('您确定要删除所有吗？', {
        icon: 3
      }, function(i) {
        that.lastSelectedElList = JSON.parse(JSON.stringify(that.selectedElList));
       // that.selectedElList.splice(index, 1);
        layer.close(i);
         
      });
      layer.msg("删除成功", {
          zIndex: 2147483620,
          time: 1000,
          icon: 1
        });
      // this.finished = true;
      // this.endSelect();
     
    },

    finish() {
      if (this.selectedElList.length == 0) {
        layer.msg("请设置抓取内容", {
          zIndex: 2147483620,
          time: 1000,
          icon: 2
        });
        return false;
      }
      this.finished = true;
      this.endSelect();
    },
    back() {
      this.finished = false;
      this.beginSelect();
    },
    beginSelect() {
      let that = this;
      shelterUi.beginSelect(that.onDomClick, null,
        function(selectedEl) {
          that.selectedEl = selectedEl;
        });
    },
    endSelect(clear) {
      let that = this;
      shelterUi.endSelect();
      if (clear) {
        this.lastSelectedElList.forEach(el => {
          that.clearSelectedDom(el);
        });
      }
    }
  },
  computed: {
    excludeEls() {
      return this.selectedElList.filter(function(item) {
        return item.is_exclude_el;
      });
    }
  },
  beforeCreate() {
    let that = this;
    layerForm(function() {
      that.endSelect(true);
    });
  },
  mounted() {
    this.beginSelect();
    $(".__mtBP_configure_item h4").bind("click", function() {
      if ($(this).next().is(":visible")) {
        $(this).next().slideUp("fast").end().removeClass("selected");
        $(this).find("b").html("+")
      } else {
        $(this).next().slideDown("fast").end().addClass("selected");
        $(this).find("b").html("-")
      }
    })
  },
});
