<template>
  <div>
    <van-nav-bar left-arrow @click-left="onClickLeft" :border="false">
      <template #left>
        <img src="images/back.png" />
      </template>
    </van-nav-bar>
    <div class="filter-main" ref="fitlerMain">
      <!-- 资产盈亏、客户级别、关注状态、风险等级  -->
      <btn-select
        v-for="(item, index) in btnSelectList"
        :key="index"
        :style="item.style"
        :title="item.title"
        :isSingle="item.isSingle"
        :options="$data[`${item.key}List`] || $props[`${item.key}List`]"
        :styleOption="item.styleOption"
        v-model="condition[item.key]"
      />
      <div v-if="this.check == '1'">
        <auto-complete
          v-model="condition.manager"
          :notice="author1"
          style="margin-top: 0.7rem"
          title="服务归属"
          placeholder="员工姓名"
          @cc1="cc1"
          @inputData="inputData"
          @focus="handleScroll"
        />
        <auto-complete
          :notice="author2"
          v-model="condition.mainOrganization"
          style="margin-top: 0.7rem"
          title="营业机构"
          placeholder="营业部（主体）"
          @inputData2="inputData2"
          @mainSelect="mainSelect"
          @mainDelearr="mainDelearr"
          @focus="handleScroll"
        />
        <auto-complete
          v-model="condition.subOrganization"
          :notice="author3"
          placeholder="营业部（下辖）"
          @inputData3="inputData3"
          @lowSelect="lowSelect"
          @focus="handleScroll"
          v-bind:mainSelectList="mainSelectList"
          v-bind:mainDeleLsit="mainDeleLsit"
        />
      </div>
    </div>
    <!-- <child :notice="author" @inputData="inputData"></child> -->
    <div class="footer-btn">
      <span class="btn" @click="handleReset">重置</span>
      <span class="btn confirm" @click="handleConfirm">确定</span>
    </div>
  </div>
</template>

