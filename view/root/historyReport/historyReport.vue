<template>
  <div class="customer-page">
    <!-- <van-nav-bar title="历史报告" left-arrow :border="false">
      <template #left> <img src="images/back.png" @click="$router.back(-1)" /> </template>
    </van-nav-bar> -->
    <div class="customer-main">
      <div id="top">
        <!-- <div class="search-box"> -->
        <div class="search">
          <!-- <Search /> -->
          <div class="search" @click="gotosearch">
            <img src="images/search.png" />
            <span class="text">{{ text }}</span>
          </div>
          <!-- </div> -->
        </div>
        <!-- 下拉选择 -->
        <div class="menu">
          <down-menu
            :isSingle="false"
            placeholder="报告类型"
            :options="assetsList"
            v-model="filterCondition.assets"
            @change="handleDownmenuChange"
          >
          </down-menu>
          <div class="readTime">
            <div class="menu-title" @click="timeSort">
              <span>阅读时长</span>
              <img :src="upOrDown ? 'images/timeDown.png' : 'images/timeUp.png'" alt="" />
            </div>
          </div>
          <down-menu
            :isSingle="false"
            placeholder="推送状态"
            :options="attentionList"
            v-model="filterCondition.attention"
            @change="handleDownmenuChange"
          >
          </down-menu>
          <div class="filter" @click="handleFilterClick">
            <span class="text">筛选</span>
            <img src="images/filter.png" />
          </div>
        </div>
      </div>
      <!-- 客户列表 -->
      <div class="content-list" style="height: calc(100vh - 1.98rem)">
        <van-list
          id="custList"
          v-if="customerList.length > 0"
          class="history-list"
          v-model="loading"
          :finished="finished"
          :immediate-check="false"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            class="customer-name"
            v-for="(item, index) in customerList"
            :key="index"
            @click="goToSelf(item)"
          >
            <div class="name">
              <span>{{ item.custNm }}</span>
              <img src="images/custonstatus_go.png" alt="" />
            </div>
            <div class="customer-info">
              <div class="creport">
                <span>账户诊断报告 (共{{ item.data[0].rptCnt }}份)</span>
                <div class="details">
                  <span v-if="item.data[0].eventDuration == 'null'">阅读 0s</span>
                  <span v-else>阅读{{ item.data[0].eventDuration }}s</span>
                  <!-- <span style="margin-left: 0.4rem">转发 0次</span> -->
                </div>
              </div>
              <div class="creport">
                <!-- 没数据先写死 -->
                <span>资产配置建议书 (共0份)</span>

                <!-- <span>资产配置建议书 (共{{ item.data[1].rptCnt }}份)</span> -->
                <div class="details">
                  <span>阅读 0s</span>
                  <!-- <span v-else>阅读{{ item.data[1].eventDuration }}s</span> -->
                  <!-- <span style="margin-left: 0.4rem">转发 0次</span> -->
                </div>
              </div>
            </div>
          </div>
        </van-list>
        <div class="nodata" v-else>
          <div class="noneImg"></div>
          <div class="noneTipText">暂无历史报告</div>
        </div>
      </div>
    </div>

    <van-popup
      class="popup"
      v-model="showFilter"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <search-more
        :show.sync="showFilter"
        :filterCondition="filterCondition"
        :attentionList="attentionList"
        @updateCondition="handleConditionUpdate"
      />
    </van-popup>
  </div>
</template>

<script>
import DownMenu from "ui/downMenu.vue";
import searchMore from "./reportMoreSearch.vue";
// import Search from "ui/home_search.vue";

