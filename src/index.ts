import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType } from "@lark-opdev/block-basekit-server-api";
const { t } = field;
const feishuDm = ["feishu.cn", "feishucdn.com", "larksuitecdn.com", "larksuite.com"];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
basekit.addDomainList([...feishuDm]);

basekit.addField({
  formItems: [
    {
      key: "url",
      label: "请选择需转附件的URL字段",
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
        placeholder: "请选择，最多支持5个URL地址",
      },
      validator: {
        required: true,
      },
      tooltips: [
        {
          type: "text",
          content: "最多支持5个URL",
        },
      ],
    },
  ],
  resultType: {
    type: FieldType.Attachment,
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    /** 为方便查看日志，使用此方法替代console.log */
    function debugLog(arg: any) {
      // @ts-ignore
      console.log(
        JSON.stringify({
          formItemParams,
          context,
          arg,
        })
      );
    }
    try {
      const { url } = formItemParams;
      if (Array.isArray(url)) {
        const nowDate = new Date().getTime();
        //提取所有的urls，2层循环嵌套
        let data = [];
        url.forEach(({ text }, index) => {
          if (!text) {
            return undefined;
          }
          let urlList = text;
          //将字符串转换为数组
          if (text.indexOf(",") > -1) {
            urlList = text
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v);
          } else if (text.indexOf(";") > -1) {
            urlList = text
              .split(";")
              .map((v) => v.trim())
              .filter((v) => v);
          } else if (text.indexOf(" ") > -1) {
            urlList = text
              .split(" ")
              .map((v) => v.trim())
              .filter((v) => v);
          }
          if (Array.isArray(urlList)) {
            urlList.forEach((item, key) => {
              if (key < 5) {
                // 只处理前5个元素
                data.push({
                  name: nowDate + "_" + index + "_" + key + ".png",
                  content: item,
                  contentType: "attachment/url",
                });
              }
            });
          }
        });
        // debugLog({
        //   "===2 输入的url": data,
        // });
        return {
          code: FieldCode.Success, // 0 表示请求成功
          // data 类型需与下方 resultType 定义一致
          data: data, //最大只能返回5个，超过会报错
        };
      }

      // 请避免使用 debugLog(url) 这类方式输出日志，因为所查到的日志是没有顺序的，为方便排查错误，对每个log进行手动标记顺序
      // debugLog({
      //   "===1 url为空": url,
      // });
      return {
        code: FieldCode.Error,
      };
    } catch (error) {
      // debugLog({
      //   "===999 未知错误": String(error),
      // });
      return {
        code: FieldCode.Error,
      };
    }
  },
});
export default basekit;
