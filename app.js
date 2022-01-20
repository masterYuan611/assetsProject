import App from "light";
import FastClick from "fastclick";
import apiFwgx from "apiFwgx";
import store from "./store";

require("./lib/px2rem");
require("./app.less");

import Vue from "vue";
import Vant, { Lazyload } from "vant";
import "vant/lib/index.css";
import * as echarts from "echarts";
import { Toast } from "vant";

import filters from "./mixins/numberFormatter.js";
Object.keys(filters).forEach((k) => Vue.filter(k, filters[k]));

Vue.use(Vant);
Vue.use(Lazyload);

Vue.prototype.$echarts = echarts;
Vue.prototype.$apiFwgx = apiFwgx;
Vue.prototype.$flag = true;
Vue.prototype.$EventBus = new Vue();
Vue.prototype.$store = store;
Vue.prototype.sensors = window.sensors;

Toast.setDefaultOptions("loading", { forbidClick: true });
Toast.setDefaultOptions({ duration: 0 });

// fix input框在ios机型上需要连续双击才能调起键盘的问题
FastClick.prototype.focus = function (targetElement) {
  let deviceIsIOS = /IP(ad|hone|od)/.test(navigator.userAgent);
  let length;
  if (
    deviceIsIOS &&
    targetElement.setSelectionRange &&
    targetElement.type.indexOf("date") !== 0 &&
    targetElement.type !== "time" &&
    targetElement.type !== "month" &&
    targetElement.type !== "email"
  ) {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};

// 启动fastClick
if ("addEventListener" in document) {
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      FastClick.attach(document.body);
    },
    false,
  );
}

// 如果旋转则刷新当前页面
window.addEventListener(
  "orientationchange",
  function () {
    window.location.reload();
  },
  false,
);

App.filter("route", function (_from, _to, next) {
  const { title } = _to.meta;
  document.getElementById("HeadTitle").innerText = title || "资配平台";
  next();
}).start();