export default {
  components: { DownMenu, searchMore },
  data() {
    return {
      history: {
        page: 1,
        pageSize: 10,
      },
      upOrDown: true,
      selectTime: {
        startTime: "",
        startTime2: "",
        pushTime: "",
        pushTime2: "",
      },
      filterCondition: {
        assets: [""],
        customer: [""],
        attention: [""],
        risk: [""],
        manager: [], // 客户经理
        mainOrganization: [], // 营业部(主体)
        subOrganization: [], // 营业部(下辖)
      },
      filterConditionCopy: {
        customer: [""],
      },
      assetsList: [
        { name: "不限", value: "" },
        { name: "账户诊断报告", value: 1 },
        { name: "资产配置建议书", value: 2 },
      ],
      attentionList: [
        { name: "不限", value: "" },
        { name: "已推送", value: 1 },
        { name: "未推送", value: 0 },
      ],
      loading: false,
      finished: false,
      customerList: [],
      showFilter: false,
      text: "客户姓名/手机号/资金账号",
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.onLoad();
    });
  },
  created() {
    if (this.$route.query.word == "33") {
      this.text = this.$route.query.keyword;
    } else {
      return this.text;
    }
  },
  mounted() {
    // this.onLoad();
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    //点击搜索框去到搜索页面
    gotosearch() {
      this.$light.navigate(`root/serch?type=3`);
    },
    handleScroll() {
      //为了保证兼容性，这里取两个值，哪个有值取哪一个
      //scrollTop就是触发滚轮事件时滚轮的高度
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 0) {
        document.getElementById("top").style = "position: fixed;top: 0;left: 0;right: 0;";
        document.getElementById("custList").style = "padding-top:1.9rem;";
      } else {
        document.getElementById("top").style = "";
        document.getElementById("custList").style = "";
      }
    },
    timeFormat(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
      let day = time.getDate() >= 10 ? time.getDate() : "0" + time.getDate();
      return year + month + day;
    },
    handleDownmenuChange() {
      this.history.page = 1;
      this.history.pageSize = 10;
      this.onLoad();
    },
    timeSort() {
      //阅读时长排序
      this.upOrDown = !this.upOrDown;
      if (this.upOrDown) {
        //升序
        this.history.page = 1;
        this.history.pageSize = 10;
        this.finished = false;
        this.onLoad();
      } else {
        //降序
        this.history.page = 1;
        this.history.pageSize = 10;
        this.finished = false;
        this.onLoad();
      }
    },
    onLoad() {
      console.log("阅读顺序入参", this.oderTime);
      //加载更多
      this.loading = true;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      console.log("this.filterCondition+:", this.filterCondition);
      let brhNos = this.filterCondition.subOrganization;
      let userIds = this.filterCondition.manager;
      let checkChoose = this.filterCondition.checkChoose;
      let ids = [];
      userIds.forEach((item) => {
        ids.push(item.oaUserId);
      });
      let brNs = [];
      brhNos.forEach((item) => {
        brNs.push(item.brhNo);
      });
      let flag = "";
      if (checkChoose == 0) {
        flag = "0";
      }
      if (checkChoose) {
        if (checkChoose == 1) {
          flag = "1";
        }
      }

      let params = {
        // brhNo: "",
        // createEndTime: this.selectTime.startTime2.replaceAll("-", ""),
        // createStartTime: this.selectTime.startTime.replaceAll("-", ""),
        // oaUserIds: "",
        // pageNum: pageNum,
        // pageSize: pageSize,
        // pushEndTime: this.selectTime.pushTime2.replaceAll("-", ""),
        // pushStartTime: this.selectTime.pushTime.replaceAll("-", ""),
        // pushStatus:
        //   this.filterCondition.attention.length == 1 ? this.filterCondition.attention[0] : "",
        // readingStatus:
        //   this.filterCondition.customer.length == 1 ? this.filterCondition.customer[0] : "",
        // readingTimeOrderType: "2",
        // rptType: this.filterCondition.assets.length == 1 ? this.filterCondition.assets[0] : "",
        // readingTimeOrderType: "2",
        // keyword: this.$route.query.keyword,
        orderType: this.upOrDown ? "2" : "1",
        pushEndTime: this.selectTime.pushTime2.replaceAll("-", ""),
        pushStartTime: this.selectTime.pushTime.replaceAll("-", ""),
        pushStatus:
          this.filterCondition.attention.length == 1 ? this.filterCondition.attention[0] : "",
        readStatus:
          this.filterCondition.customer.length == 1 ? this.filterCondition.customer[0] : "",
        // belongFlag: flag,
        brhNo: brNs.join(","),
        oaUserIds: flag == "1" ? ids.join(",") : "",
        createStartTime: this.selectTime.startTime.replaceAll("-", ""),
        createEndTime: this.selectTime.startTime2.replaceAll("-", ""),
        pageNum: `${this.history.page}`,
        pageSize: `${this.history.pageSize}`,
        rptType:
          this.filterCondition.assets.length == 2
            ? ""
            : this.filterCondition.assets.length == 1 && this.filterCondition.assets[0] == ""
            ? ""
            : this.filterCondition.assets.length == 1 && this.filterCondition.assets[0] == 1
            ? "101"
            : this.filterCondition.assets.length == 1 && this.filterCondition.assets[0] == 2
            ? "201"
            : "",
      };
      console.log("params:", params);
      this.$apiFwgx
        .getHistoryList(params)
        .then((data) => {
          console.log("wsd:", data);
          if (data.data.success) {
            if (this.history.page == 1) {
              this.customerList = data.data.data.rows;
            } else {
              this.customerList = [...this.customerList, ...data.data.data.rows];
            }
          }
          this.history.page += 1;
          if (data.data.data.rows.length < this.history.pageSize) {
            this.finished = true;
          }
          // if (res.data.data) {
          //   if (this.history.page == 1) {
          //     this.customerList = [...res.data.data.rows];
          //     console.log("daatttt", this.customerList);
          //   } else {
          //     this.customerList = [...this.customerList, ...res.data.data.rows];
          //   }
          //   this.history.page += 1;
          //   if (res.data.data.rows.length < this.history.pageSize) {
          //     this.finished = true;
          //   }
          // }
        })
        .finally(() => {
          this.loading = false;
          this.$toast.clear();
        });
    },
    handleFilterClick() {
      this.showFilter = true;
    },
    handleConditionUpdate(condition, tiemData) {
      this.selectTime = tiemData;
      this.filterCondition = condition;
      this.history.page = 1;
      this.history.pageSize = 10;
      this.finished = false;
      this.onLoad();
    },
    // 跳转到个人报告页
    goToSelf(data) {
      this.$light.navigate(
        `root/historyReport/custonHistoryReport?id=${data.custNo}&name=${data.custNm}`,
      );
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="less" scoped>
.customer-page {
  flex-direction: column;
  .customer-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    .search {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 6.91rem;
      height: 0.6rem;
      margin: 0.14rem 0;
      background: #f2f3f5;
      border-radius: 0.12rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.4rem;
      font-size: 0.28rem;
      .text {
        margin-left: 0.2rem;
      }
      img {
        width: 0.25rem;
      }
    }
    .search-box {
      width: 7.5rem;
      background: #ffffff;
      display: flex;
      justify-content: center;
    }
    .search {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 6.91rem;
      height: 0.6rem;
      margin: 0.14rem 0;
      background: #f2f3f5;
      border-radius: 0.12rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.4rem;
      font-size: 0.28rem;
      .text {
        margin-left: 0.2rem;
      }
      img {
        width: 0.25rem;
      }
    }
    .menu {
      align-self: stretch;
      display: flex;
      justify-content: flex-start;
      padding: 0.15rem 0 0.2rem 0.3rem;
      background: #ffffff;
      > div {
        height: 0.54rem;
        margin-right: 0.2rem;
        &:nth-child(1) {
          width: 1.9rem;
        }
        &:nth-child(2) {
          width: 1.65rem;
        }
        &:nth-child(3) {
          width: 1.65rem;
          margin-right: 0;
        }
      }
      .readTime {
        position: relative;
        background: #f2f3f5;
        font-size: 0.26rem;
        font-weight: 400;
        color: #666666;
        .menu-title {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.04rem;
          span {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
          &.active {
            background: rgba(0, 123, 246, 0.03);
            border: 1px solid rgba(0, 123, 246, 0.7);
          }
          img {
            width: 0.14rem;
            margin-left: 0.1rem;
          }
        }
      }
      .assets,
      .customer,
      .attention {
        display: flex;
        flex-wrap: wrap;
        font-size: 0.28rem;
        font-weight: 400;
        text-align: left;
        color: #333333;
        line-height: 0.4rem;
        .item {
          display: flex;
          align-items: center;
          width: 50%;
          img {
            width: 0.18rem;
            margin-left: 0.1rem;
          }
        }
      }
      .assets,
      .customer {
        .item:nth-child(n + 5) {
          margin-bottom: 0;
        }
      }
      .attention {
        .item:nth-child(n + 3) {
          margin-bottom: 0;
        }
      }
      .filter {
        height: auto;
        align-self: center;
        display: flex;
        align-items: center;
        margin-left: auto;
        margin-right: 0;
        padding-right: 0.19rem;
        border-left: 1px solid #e6e6e6;
        .text {
          padding: 0 0.1rem 0 0.24rem;
          font-size: 0.26rem;
          font-weight: 400;
          color: #666666;
          line-height: 0.37rem;
        }
        img {
          width: 0.28rem;
        }
      }
    }
    .content-list {
      overflow-y: auto;
      .history-list {
        padding: 0.2rem;
        background: #f2f3f5;
        .van-list__error-text,
        .van-list__finished-text,
        .van-list__loading {
          margin-top: -0.2rem;
        }
      }
    }
    .customer-name {
      width: 7.1rem;
      // height: 2.56rem;
      // height: 1.86rem;
      margin-bottom: 0.2rem;
      background: #ffffff;
      padding: 0.3rem 0.3rem 0.4rem 0.3rem;
      border-radius: 0.1rem;
      box-sizing: border-box;
      .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.32rem;
        font-weight: 500;
        text-align: left;
        color: #333333;
        line-height: 0.45rem;
        img {
          width: 0.26rem;
          height: 0.26rem;
          margin-right: 0.08rem;
        }
      }
      img {
        height: 0.34rem;
      }
      .risk-level {
        margin: 0 0.15rem;
      }
    }
    .customer-info {
      font-size: 0.28rem;
      font-weight: 400;
      text-align: left;
      color: #333333;
      line-height: 0.4rem;
      .creport {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.3rem;
        .details {
          font-size: 0.28rem;
          font-weight: 400;
          text-align: right;
          color: #999999;
          line-height: 0.4rem;
          // .time {
          //   &::after {
          //     content: "";
          //     display: inline-block;
          //     width: 1px;
          //     height: 0.2rem;
          //     margin: 0 0.1rem;
          //     background: #d8d8d8;
          //   }
          // }
        }
      }
    }
    .account {
      font-size: 0.32rem;
      font-weight: 400;
      text-align: center;
      color: #383838;
      line-height: 0.38rem;
    }
    .nodata {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .noneImg {
        width: 4.4rem;
        height: 2.8rem;
        background: url("../../../images/noneData.png");
        background-size: 100%;
        margin-top: 3.86rem;
      }
      .noneTipText {
        font-size: 0.28rem;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #999999;
        line-height: 0.4rem;
      }
    }
  }
}
</style>
