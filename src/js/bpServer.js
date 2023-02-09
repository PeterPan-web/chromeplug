"内容选择上传信息上传到服务器";
import $ from "jquery";
export default (function() {
  return {
    methods: {
      //内容选择上传上传
      mtBpUpload: function(mustip,bp, sucBack, errBack) {

        // let url = this.mtBpServerUrl + "/collect/task/getNodes";
        let url= mustip;
        $.ajax({
          type: "POST",
          // xhrFields: {
          //   withCredentials: false // 前端设置是否带cookie
          // },
          // crossDomain: true, // 会让请求头中包含跨域的额外信息，但不会含cookie
          // cache: false,
            // data: JSON.stringify({nodes:'1'}),
          // contentType: "application/JSON;charset=UTF-8",
          // processData: false,
          data: {
            nodes: JSON.stringify(bp)
          },
          url: url,
          dataType:"json" ,// 请求方式为jsonp
          success: function(data) {
            sucBack && sucBack(data);
          },
          error: function(err) {
            errBack&&errBack(err);
          }
        });
      }
    }
  };
})();
