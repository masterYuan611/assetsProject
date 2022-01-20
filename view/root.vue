<template>
  <div>
    <div class="login" v-if="show">{{ toast }}</div>
    <sub-view></sub-view>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import wxService from "service/weixin";

export default {
  data() {
    return {
      code: "",
      toast: "正在登录...",
      show: false,
    };
  },
  computed: {},
  mounted() {
    // this.setAuthorization(
    //   "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJnaHpxIiwiaWF0IjoxNjQyNDY4NzY5LCJzdWIiOiJ7XCJicmhfbmFtZVwiOlwi6LSi5a-M566h55CG6YOoXCIsXCJicmhfbm9cIjpcIjEwNjAxMFwiLFwiaXNJbnZlc3RtZW50QWR2aXNvclwiOnRydWUsXCJtYXhSb2xlQ29kZVwiOlwiMTAwMVwiLFwib2FfdXNlcl9pZFwiOlwiaHVhbmdiXCIsXCJvYV91c2VyX25hbWVcIjpcIum7hOaWjFwiLFwicGhvbmVcIjpcIjEzODc3MTA2Nzg2XCIsXCJxckNvZGVcIjpcImh0dHBzOi8vb3Blbi53b3JrLndlaXhpbi5xcS5jb20vd3dvcGVuL3VzZXJRUkNvZGU_dmNvZGU9dmMxOTQyYjVkNDZhZjVmOWE4XCIsXCJyb2xlQ29kZXNcIjpbXCIxMDAxXCJdLFwienNiaFwiOlwiUzAzNTAxMDAwMTAxNDBcIn0iLCJleHAiOjE2NDI1MDQ3Njl9.ZQbs7ggM3pn1anNVtix7QpJlLv1e7SIIxZxl89h2CT0",
    // );
    // this.setIsInvestmentAdvisor(true);
    // this.setMaxRole("1001");
    // this.setroleCodes(["1001", "1002"]);
    if (!window.APIconfig.isWxWork) {
      this.$toast.fail({
        type: "fail",
        duration: 0,
        message: "请进入手机企业微信查看！",
      });
      return;
    }
    this.show = true;
    //获取微信请求的的Code
    let code = this.getQueryString("code");
    if (code) {
      this.handleLogin(code);
    } else {
      this.toast = "获取code失败";
    }
  },
  methods: {
    ...mapMutations("user", [
      "setIsInvestmentAdvisor",
      "setMaxRole",
      "setAuthorization",
      "setroleCodes",
    ]),
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURIComponent(r[2]);
      return null;
    },
    handleLogin(code) {
      this.$apiFwgx
        .getAuthentication({
          code,
        })
        .then(({ data }) => {
          console.log("hahah++", data);
          console.log({ data }, "login");
          this.toast = "登录成功";
          this.setAuthorization(data.data.authorization);
          this.setMaxRole(data.data.maxRole);
          this.setroleCodes(data.data.roleCodes);
          console.log("maxRole", data.data.maxRole);
          this.setIsInvestmentAdvisor(data.data.isInvestmentAdvisor);
          wxService.config();
          this.$router.push(`/root/home`);
        })
        .catch(() => {
          this.toast = "登录失败";
        });
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
