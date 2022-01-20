<template>
  <div>
    <div class="screenBox">
      <img :src="'data:image/png;base64,' + url" width="100%" />
      <button @click="feedback">反馈问题</button>
    </div>
  </div>
</template>
<script>
import App from "light";
import LightSDK from "light-sdk";
export default {
  data() {
    return {};
  },
  props: ["url"],
  methods: {
    feedback: function () {
      var that = this;
      LightSDK.native.writeData(
        {
          key: "screenUrl",
          value: that.url,
          component_scope: "global",
        },
        function (data) {
          if (data.data) {
          } else {
            console.log("screenUrl写入失败");
          }

          App.navigate(
            "index/feedback",
            {
              url: "111",
            },
            { replace: false },
          );
        },
      );
    },
  },
};
</script>
<style lang="less">
.screenBox {
  z-index: 1000;
  width: 1.8rem;
  height: 2.8rem;
  padding: 2px;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  right: 10px;
  top: 3.5rem;
  overflow: hidden;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.7);

  button {
    color: #fff;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0.7rem;
    line-height: 0.7rem;
    background: rgba(0, 0, 0, 0.7);
    z-index: 2000;
  }
}
</style>
