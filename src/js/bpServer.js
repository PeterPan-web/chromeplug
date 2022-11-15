'内容选择上传信息上传到服务器'
import $ from "jquery"

export default (function() {
  return {
    methods: {
      //内容选择上传上传
      mtBpUpload: function(bp,sucBack,errBack) {
        let url=this.mtBpServerUrl+"bp/BPHandleInfo.ashx?option=3";
        $.ajax({
          type: "POST",
          cache: false,
          data: bp,
          url: url,
          dataType: "json",
          success: function (data) {
            sucBack&&sucBack(data);
          },
          error: function (err) {
            errBack&&errBack(err);
          }
        });

      }
    }
  }
}());
