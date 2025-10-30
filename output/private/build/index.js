"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
const feishuDm = ["feishu.cn", "feishucdn.com", "larksuitecdn.com", "larksuite.com"];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
block_basekit_server_api_1.basekit.addDomainList([...feishuDm]);
block_basekit_server_api_1.basekit.addField({
    formItems: [
        {
            key: "url",
            label: "请选择需转附件的URL字段",
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Text],
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
        type: block_basekit_server_api_1.FieldType.Attachment,
    },
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
        /** 为方便查看日志，使用此方法替代console.log */
        function debugLog(arg) {
            // @ts-ignore
            console.log(JSON.stringify({
                formItemParams,
                context,
                arg,
            }));
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
                    }
                    else if (text.indexOf(";") > -1) {
                        urlList = text
                            .split(";")
                            .map((v) => v.trim())
                            .filter((v) => v);
                    }
                    else if (text.indexOf(" ") > -1) {
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
                    code: block_basekit_server_api_1.FieldCode.Success, // 0 表示请求成功
                    // data 类型需与下方 resultType 定义一致
                    data: data, //最大只能返回5个，超过会报错
                };
            }
            // 请避免使用 debugLog(url) 这类方式输出日志，因为所查到的日志是没有顺序的，为方便排查错误，对每个log进行手动标记顺序
            // debugLog({
            //   "===1 url为空": url,
            // });
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
        catch (error) {
            // debugLog({
            //   "===999 未知错误": String(error),
            // });
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBZ0o7QUFDaEosTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFDcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLHFEQUFxRDtBQUNyRCxrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUVyQyxrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLFNBQVMsRUFBRTtRQUNUO1lBQ0UsR0FBRyxFQUFFLEtBQUs7WUFDVixLQUFLLEVBQUUsZUFBZTtZQUN0QixTQUFTLEVBQUUseUNBQWMsQ0FBQyxXQUFXO1lBQ3JDLEtBQUssRUFBRTtnQkFDTCxXQUFXLEVBQUUsQ0FBQyxvQ0FBUyxDQUFDLElBQUksQ0FBQztnQkFDN0IsV0FBVyxFQUFFLGlCQUFpQjthQUMvQjtZQUNELFNBQVMsRUFBRTtnQkFDVCxRQUFRLEVBQUUsSUFBSTthQUNmO1lBQ0QsUUFBUSxFQUFFO2dCQUNSO29CQUNFLElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRSxXQUFXO2lCQUNyQjthQUNGO1NBQ0Y7S0FDRjtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxvQ0FBUyxDQUFDLFVBQVU7S0FDM0I7SUFDRCwyREFBMkQ7SUFDM0QsT0FBTyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDekMsaUNBQWlDO1FBQ2pDLFNBQVMsUUFBUSxDQUFDLEdBQVE7WUFDeEIsYUFBYTtZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDYixjQUFjO2dCQUNkLE9BQU87Z0JBQ1AsR0FBRzthQUNKLENBQUMsQ0FDSCxDQUFD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