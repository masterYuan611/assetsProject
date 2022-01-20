<template>
  <div class="serch" @click="gotoserch">
    <img src="images/search.png" alt="" class="img" />
    <span>客户姓名/手机号/资金账号</span>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    gotoserch() {
      this.$light.navigate(`root/serch?type=4`);
    },
  },
};
</script>
<style lang="less" scoped>
.serch {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6.9rem;
  height: 0.6rem;
  background: #f2f3f5;
  border-radius: 0.12rem;
  text-align: center;
  position: relative;
}
.img {
  margin-right: 0.17rem;
  width: 0.28rem;
  height: 0.28rem;
}
span {
  font-size: 0.28rem;
  font-weight: 400;
  text-align: left;
  color: #999999;
  line-height: 0.4rem;
}
.van-search {
  padding: 0;
}
</style>
