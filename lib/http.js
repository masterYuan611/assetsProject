import axios from "axios";
import { Toast } from "vant";
import { cloneDeep } from "lodash";
import store from "../store";

class Http {
  static defaultOpts = {
    baseURL: `${APIconfig.requestUrl}`,
    headers: {
      "content-type": "application/json",
    },
    timeout: 10000,
  };
  _http;

  constructor(opts = { enableReqInterceptor: true }) {
    this._http = axios.create(Object.assign(cloneDeep(Http.defaultOpts), opts));

    if (opts.enableReqInterceptor) {
      this._http.interceptors.request.use(reqInterceptorHandler, reqInterceptorError);
    }
    this._http.interceptors.response.use(resInterceptorHandler, resInterceptorError);
  }

  put(reqUrl, params) {
    return this._http.put(reqUrl, params);
  }

  post(reqUrl, params) {
    return this._http.post(reqUrl, params);
  }

  get(reqUrl, params) {
    return this._http.get(reqUrl, { params });
  }

  delete(reqUrl, params) {
    let paramsArr = [];
    for (let [key, value] of Object.entries(params)) {
      paramsArr.push(`${key}=${value}`);
    }
    return this._http.post(`${reqUrl}?${paramsArr.join("&")}`);
  }
}

function reqInterceptorHandler(config) {
  // const authorization = store.getters.authorization;
  const authorization =
    "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJnaHpxIiwiaWF0IjoxNjQyNjU3NTg1LCJzdWIiOiJ7XCJicmhfbmFtZVwiOlwi546J5rqq56eA5bGx6Lev6JCl5Lia6YOoXCIsXCJicmhfbm9cIjpcIjg3NzFcIixcImlzSW52ZXN0bWVudEFkdmlzb3JcIjpmYWxzZSxcIm1heFJvbGVDb2RlXCI6XCIxMDAxXCIsXCJvYV91c2VyX2lkXCI6XCJsaXowMlwiLFwib2FfdXNlcl9uYW1lXCI6XCLmnY7oh7tcIixcInBob25lXCI6XCIxMzM3ODg5NDExMlwiLFwicm9sZUNvZGVzXCI6W1wiMTAwMVwiXX0iLCJleHAiOjE2NDI2OTM1ODV9.GDGuvSmvJtxEMDZy1DxnNrWj8RPJgVs-sISn94aXC_4";
  if (authorization) {
    config.headers.Authorization = authorization;
  }
  return config;
}
function reqInterceptorError(error) {
  console.error("req error:", error);

  return Promise.reject(error);
}

function resInterceptorHandler(res) {
  var message = res.data.retMsg;

  if (res.data.success === false) {
    // ERROR_SYS_100000("SYS100000","服务器开小差了"),
    // ERROR_SYS_100001("SYS100001","参数异常"),
    // ERROR_SYS_100002("SYS100002","系统内部错误"),
    // ERROR_SYS_100003("SYS100003","会话过期"),
    // ERROR_SYS_100004("SYS100004","无会话信息"),

    Toast.fail({ message, duration: 2000, icon: "warning-o" });
    //当用户停留了半小时，导致令牌过期，当用户访问其他页面的时提示会话过期并关闭当前页面 SYS100008
    if (res.data.retCode === "SYS100003" || res.data.retCode === "SYS100008") {
      wx.closeWindow();
    }
  }

  return {
    data: res.data,
    msg: "",
  };
}

function resInterceptorError(err) {
  console.error("res error:", err);
  return Promise.reject(err);
}

export default new Http();
