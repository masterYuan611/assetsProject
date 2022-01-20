<template>
  <div>
    <van-nav-bar left-arrow @click-left="onClickLeft" :border="false">
      <template #left>
        <img src="images/back.png" />
      </template>
    </van-nav-bar>
    <div class="filter-main">
      <div>
        <div class="organTitle first">生成时间</div>
        <div class="selectTime">
          <div class="begin" @click="showbeginDate">{{ tiemData.startTime }}</div>
          <div class="center">-</div>
          <div class="end" @click="showendDate">{{ tiemData.startTime2 }}</div>
        </div>
      </div>
      <!--日期选择弹框-->
      <van-popup v-model="showPickerDate" :close-on-click-overlay="false" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          @cancel="onCancelDate"
          @confirm="onConfirmDate"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
        />
      </van-popup>
      <van-popup v-model="showPickerDate1" :close-on-click-overlay="false" position="bottom">
        <van-datetime-picker
          v-model="currentDate1"
          type="date"
          @cancel="onCancelDate1"
          @confirm="onConfirmDate1"
          :min-date="minDate1"
          :max-date="maxDate1"
          :formatter="formatter"
        />
      </van-popup>
      <div>
        <div class="organTitle">推送时间</div>
        <div class="selectTime">
          <div class="begin" @click="showbeginDate2">{{ tiemData.pushTime }}</div>
          <div class="center">-</div>
          <div class="end" @click="showendDate2">{{ tiemData.pushTime2 }}</div>
        </div>
      </div>
      <!--日期选择弹框-->
      <van-popup v-model="showPickerDate3" :close-on-click-overlay="false" position="bottom">
        <van-datetime-picker
          v-model="currentDate3"
          type="date"
          @cancel="onCancelDate3"
          @confirm="onConfirmDate3"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
        />
      </van-popup>
      <van-popup v-model="showPickerDate4" :close-on-click-overlay="false" position="bottom">
        <van-datetime-picker
          v-model="currentDate4"
          type="date"
          @cancel="onCancelDate4"
          @confirm="onConfirmDate4"
          :min-date="minDate1"
          :max-date="maxDate1"
          :formatter="formatter"
        />
      </van-popup>
      <btn-select-2
        style="margin-top: 0.7rem"
        title="报告类型"
        v-model="condition.assets"
        :isSingle="false"
        :options="assetsList"
      />
      <btn-select-2
        style="margin-top: 0.7rem"
        title="阅读状态"
        v-model="condition.customer"
        :isSingle="false"
        :options="readType"
        :styleOption="{ width: '1.58rem', num: 3 }"
      />
      <btn-select-2
        style="margin-top: 0.7rem"
        title="推送状态"
        v-model="condition.attention"
        :isSingle="false"
        :options="pushType"
        :styleOption="{ width: '1.58rem', num: 3 }"
      />
      <div v-if="this.check == '1'">
        <auto-complete
          v-model="condition.manager"
          style="margin-top: 0.7rem"
          title="服务归属"
          placeholder="员工姓名"
          @cc1="cc1"
          @focus="handleScroll"
        />
        <auto-complete
          v-model="condition.mainOrganization"
          style="margin-top: 0.7rem"
          title="营业机构"
          placeholder="营业部（主体）"
          @focus="handleScroll"
        />
        <auto-complete
          v-model="condition.subOrganization"
          placeholder="营业部（下辖）"
          @focus="handleScroll"
        />
      </div>
    </div>
    <div class="footer-btn" v-if="footerBtn">
      <span class="btn" @click="handleReset">重置</span>
      <span class="btn confirm" @click="handleConfirm">确定</span>
    </div>
  </div>
</template>

