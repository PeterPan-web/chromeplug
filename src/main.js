import Vue from "vue";
import $ from "jquery";

import "./layer/layer.css";
import data from "./js/data";
import watch from "./js/watch";
import layer from "./layer/layer";
import layerForm from "./js/form";
import FileSaver from "file-saver"; //Blob 类型数据保存到本地文件
import html2markdown from "./js/html2markdown"; //HTML字符串转mark字符串
import onclick from "./js/onclick";
import getcsspath from "./js/getCsspath";
import selectedDom from "./js/selectedDom";
import shelter from "./js/selector/shelter";
import bpServer from "./js/bpServer";
import eventTypes from "./js/enum/eventEnum";
import titleTypes from "./js/enum/titleEnum";
Vue.config.productionTip = false;

let shelterUi = new shelter();

new Vue({
  el: "#__mtBP_configure_container",
  mixins: [data, onclick, getcsspath, watch, selectedDom, bpServer],
  data() {
    return {
      ipfind: false,
      needip: "192.168.31.111",
      neednum:'8082',
      needurl:"",
      titleTypes: titleTypes,
      eventTypes: eventTypes,
      finished: false, //是否完成配置，配置完成后展示删除服务器按钮
      selectedEl: null, //当前选中的元素
      selectedElList: [], //选中的元素集合
      lastSelectedElList: [], //上一次选中的元素集合，目的把之前选择元素背景色去掉
      saveServerElList: [], //已保存到服务器上的元素集合，通过ajax从服务器获取
      lastSaveServerElList: [] //上一次以保存到服务器上的元素集合
    };
  },
  methods: {
    changeip1(){
      this.needip=''
      input1.focus()
    },
    changeip2(){
      this.neednum=''
      input2.focus()
    },
    ippost() {
      this.needip = input1.value
      this.neednum = input2.value
      this.needurl="http://"+this.needip+":"+this.neednum+"/collect/task/getNodes";

      const reg = new RegExp(/^http(s)?:\/\/((www\.)?[a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9]{0,62})|(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d))?(?:\:([0-9]|[1-9])\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])?\/+[a-zA-Z0-9]/)

      if (reg.test(this.needurl)) {
        this.ipfind = true;
        console.log(this.needurl);
      } else {
        layer.msg("地址错误", {
          zIndex: 2147483630,
          time: 1000,
          icon: 2
        });
      }
    },
    //上传服务器
    uploaddata() {
      let that = this;
      this.finished = false;
      console.log("上传服务器内容选择的信息：", this.selectedElList);
      this.saveServerElList = this.saveServerElList.concat(this.selectedElList);
      //设置选择菜单不为空
      // this.selectedElList= [];
      this.beginSelect();
      this.mtBpUpload(
        this.needurl,
        this.selectedElList,
        function() {
          layer.msg("上传服务器成功", {
            zIndex: 2147483620,
            time: 1000,
            icon: 1
          });
        },
        function() {
          layer.msg("上传服务器失败", {
            zIndex: 2147483630,
            time: 1000,
            icon: 2
          });
        }
      );
      console.log("已上传服务器内容点：", this.saveServerElList);
    },
    //删除内容点
    del(index) {
      let that = this;
      layer.confirm(
        "您确定要删除这个内容点吗？",
        {
          icon: 3
        },
        function(i) {
          that.lastSelectedElList = JSON.parse(
            JSON.stringify(that.selectedElList)
          );
          that.selectedElList.splice(index, 1);
          layer.close(i);
        }
      );
    },
    //设置专栏类型key
    changeProduct(event, item) {
      if (event.target.value == "标题") {
        item.titleKeyCode = 0;
      }
      if (event.target.value == "副标题") {
        item.titleKeyCode = 1;
      }
      if (event.target.value == "栏目") {
        item.titleKeyCode = 2;
      }
      if (event.target.value == "发布日期") {
        item.titleKeyCode = 3;
      }
      if (event.target.value == "来源") {
        item.titleKeyCode = 4;
      }
      if (event.target.value == "作者") {
        item.titleKeyCode = 5;
      }
      if (event.target.value == "摘要") {
        item.titleKeyCode = 6;
      }
      if (event.target.value == "内容") {
        item.titleKeyCode = 7;
      }
    },

    //复制内容点
    copyDoc(data) {
      console.log(data);
      layer.msg("复制成功", {
        zIndex: 2147483620,
        time: 1000,
        icon: 1
      });

      if (navigator.clipboard) {
        // clipboard api 复制
        navigator.clipboard.writeText(data);
      } else {
        var textarea = document.createElement("textarea");
        document.body.appendChild(textarea);
        // 隐藏此输入框
        textarea.style.position = "fixed";
        textarea.style.clip = "rect(0 0 0 0)";
        textarea.style.top = "10px";
        // 赋值
        textarea.value = data;
        // 选中
        textarea.select();
        // 复制
        document.execCommand("copy", true);
        // 移除输入框
        document.body.removeChild(textarea);
      }
    },
    delServer(index) {
      let that = this;
      layer.confirm(
        "您确定要删除服务器上内容点吗？",
        {
          icon: 3
        },
        function(i) {
          that.saveServerElList.splice(index, 1);
          layer.close(i);
        }
      );
    },

    //完成抓取，开始上传服务器
    finish() {
      if (this.selectedElList.length == 0) {
        layer.msg("请设置抓取内容", {
          zIndex: 2147483620,
          time: 1000,
          icon: 2
        });
        return false;
      }
      let aaa = this.selectedElList.some(item => {
        return item.titleKey == undefined;
      });
      if (aaa) {
        layer.msg("请选择文章位置", {
          zIndex: 2147483620,
          time: 1000,
          icon: 2
        });
        return false;
      } else {
        this.finished = true;
        this.endSelect();
      }
    },
    delAll() {
      let that = this;
      layer.confirm(
        "您确定要删除所有吗？",
        {
          icon: 3
        },
        function(i) {
          that.lastSelectedElList = JSON.parse(
            JSON.stringify(that.selectedElList)
          );
          //删除选择框内的内容
          that.selectedElList.splice(0, that.lastSelectedElList.length);
          layer.close(i);
        }
      );
    },

    //返回
    back() {
      this.finished = false;
      this.beginSelect();
    },
    beginSelect() {
      let that = this;
      shelterUi.beginSelect(that.onDomClick, null, function(selectedEl) {
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
        this.lastSaveServerElList.forEach(el => {
          that.clearSelectedDom(el);
        });
      }
    }
  },
  //计算属性
  computed: {},
  beforeCreate() {
    let that = this;
    layerForm(function() {
      that.endSelect(true);
    });
  },
  mounted() {
    if (window.location.protocol !== "http:") {
      layer.msg("该页面无法上传数据", {
        zIndex: 2147483630,
        time: 3000,
        icon: 2
      });
    }
    this.beginSelect();
    $(".__mtBP_configure_item h4").bind("click", function() {
      if (
        $(this)
          .next()
          .is(":visible")
      ) {
        $(this)
          .next()
          .slideUp("fast")
          .end()
          .removeClass("selected");
        $(this)
          .find("b")
          .html("+");
      } else {
        $(this)
          .next()
          .slideDown("fast")
          .end()
          .addClass("selected");
        $(this)
          .find("b")
          .html("-");
      }
    });
  }
});
