<template>
  <div class="customer-page">
    <div class="customer-header" id="searchTop">
      <div class="search" @click="gotosearch">
        <img src="images/search.png" />
        <span class="text">{{ text }}</span>
      </div>
      <!-- 下拉选择 -->
      <div class="menu">
        <!-- 资产排序 -->
        <down-menu
          :isSingle="true"
          :options="assetsList"
          v-model="filterCondition.assets"
          @change="handleDownMenuChange"
        />
        <!-- 客户级别排序 -->
        <down-menu
          ref="customerLevel"
          placeholder="客户级别"
          :isSingle="false"
          :options="customerLevelList"
          v-model="filterConditionCopy.customerLevel"
          @open="handleCustomerCopy"
          @close="handleCustomerCopy"
        >
          <template v-slot="{ selected, active }">
            <div class="customer-level-btn" style="width: 100%">
              <span @click="handleLevelReset">重置</span>
              <span @click="handleLevelConfirm"
                >确定 {{ active ? `(${selected.length})` : "" }}</span
              >
            </div>
          </template>
        </down-menu>
        <!-- 是否关注排序 -->
        <down-menu
          placeholder="关注状态"
          :isSingle="true"
          :options="attentionList"
          v-model="filterCondition.attention"
          @change="handleDownMenuChange"
        />
        <div class="filter" @click="handleFilterClick">
          <span class="text">筛选</span>
          <img src="images/filter.png" />
        </div>
      </div>
    </div>
    <div class="customer-main" style="height: calc(100vh-1.77rem)">
      <!-- 客户列表 -->
      <van-list
        id="custList"
        v-show="customerList.length > 0"
        ref="custList"
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        offset="20"
        finished-text="没有更多了"
        @load="handleDataLoad"
      >
        <van-cell v-for="(item, index) in customerList" :key="index" @click="handleCustClick(item)">
          <template #title>
            <div class="customer-level">
              <span class="name">{{ item.custNm.slice(0, 11) }}</span>
              <span class="name nameSlice">{{ item.custNm.slice(11) }}</span>
              <span class="risk-level" v-if="item.riskLvl === '-'">{{ item.riskLvl }}</span>
              <img
                class="risk-level"
                v-else
                :src="require(`images/${getRiskL(item.riskLvl)}.png`)"
              />
              <img class="customer-level" :src="require(`images/${getCustL(item.custLvl)}.png`)" />
            </div>
          </template>
          <template #label>
            <div class="customer-info">
              <span class="sex">{{ item.custGndr }}</span>
              <span class="age">{{ item.custAge }}岁</span>
              <span v-if="item.custTel" class="phone">{{ item.custTel }}</span>
            </div>
          </template>
          <span class="account">{{ item.totAst }}万</span>
        </van-cell>
      </van-list>
      <div v-if="loading && customerList.length === 0" style="width: 100%">
        <van-skeleton title :row="3" />
        <van-skeleton title :row="3" />
        <van-skeleton title :row="3" />
        <van-skeleton title :row="3" />
        <van-skeleton title :row="3" />
        <van-skeleton title :row="3" />
      </div>
      <div class="empty" v-if="!loading && customerList.length === 0">
        <img src="images/noneData.png" />
        <span>暂无客户数据</span>
      </div>
    </div>
    <!-- 筛选弹框 -->
    <van-popup v-model="showFilter" position="right" :style="{ width: '100%', height: '100%' }">
      <search-more
        :show.sync="showFilter"
        :filterCondition="filterCondition"
        :customerLevelList="customerLevelList"
        :attentionList="attentionList"
        @updateCondition="handleConditionUpdate"
      />
    </van-popup>
    <!-- 客户四要素检查 -->
    <Dialog ref="myDialog"></Dialog>
  </div>
</template>

