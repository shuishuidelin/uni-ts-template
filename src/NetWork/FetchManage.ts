import { ConstValue, UriInfo } from "@/Const/ConstValue";
import { reGetRole } from "@/utils/StaticFunUtils";
import User from "@/utils/User";
import ResposeBase, { BaseData, ResposeBaseGeneric, Upload } from "./ResposeBase";

export default class FetchManager {
  static base: BaseData = {
    os: "100",
    customKey: "",
    channelId: "10003",
    hardwareCode: "uuid016837720071652",
    appId: "wxc36ed15369507bbe",
    sdkVersion: "111",
    cpVersion: "102",
    osVersion: "222",
  };
  private static url: string = FetchManager.settingUrl();
  private static ifShowLoading = false;
  /**
   * url
   */
  public static settingUrl() {
    return FetchManager.url = (ConstValue.isTest ? ConstValue.testBaseUrl : ConstValue.isDebug ? ConstValue.localBaseUrl : ConstValue.serverBaseUrl)
  }
  /**延时触发lodding
   * loadingTimer延时器ID 
   */
  private static showLoading(): number {
    let loadingTimer = setTimeout(() => {
      if (FetchManager.ifShowLoading) return;
      uni.showLoading({
        title: "数据加载中...",
        success() {
          FetchManager.ifShowLoading = true;
        }
      })
    }, 1000);
    return loadingTimer
  }
  /**清除timer */
  private static clearTimer(loadingTimer: number) {
    setTimeout(() => {
      clearTimeout(loadingTimer)
      if (FetchManager.ifShowLoading) {
        wx.hideLoading()
      }
      FetchManager.ifShowLoading = false
    }, 0);
  }
  public static postCommon<T = any>(
    apiObj: UriInfo,
    oparams?: object
  ): Promise<ResposeBaseGeneric<T>> {
    if (!oparams) oparams = {};
    if (typeof oparams != "object") {
      throw new Error("oparams 应为Object");
    }
    this.base.customKey = User.getInstance().getCustomKey();
    const api = apiObj.uri;
    let params: { b?: BaseData; o?: object } = {
      b: this.base,
    };
    params.o = oparams;
    return new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
      let loadingTimer = apiObj.hiddenLoadingAnm ? undefined : FetchManager.showLoading();
      uni.request({
        url: this.url + api,
        method: "POST",
        header: {
          p: ConstValue.isDebug ? "dd" : "1",
          appKey: "drama_customer",
        },
        timeout: apiObj.timeout,
        data: JSON.stringify(params),
        success(response) {
          resolve(response)
        },
        complete() {
          typeof loadingTimer === "number" &&
            FetchManager.clearTimer(loadingTimer);
        }
      })
    }).then((response) => {
      // fetch与ajax(axios)不同，只要服务器有返回值，都是成功，没有返回值才算失败。
      // 所以要在这里进行处理所有返回的结果
      if (!/^(2|3)\d{2}$/.test(response.statusCode.toString())) {
        // 失败的状态，非2|3开头的状态，进行处理
        switch (response.statusCode) {
          case 401:
            // 权限不够，一般是未登录
            // ...
            console.log(api + "; 权限不够");
            break;
          case 403:
            // 服务器已经接受，但是拒绝访问，通常是登录过期
            // ...
            // localStorage.removeItem("token");
            console.log(api + ";token过期");
            break;
          case 404:
            // 找不到资源
            // ...
            console.log(api + ";404找不到资源");
            break;
        }
      }

      return response.data;
    })
      .then((data) => {
        console.log(api, params, data);

        // console.log("respose: " + api + "---" + JSON.stringify(data));
        let resposeBase = data as ResposeBase;
        let passed = this.isPass(JSON.stringify(resposeBase));
        if (passed) {
          return resposeBase;
        }
        return Promise.reject(data);
      })
      .catch((error) => {
        // 服务器没有响应才会跳转到这里
        wx.getNetworkType({
          success(res) {
            const networkType = res.networkType
            // 断网处理
            if (networkType == "none") {
              uni.showToast({ title: "连接失败 网络异常", icon: "none" })
              throw new Error("无网络");
            };
          }
        })
        // 什么都没有，返回一个错误
        return Promise.reject(error);
      });
  }
  private static isPass(json: string): boolean {
    let isPass: boolean = true;
    let resposeBase = JSON.parse(json) as ResposeBase
    if (resposeBase.code != 1) {
      isPass = false;
      if (resposeBase.code == -999) {
        reGetRole()
      } else if (resposeBase.interMsg) {
        uni.showToast({ title: resposeBase.interMsg, icon: "none" })
      } else if (resposeBase.msg) {
        uni.showToast({ title: resposeBase.msg, icon: "none" })
      } else {
        uni.showToast({ title: `status:${resposeBase.status},path:${resposeBase.path}`, icon: "none" })
      }
    }
    return isPass;
  }

  public static uploadFeil(filePath: string, index?: string): Promise<ResposeBaseGeneric<Upload>> {
    return new Promise<ResposeBaseGeneric<Upload>>((resolve, reject) => {
      if (!index) index = "0";
      if (filePath.indexOf('https') != -1) throw new Error("filePath:" + filePath + " 不是本地路径");
      wx.uploadFile({
        url: ConstValue.serverUploadUrl,
        filePath: filePath,
        name: 'file',
        formData: {
          'imgIndex': index
        },
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function (res) {
          var result = JSON.parse(res.data)
          resolve(result);
        },
        fail: function (res) {
          console.log("上传错误", res.errMsg);
          reject(res)
          uni.showModal({
            title: '错误提示',
            content: '上传图片失败',
            showCancel: false,
            success: function (res) { }
          })
        }
      })
    })
  }
}