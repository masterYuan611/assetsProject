<template>
  <div>
    <!-- <van-nav-bar title="客户动态" left-arrow @click-left="onClickLeft" :border="false">
      <template #left>
        <img src="images/back.png" />
      </template>
    </van-nav-bar> -->
    <!-- 客户动态列表-有数据时 -->
    <div class="mian_status">
      <div class="status_list" v-for="item in this.statusList" :key="item.id">
        <!-- 客户动态标题 -->
        <div class="list_title">
          <img
            src="images/icon-status.png"
            alt=""
            style="
              width: 0.5rem;
              height: 0.5rem;
              display: block;
              position: absolute;
              left: 0;
              top: 0;
            "
          />
          <span class="status-title">客户动态</span>
          <span class="status-time"> {{ item.generationTime }} </span>
        </div>
        <!-- 客户阅读内容提示 -->
        <div class="status-content">{{ item.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statusList: [],
      pageNum: 1,
      pageSize: 6,
    };
  },
  mounted() {
    this.getstatusList();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    getstatusList() {
      this.$apiFwgx
        .getStatusList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        .then((data) => {
          function funGetDateStr(p_count) {
            var dd = new Date();
            dd.setDate(dd.getDate() + p_count); //获取p_count天后的日期
            // var y = dd.getFullYear();
            var m = dd.getMonth() + 1; //获取当前月份的日期
            if (m < 10) {
              m = "0" + m;
            }
            var d = dd.getDate();
            if (d < 10) {
              d = "0" + d;
            }
            return m + "-" + d;
          }
          let arr = data.data.data.rows;
          for (const item of arr) {
            let timeType = "";
            let times = item.generationTime;
            if (times / 3600 < 1) {
              timeType = parseInt((times / 3600) * 60) + "分钟前";
            }
            if (times / 3600 >= 1 && times / 3600 <= 24) {
              timeType = parseInt(times / 3600) + "小时前";
            }
            if (times / 3600 > 24 && times / 3600 <= 48) {
              timeType = "昨天";
            }
            if (times / 3600 > 48) {
              let day =
                times / 3600 / 24 > parseInt(times / 3600 / 24)
                  ? parseInt(times / 3600 / 24) + 1
                  : parseInt(times / 3600 / 24);
              var monDay = funGetDateStr(-day);
              timeType = monDay;
            }
            item.generationTime = timeType;
          }
          this.statusList = arr;
          console.log("status", this.statusList);
        });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar {
  .van-nav-bar__content {
    height: 0.88rem;
  }
  .van-nav-bar__title {
    font-size: 0.36rem;
    font-weight: 400;
    color: #383838;
  }
  img {
    width: 0.4rem;
  }
}
.title {
  text-align: center;
}
.mian_status {
  width: 7.1rem;
  min-height: 14.48rem;
  background: #f2f3f5;
  padding: 0.2rem;
  font-size: 0.32rem;
  font-weight: 500;
  text-align: center;
  color: #333333;
  line-height: 0.5rem;
}
.status_list {
  &:first-of-type {
    margin-top: 0;
  }
  background: linear-gradient(316deg, #ffffff 2%, #ffffff 97%);
  border-radius: 12px;
  padding: 0.4rem 0.3rem;
  margin-top: 0.2rem;
}
.list_title {
  height: 0.5rem;
  line-height: 0.5rem;
  position: relative;
}
.status-title {
  display: block;
  // width: 1.28rem;
  height: 0.5rem;
  font-size: 0.32rem;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 0.5rem;
  float: left;
  margin-left: 0.91rem;
}
.status-time {
  display: block;
  height: 0.36rem;
  font-size: 0.24rem;
  font-weight: 500;
  text-align: left;
  color: #999999;
  line-height: 0.5rem;
  float: right;
}
.status-content {
  margin-top: 0.2rem;
  font-size: 0.28rem;
  font-weight: 400;
  text-align: justify;
  color: #999999;
  line-height: 0.48rem;
}
</style>