<script>
import Dialog from "../../../ui/dialog.vue";
import DownMenu from "ui/downMenu.vue";
import searchMore from "./serchMore.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: { DownMenu, searchMore, Dialog },
  data() {
    return {
      // maxRoles: "",
      //搜索带过来的参数
      text: "客户姓名/手机号/资金账号",
      pageNum: "",
      pageSize: "",
      // 搜索条件
      filterCondition: {
        // cc: this.maxRoles,
        // cc: "",
        assets: [1], // 资产
        customerLevel: [""], // 客户级别
        attention: [""], // 关注状态
        risk: [""], // 风险等级
        manager: [], // 客户经理
        mainOrganization: [], // 营业部(主体)
        subOrganization: [], // 营业部(下辖)
        page: 1,
        pageSize: 10,
      },
      filterConditionCopy: {
        customerLevel: [""],
      },
      assetsList: [
        { name: "总资产降序", value: 1 },
        { name: "总资产升序", value: 2 },
        { name: "近三月盈亏降序", value: 3 },
        { name: "近三月盈亏升序", value: 4 },
        { name: "当日盈亏降序", value: 5 },
        { name: "当日盈亏升序", value: 6 },
      ],
      customerLevelList: [
        { name: "不限", value: "" },
        { name: "钻石", value: "钻石" },
        { name: "白金", value: "白金" },
        { name: "金卡", value: "金卡" },
        { name: "银卡", value: "银卡" },
      ],
      attentionList: [
        { name: "不限", value: "" },
        { name: "已关注", value: "1" },
        { name: "未关注", value: "0" },
      ],
      loading: false,
      finished: false,
      customerList: [], // 客户列表
      showFilter: false, // 搜索弹窗是否显示
      showTip: false,
    };
  },
  computed: {
    ...mapGetters(["isInvestmentAdvisor", "maxRole"]),
    type() {
      return this.$route.query.type;
    },
  },
  created() {
    console.log("+++:", this.maxRole);
    // this.filterCondition.cc = this.maxRole == "1001" ? "1" : this.mawxRole == "1002" ? "1" : "0";
    // this.maxRoles = this.maxRole;
    // this.handleDataLoad();
    console.log(this.$route.query.type);
    if (this.$route.query.word == "11") {
      this.text = this.$route.query.keyword;
    } else if (this.$route.query.word == "22") {
      this.text = this.$route.query.keyword;
    } else {
      return this.text;
    }
  },
  mounted() {
    // this.handleDataLoad();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.path.includes("customerDetail") || from.path.includes("selectChapter")) {
        if (sessionStorage.getItem("filterCondition")) {
          vm.filterCondition = JSON.parse(sessionStorage.getItem("filterCondition"));
          vm.handleCustomerCopy();
        }
      }
      //假如是搜索带过来的数据就先执行第一个方法
      // if (vm.$route.query.type == "6") {
      //   vm.handleSerch();
      // } else {
      //   vm.handleDataLoad();
      // }
      vm.handleDataLoad();
    });
  },
  methods: {
    //拿到搜索页面给的数据
    handleSerch() {
      this.loading = true;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.pageNum = 1;
      this.pageSize = 10;
      let { customerLevel, attention, risk, assets, cc } = this.filterCondition;
      let flag = cc == 1 ? "1" : "0";
      let orderType = [2, 4, 6].includes(assets[0]) ? "1" : "2";
      let orderMode = [1, 2].includes(assets[0]) ? "1" : [3, 4].includes(assets[0]) ? "2" : "3";
      let userIds = this.filterCondition.manager;
      let brhNos = this.filterCondition.subOrganization;
      let brNs = [];
      let ids = [];
      brhNos.forEach((item) => {
        brNs.push(item.brhNo);
      });
      userIds.forEach((item) => {
        ids.push(item.oaUserId);
      });
      this.$apiFwgx
        .getUserDetailList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          keyword: this.$route.query.keyword,
          orderType,
          orderMode,
          belongFlag: flag,
          oaUserIds: userIds.join(","),
          brhNo: brNs.join(","),
          custLvl: customerLevel.join(","),
          follow: attention[0],
          riskLvl: risk.join(","),
        })
        .then((data) => {
          console.log("搜索数据1", data);
          this.finished = false;
          this.customerList = data.data.data.rows;
          if (data.data.data.rows.length < 10) {
            this.finished = true;
          }
        })
        .finally(() => {
          this.loading = false;
          this.$toast.clear();
        });
    },
    ...mapMutations("proposal", ["setCustNo", "setCustNm", "setCustTel"]),
    handleScroll() {
      //为了保证兼容性，这里取两个值，哪个有值取哪一个
      //scrollTop就是触发滚轮事件时滚轮的高度
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 0) {
        document.getElementById("searchTop").style =
          "position: fixed;top: 0;left: 0;right: 0;z-index:1;";
        document.getElementById("custList").style = "padding-top:1.9rem;";
      } else {
        document.getElementById("searchTop").style = "";
        document.getElementById("custList").style = "";
      }
    },
    getCustL(custLvl) {
      if (custLvl === "白金") {
        return "customer_level2";
      } else if (custLvl === "钻石") {
        return "customer_level1";
      } else if (custLvl === "金卡") {
        return "customer_level3";
      } else {
        return "customer_level4";
      }
    },
    getRiskL(riskLvl) {
      if (riskLvl === "C1") {
        return "risk1";
      } else if (riskLvl === "C2") {
        return "risk2";
      } else if (riskLvl === "C3") {
        return "risk3";
      } else if (riskLvl === "C4") {
        return "risk4";
      } else {
        return "risk5";
      }
    },
    async handleCustClick(item) {
      sessionStorage.setItem("custNo", item.custNo);
      if (this.type === "1" || this.$route.query.word == "11") {
        this.$router.push(`/root/customerDetail`);
      } else if (this.type === "2" || this.$route.query.word == "22") {
        //root/assetAllocationProposal/selectChapter
        this.setCustNo(item.custNo);
        this.setCustNm(item.custNm);
        this.setCustTel(item.custTel);
        const flag = await this.getRiskAssessment(item.custNo);
        if (!flag) return;
        this.handleCustomElementcheck(item.custNo);
      }
    },
    // 查看客户风险评测信息
    getRiskAssessment(custNo) {
      return this.$apiFwgx.getRiskAssessment({ custNo }).then(({ data }) => {
        if (data.success) {
          const { userRiskAssessmentStatus, riskLvl2 } = data.data;
          if (riskLvl2 === "C1") {
            this.$toast.fail({
              message: "C1级别的客户不可提供资产配置建议书",
              duration: 2000,
            });
            return;
          }
          if (!userRiskAssessmentStatus) {
            this.$toast.fail({
              message: "客户未做风险测评或已过期，无法生成资产配置建议书",
              duration: 2000,
            });
            return;
          }
          return true;
        }
      });
    },
    // 客户四要素检查
    handleCustomElementcheck(custNo) {
      if (!this.isInvestmentAdvisor) {
        this.$apiFwgx.customElementcheck({ custNo }).then(({ data }) => {
          const res = data.data;
          if (!res.result && res.msg) {
            this.$toast.fail({
              message: res.msg,
              duration: 2000,
            });
            return;
          }
          if (!res.result) {
            let checkInfos = [];
            checkInfos.push(
              res.riskLevelCheck,
              res.investTermCheck,
              res.investKindCheck,
              res.incomeTypeCheck,
            );
            return this.$refs.myDialog.show(checkInfos);
          }
          this.$router.push("/root/assetAllocationProposal/selectChapter");
        });
        return;
      }
      this.$router.push("/root/assetAllocationProposal/selectChapter");
    },
    handleDownMenuChange() {
      this.$refs.custList.$el.scrollTo(0, 0);
      this.filterCondition.page = 1;
      this.finished = false;
      this.handleDataLoad();
      sessionStorage.setItem("filterCondition", JSON.stringify(this.filterCondition));
    },
    //点击搜索框去到搜索页面
    gotosearch() {
      this.$light.navigate(`root/serch?type=${this.$route.query.type}`);
    },
    onClickLeft() {
      // this.$router.go(-1);
      this.$light.navigate("root/home");
      sessionStorage.removeItem("filterCondition");
    },
    // 客户级别下拉菜单使用复制数据
    handleCustomerCopy() {
      this.filterConditionCopy.customerLevel = JSON.parse(
        JSON.stringify(this.filterCondition.customerLevel),
      );
    },
    handleLevelReset() {
      this.filterConditionCopy.customerLevel = [""];
    },
    // 客户级别条件确认
    handleLevelConfirm() {
      this.$refs.customerLevel.handleClose();
      this.filterCondition.customerLevel = JSON.parse(
        JSON.stringify(this.filterConditionCopy.customerLevel),
      );
      this.handleDownMenuChange();
    },
    handleFilterClick() {
      this.showFilter = true;
    },
    // 通过搜索弹窗更新条件
    handleConditionUpdate(condition) {
      this.filterCondition = condition;
      this.handleCustomerCopy();
      this.handleDownMenuChange();
    },
    // todo下拉加载
    handleDataLoad() {
      //假如是搜索页面带来的数据
      if (this.$route.query.word == "11" || this.$route.query.word == "22") {
        console.log("saa++", this.pageNum, this.pageSize, this.$route.query.keyword);
        this.loading = true;
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });
        let { customerLevel, attention, risk, page, pageSize, cc } = this.filterCondition;
        console.log("this.filterCondition22:", this.filterCondition);
        let flag = "";
        if (cc == 0) {
          flag = "0";
        }
        if (cc) {
          if (cc == 1) {
            flag = "1";
          }
        }
        let userIds = this.filterCondition.manager;
        let brhNos = this.filterCondition.subOrganization;
        let brNs = [];
        let ids = [];
        brhNos.forEach((item) => {
          brNs.push(item.brhNo);
        });
        userIds.forEach((item) => {
          ids.push(item.oaUserId);
        });
        let params = {
          belongFlag: flag,
          oaUserIds: flag == "1" ? ids.join(",") : "",
          brhNo: brNs.join(","),
          custLvl: customerLevel.join(","),
          follow: attention[0],
          riskLvl: risk.join(","),
          pageNum: `${page}`,
          pageSize: `${pageSize}`,
          keyword: this.$route.query.keyword,
          orderType: "2",
          orderMode: "1",
        };
        console.log("paramsparams:", params);
        this.$apiFwgx
          .getUserDetailList(params)
          .then((data) => {
            console.log("搜索数据2", data);
            // let dArr = [];
            if (data.data.success) {
              // dArr = data.data.data.rows;
              // dArr.forEach((item) => {
              //   this.customerList.push(item);
              // });
              if (this.filterCondition.page == 1) {
                this.customerList = data.data.data.rows;
              } else {
                this.customerList = [...this.customerList, ...data.data.data.rows];
              }
            }
            this.filterCondition.page += 1;
            if (data.data.data.rows.length < this.filterCondition.pageSize) {
              this.finished = true;
            }
          })
          .finally(() => {
            this.loading = false;
            this.$toast.clear();
          });
      } else {
        //从首页进来的数据
        // console.log("this.$store.getters.maxRole === 1001:", this.$store.getters.maxRole);
        this.loading = true;
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });
        console.log("this.filterCondition:", this.filterCondition);
        let { customerLevel, attention, risk, assets, page, pageSize, cc } = this.filterCondition;
        let flag = "";
        if (cc == 0) {
          flag = "0";
        }
        if (cc) {
          if (cc == 1) {
            flag = "1";
          }
        }
        // let flag = cc == cc ? cc==1?"1" : "0";
        let orderType = [2, 4, 6].includes(assets[0]) ? "1" : "2";
        let orderMode = [1, 2].includes(assets[0]) ? "1" : [3, 4].includes(assets[0]) ? "2" : "3";
        let userIds = this.filterCondition.manager;
        let brhNos = this.filterCondition.subOrganization;
        let brNs = [];
        let ids = [];
        brhNos.forEach((item) => {
          brNs.push(item.brhNo);
        });
        userIds.forEach((item) => {
          ids.push(item.oaUserId);
        });
        console.log("ids:", ids);
        let params = {
          belongFlag: flag,
          oaUserIds: flag == "1" ? ids.join(",") : "",
          mainBrhNo: "", //主体筛选的编号
          brhNo: brNs.join(","), //下瞎筛选的编号
          custLvl: customerLevel.join(","),
          follow: attention[0],
          riskLvl: risk.join(","),
          orderType,
          orderMode,
          pageNum: `${page}`,
          pageSize: `${pageSize}`,
        };
        console.log("parm:", JSON.stringify(params));
        this.$apiFwgx
          .getUserDetailList(params)
          .then(({ data }) => {
            console.log("daaaat:", data);
            if (data.success) {
              let { data: result } = data;
              if (this.filterCondition.page == 1) {
                this.customerList = [...result.rows];
              } else {
                this.customerList = [...this.customerList, ...result.rows];
              }
              this.filterCondition.page += 1;
              if (result.rows.length < this.filterCondition.pageSize) {
                this.finished = true;
              }
            }
          })
          .finally(() => {
            this.loading = false;
            this.$toast.clear();
          });
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar {
  width: 100%;
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
/deep/ .van-cell__label {
  margin-top: 0.03rem;
}
/deep/ .van-skeleton {
  width: 100%;
  padding: 0;
  .van-skeleton__content {
    padding: 0.35rem 0.27rem 0.3rem 0.3rem;
  }
}

.customer-page {
  .customer-header {
    // height: 2.66rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
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
      .customer-level-btn {
        display: flex;
        justify-content: space-between;
        margin-top: 0.3rem;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 3.25rem;
          height: 0.69rem;
          background: #ffffff;
          border: 1px solid #cccccc;
          border-radius: 0.46rem;
          font-size: 0.28rem;
          font-weight: 400;
          text-align: center;
          color: #333333;
          &:last-child {
            font-weight: 500;
            color: #ffffff;
            border: none;
            height: 0.72rem;
            background: linear-gradient(90deg, #00aff6, #007bf6);
          }
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
  }
  .customer-main {
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 3.86rem;
      img {
        width: 4.4rem;
        height: 2.8rem;
      }
      span {
        font-size: 0.28rem;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #999999;
        line-height: 0.4rem;
      }
    }
    /deep/ .van-list {
      align-self: stretch;
      background-color: #f2f3f5;
    }
    /deep/ .van-cell {
      max-height: 2.1rem;
      padding: 0.35rem 0.27rem 0.3rem 0.3rem;
      .van-cell__value {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 3;
      }
      .van-cell__title {
        flex: 5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .customer-level {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .name {
          font-size: 0.36rem;
          font-weight: 400;
          text-align: center;
          color: #333333;
          line-height: 0.6rem;
          margin-right: 0.05rem;
        }
        .nameSlice {
          display: inline-block;
          max-width: 1.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        img {
          height: 0.34rem;
        }
        .risk-level {
          margin-right: 0.15rem;
        }
      }
      .customer-info {
        font-size: 0.28rem;
        font-weight: 400;
        text-align: left;
        color: #999999;
        line-height: 0.4rem;
        .age {
          display: inline-flex;
          align-items: center;
          margin-left: 0.15rem;
          &:before {
            content: "";
            display: block;
            width: 1px;
            height: 0.2rem;
            margin-right: 0.15rem;
            background: #d8d8d8;
          }
        }
        .phone {
          &::before {
            content: "";
            display: inline-block;
            width: 1px;
            height: 0.2rem;
            margin-left: 0.1rem;
            margin-right: 0.15rem;
            background: #d8d8d8;
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
    }
  }
  .riskTip {
    width: 6rem;
    border-radius: 0.08rem;
    padding-left: 0.4rem;
    padding-right: 0.3rem;
    .tip {
      font-size: 0.28rem;
      height: 0.84rem;
      line-height: 0.42rem;
      color: #666;
      font-weight: 400;
      margin: 0.4rem 0;
    }
  }
}
</style>