<script>
import BtnSelect2 from "ui/btnSelect2.vue";
import AutoComplete from "ui/autoComplete.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    BtnSelect2,
    AutoComplete,
  },
  props: ["show", "filterCondition"],
  data() {
    return {
      roleArr: [],
      check: "",
      checkChoose: "",
      condition: {},
      tiemData: {
        startTime: "",
        startTime2: "",
        pushTime: "",
        pushTime2: "",
      },
      footerBtn: true,
      showPickerDate: false,
      showPickerDate1: false,
      showPickerDate3: false,
      showPickerDate4: false,
      currentDate: new Date(),
      currentDate1: new Date(),
      currentDate3: new Date(),
      currentDate4: new Date(),
      minDate: new Date(2021, 9, 10),
      maxDate: new Date(),
      minDate1: new Date(2021, 9, 10),
      maxDate1: new Date(),
      assetsList: [
        { name: "不限", value: "" },
        { name: "账户诊断报告", value: 1 },
        { name: "资产配置建议书", value: 2 },
      ],
      readType: [
        { name: "不限", value: "" },
        { name: "已读", value: 1 },
        { name: "未读", value: 0 },
      ],
      pushType: [
        { name: "不限", value: "" },
        { name: "已推送", value: 1 },
        { name: "未推送", value: 0 },
      ],
    };
  },
  computed: {
    ...mapGetters(["maxRole", "roleCodes"]),
  },
  mounted() {
    // this.tiemData.startTime2 = this.timeFormat(new Date());
    // this.tiemData.pushTime2 = this.timeFormat(new Date());
  },
  created() {
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
      this.condition.checkChoose = "1";
    } else {
      this.condition.checkChoose = "0";
    }
    // this.condition.checkChoose = this.maxRole == "1001" ? "1" : this.mawxRole == "1002" ? "1" : "0";
  },
  methods: {
    cc1(val) {
      this.cc = val;
      console.log("cc+", val);
      console.log("this.cc++", this.checkChoose);
      this.condition.checkChoose = val;
    },
    timeFormat(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1 > 10 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
      let day = time.getDate() > 10 ? time.getDate() : "0" + time.getDate();
      return year + "-" + month + "-" + day;
    },
    onClickLeft() {
      this.$emit("update:show", false);
    },
    showbeginDate() {
      this.showPickerDate = true;
      this.footerBtn = false;
      this.currentDate = new Date(this.tiemData.startTime);
    },
    showendDate() {
      this.showPickerDate1 = true;
      this.footerBtn = false;
      this.currentDate1 = new Date(this.tiemData.startTime2);
    },
    showbeginDate2() {
      this.showPickerDate3 = true;
    },
    showendDate2() {
      this.showPickerDate4 = true;
    },
    // 日期组件自定义格式
    formatter(type, value) {
      if (type === "year") {
        this.value1 = value; // 可以拿到当前点击的数值
        return `${value}年`;
      } else if (type === "month") {
        this.value2 = value;
        return `${value}月`;
      }
      this.value3 = value;
      return `${value}日`;
    },
    // 生成时间
    onCancelDate() {
      this.showPickerDate = false;
      this.footerBtn = true;
    },
    onConfirmDate() {
      let start = new Date(this.currentDate).getTime();
      let end = new Date(this.tiemData.startTime2).getTime();
      if (start > end) {
        this.$toast({ message: "起始时间不能大于结束时间" });
        setTimeout(() => {
          this.$toast.clear();
        }, 2000);
        return;
      }
      this.tiemData.startTime = `${this.value1}-${this.value2}-${this.value3}`; // 字符串拼接 结果入2020-07-03
      this.onCancelDate();
    },
    onCancelDate1() {
      this.showPickerDate1 = false;
      this.footerBtn = true;
    },
    onConfirmDate1() {
      let start = new Date(this.tiemData.startTime).getTime();
      let end = new Date(this.currentDate1).getTime();
      if (start > end) {
        this.$toast({ message: "结束时间不能小于起始时间" });
        setTimeout(() => {
          this.$toast.clear();
        }, 2000);
        return;
      }
      this.tiemData.startTime2 = `${this.value1}-${this.value2}-${this.value3}`;
      this.onCancelDate1();
    },
    //推送时间
    onCancelDate3() {
      this.showPickerDate3 = false;
    },
    onConfirmDate3() {
      this.tiemData.pushTime = `${this.value1}-${this.value2}-${this.value3}`;
      this.onCancelDate3();
    },
    onCancelDate4() {
      this.showPickerDate4 = false;
    },
    onConfirmDate4() {
      this.tiemData.pushTime2 = `${this.value1}-${this.value2}-${this.value3}`;
      this.onCancelDate4();
    },
    handleConfirm() {
      this.$emit("updateCondition", this.condition, this.tiemData);
      this.$emit("update:show", false);
    },
    handleReset() {
      this.tiemData = {
        startTime: "",
        startTime2: "",
        pushTime: "",
        pushTime2: "",
      };
      this.condition = {
        assets: [""],
        customer: [""],
        attention: [""],
        risk: [""],
        manager: [],
        mainOrganization: [],
        subOrganization: [],
        page: 1,
        pageSize: 10,
      };
    },
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
          this.condition = JSON.parse(JSON.stringify(this.filterCondition));
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  img {
    width: 0.4rem;
  }
}
.filter-main {
  z-index: 1 !important;
  padding: 0.2rem 0.3rem;
  margin-top: 0.88rem;
  overflow-y: auto;
  height: calc(100vh - 2.16rem);
  box-sizing: border-box;
  /deep/ .van-picker__toolbar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  /deep/ .van-picker__toolbar > button {
    color: #007bf6;
  }
  .organTitle {
    font-size: 0.32rem;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 0.45rem;
    margin-top: 0.7rem;
  }
  .first {
    margin-top: 0;
  }
  .selectTime {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .center {
      width: 0.15rem;
      height: 0.33rem;
      font-size: 0.24rem;
      font-weight: 400;
      text-align: center;
      color: #666666;
      line-height: 0.33rem;
      margin-top: 0.3rem;
    }
    .begin,
    .end {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.28rem;
      font-weight: 400;
      text-align: center;
      color: #333333;
      line-height: 0.4rem;
      width: 3.2rem;
      height: 0.6rem;
      background: #f2f3f5;
      border-radius: 0.04rem;
      margin-top: 0.3rem;
    }
  }
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