<script>
import BtnSelect from "ui/btnSelect.vue";
import AutoComplete from "ui/autoComplete.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    BtnSelect,
    AutoComplete,
  },
  props: ["show", "filterCondition", "customerLevelList", "attentionList"],
  data() {
    return {
      check: "",
      roleArr: [],
      mainSelectList: [], //主体选择得值
      mainDeleLsit: [], //主体删除的值
      lowSelectList: [],
      cc: "",
      author1: [],
      author2: [],
      author3: [],
      condition: {},
      assetsList: [
        { name: "总资产降序", value: 1 },
        { name: "总资产升序", value: 2 },
        { name: "近三月盈亏降序", value: 3 },
        { name: "近三月盈亏升序", value: 4 },
        { name: "当日盈亏降序", value: 5 },
        { name: "当日盈亏升序", value: 6 },
      ],
      riskList: [
        { name: "不限", value: "" },
        { name: "C1", value: "C1" },
        { name: "C2", value: "C2" },
        { name: "C3", value: "C3" },
        { name: "C4", value: "C4" },
        { name: "C5", value: "C5" },
      ],
      // 资产盈亏、客户级别、关注状态、风险等级组件选项
      btnSelectList: [
        {
          title: "资产盈亏",
          key: "assets",
          isSingle: true,
          styleOption: { width: "3.35rem", num: 2 },
        },
        {
          title: "客户级别",
          key: "customerLevel",
          isSingle: false,
          style: {
            marginTop: "0.7rem",
          },
          styleOption: { width: "1.58rem", num: 4 },
        },
        {
          title: "关注状态",
          key: "attention",
          isSingle: true,
          style: {
            marginTop: "0.7rem",
          },
          styleOption: { width: "1.58rem", num: 4 },
        },
        {
          title: "风险等级",
          key: "risk",
          isSingle: false,
          style: {
            marginTop: "0.7rem",
          },
          styleOption: { width: "1.58rem", num: 4 },
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["maxRole", "roleCodes"]),
  },
  created() {
    console.log("打印maxRole", this.maxRole, "++r:", this.roleCodes);
    this.roleCodes.forEach((item) => {
      this.roleArr.push(item);
      // this.roleArr.push(Object.values(item)[0]);
    });
    console.log("roleArr++", this.roleArr);
    let biaoshi = this.roleArr.findIndex((item) => {
      return item == "1001";
    });
    if (biaoshi != -1) {
      this.check = "1";
      this.condition.cc = "1";
    } else {
      this.condition.cc = "0";
    }
    // this.condition.cc = this.maxRole == "1001" ? "1" : this.mawxRole == "1002" ? "1" : "0";
    // this.checkChoose = this.maxRole == "1001" ? "1" : this.mawxRole == "1002" ? "1" : "0";
    // console.log("this.checkChoose:", this.checkChoose);
  },
  methods: {
    cc1(val) {
      this.cc = val;
      console.log("cc+", val);
      console.log("this.cc++", this.cc);
      this.condition.cc = val;
    },
    inputData(val) {
      this.author1 = val;
      console.log("hhh1+", val);
      console.log("this.author++", this.author1);
    },
    inputData2(val) {
      this.author2 = val;
      console.log("hhh2+", val);
      console.log("this.author2++", this.author2);
    },
    //主体选择的值
    mainSelect(val) {
      this.mainSelectList = val;
      console.log("mainSelect", this.mainSelectList);
    },
    //主体删除的值
    mainDelearr(val) {
      this.mainDeleLsit = val;
      console.log("告诉筛选页面主体删了哪些值", this.mainDeleLsit);
    },
    //下辖选择的值
    lowSelect(val) {
      this.lowSelectList = val;
      console.log("lowSelect", this.lowSelectList);
    },
    inputData3(val) {
      this.author3 = val;
      console.log("hhh3+", val);
      console.log("this.author3++", this.author3);
    },
    onClickLeft() {
      this.$emit("update:show", false);
    },
    // 确认
    handleConfirm() {
      console.log("waa:", this.condition);
      this.$emit("updateCondition", this.condition);
      this.$emit("update:show", false);
    },
    // 重置
    handleReset() {
      this.condition = {
        assets: [1],
        customerLevel: [""],
        attention: [""],
        risk: [""],
        manager: [],
        mainOrganization: [],
        subOrganization: [],
        page: 1,
        pageSize: 10,
      };
      console.log("this.condition:", this.condition);
      this.$emit("updateCondition", this.condition);
      this.$emit("update:show", false);
    },
    // 下拉搜索弹框显示时位置优化
    handleScroll(top) {
      setTimeout(() => {
        this.$refs.fitlerMain.scrollTo({ top });
      }, 300);
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(val) {
        if (val) {
          // 拷贝搜索条件
          this.condition = JSON.parse(JSON.stringify(this.filterCondition));
        }
      },
    },
    "condition.mainOrganization": {
      handler(val, oldvalue) {
        let deleteItem;
        if (val.length < oldvalue.length) {
          oldvalue.forEach((item) => {
            if (!val.includes(item)) {
              deleteItem = item;
            }
          });
        }
        if (deleteItem) {
          this.condition.subOrganization = this.condition.subOrganization.filter(
            (item) => item.mainBrhNo !== deleteItem.mainBrhNo,
          );
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar {
  .van-nav-bar__content {
    height: 0.88rem;
  }
  img {
    width: 0.4rem;
  }
}
.filter-main {
  padding: 0.2rem 0.3rem;
  position: absolute;
  top: 0.88rem;
  bottom: 1.5rem;
  left: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1 !important;
}
.footer-btn {
  z-index: 11 !important;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1.3rem;
  padding: 0 0.3rem 0.3rem;
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.1);
  padding-bottom: env(safe-area-inset-bottom);
  .btn {
    position: relative;
    width: 3.25rem;
    height: 0.69rem;
    font-size: 0.28rem;
    font-weight: 400;
    text-align: center;
    line-height: 0.7rem;
    color: #333333;
    &.confirm {
      background: linear-gradient(90deg, #00aff6, #007bf6);
      color: #ffffff;
      border: none;
      height: 0.72rem;
      border-radius: 0.42rem;
      &::before {
        display: none;
      }
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(0.5);
      transform-origin: left top;
      box-sizing: border-box;
      border: 1px solid #cccccc;
      border-radius: 0.92rem;
    }
  }
}
</style>
