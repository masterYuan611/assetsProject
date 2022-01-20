<template>
  <div class="auto-complete" ref="autoComplete">
    <div ref="title" class="auto-complete-title">
      <slot name="title">
        <span>{{ title }}</span
        ><span
          style="font-size: 0.28rem; font-weight: 500; color: #333333"
          v-if="title == '服务归属'"
          >（仅支持筛选本营业部员工）</span
        >
      </slot>
    </div>
    <!-- 单选按钮 -->
    <div v-if="title == '服务归属' && this.$route.query.type != 3" class="radio">
      <!-- <input type="radio" id="male" value="1" v-model="gender" style="margin-right: 0.2rem" /><span
        >按归属关系筛选</span
      >
      <input type="radio" id="female" value="0" v-model="gender" style="margin-left: 0.6rem" />
      <span style="margin-left: 0.1rem">无归属关系</span> -->
      <van-radio-group v-model="gender" direction="horizontal">
        <van-radio @click="cc1()" name="1" style="margin-right: 0.2rem">按归属关系筛选</van-radio>
        <van-radio @click="cc2()" name="0" style="margin-left: 0.6rem">无归属关系</van-radio>
      </van-radio-group>
    </div>

    <!-- 服务归属搜索列表 -->
    <form action="/" style="display: block" v-if="title == '服务归属' && gender == '1'">
      <van-search
        ref="search"
        v-model="keyword"
        :placeholder="placeholder"
        clearable
        @focus="handleFocus"
        @blur="handleBlur"
        @search="searchServe"
        @input="inputServe"
      >
        <template #left-icon><img src="images/search.png" /></template>
      </van-search>
    </form>
    <div class="selected-list" v-if="title == '服务归属' && gender == '1'">
      <div class="selected-item" v-for="(item, index) in value" :key="index">
        <span class="selected-item-title">{{ item.oaUserName }}</span>
        <img src="images/delete.png" @click="handleItemDelete(item)" />
      </div>
    </div>
    <!-- 有数据时 -->
    <div
      class="match-list"
      :style="matchListStyle"
      v-show="showmatchdata"
      v-if="title == '服务归属' && keyword"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoadServe"
      >
        <div
          class="match-item"
          v-for="(item, index) in matchList"
          :key="index"
          @click="handleItemClick(item)"
        >
          <!-- <span class="match-item-title" v-html="getTitle(item.title)"></span> -->
          <span class="match-item-title" v-html="getTitle(item.oaUserName)"></span>
          <span class="match-item-desc">({{ item.brhNo }}/{{ item.brhName }})</span>
        </div>
      </van-list>
    </div>

    <!-- 无数据时 -->
    <div class="no-math" v-show="Nomatchdata" v-if="title == '服务归属'">
      <div class="nomatch-image">
        <!-- <img src="images/noseacrch.png" alt="" /> -->
      </div>
      <div class="text">没有匹配的客户</div>
    </div>
    <!-- 营业部（主体） -->
    <form action="/" style="display: block" v-if="title == '营业机构'">
      <van-search
        ref="search"
        v-model="keyword"
        :placeholder="placeholder"
        clearable
        @focus="handleFocus"
        @blur="handleBlur"
        @search="searchMain"
        @input="inputMain"
      >
        <template #left-icon><img src="images/search.png" /></template>
      </van-search>
    </form>
    <div class="selected-list" v-if="title == '营业机构'">
      <div class="selected-item" v-for="(item, index) in value" :key="index">
        <span class="selected-item-title">{{ item.mainBrhAbbr }}</span>
        <img src="images/delete.png" @click="handleItemDelete2(item)" />
      </div>
    </div>
    <!-- 营业主体有数据时 -->
    <div
      class="match-list"
      :style="matchListStyle"
      v-show="showMain"
      v-if="title == '营业机构' && keyword"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoadMain"
      >
        <div
          class="match-item"
          v-for="(item, index) in matchList2"
          :key="index"
          @click="handleItemClick2(item)"
        >
          <!-- <span class="match-item-title" v-html="getName(item.oaUserName)"></span>
          <span class="match-item-desc">({{ item.brhName }})</span> -->
          <span class="match-item-title" v-html="getName(item.mainBrhAbbr)"></span>
          <span class="match-item-desc">({{ item.mainBrhName }})</span>
        </div>
      </van-list>
    </div>
    <!-- 营业部无数据时 -->
    <div class="no-math" v-show="Nomatchdata" v-if="title == '营业机构'">
      <div class="nomatch-image">
        <!-- <img src="images/noseacrch.png" alt="" /> -->
      </div>
      <div class="text">没有匹配的客户</div>
    </div>
    <!-- 营业部（下辖） -->
    <form action="/" style="display: block" v-if="!title">
      <van-search
        ref="search"
        v-model="keyword"
        :placeholder="placeholder"
        :mainSelectList="mainSelectList"
        :mainDeleLsit="mainDeleLsit"
        clearable
        @focus="handleFocus"
        @blur="handleBlur"
        @search="searchLow"
        @input="inputLow"
      >
        <template #left-icon><img src="images/search.png" /></template>
      </van-search>
    </form>
    <div class="selected-list" v-if="!title">
      <div class="selected-item" v-for="(item, index) in value" :key="index">
        <span class="selected-item-title">{{ item.brhNo }}/{{ item.brhName }}</span>
        <img src="images/delete.png" @click="handleItemDelete3(item)" />
      </div>
    </div>
    <!-- 下辖有数据 -->
    <div class="match-list" :style="matchListStyle" v-show="showLow" v-if="!title && keyword">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoadLow">
        <div
          class="match-item"
          v-for="(item, index) in matchList3"
          :key="index"
          @click="handleItemClick3(item)"
        >
          <!-- <span class="match-item-title" v-html="getTitleLow(item.brhNo)"></span>
          <span class="match-item-desc">({{ item.brhName }})</span> -->
          <span class="match-item-title" v-html="getNo(item.brhNo)" style="margin-right: 0"></span>
          <span class="match-item-desc" v-html="getbrhName(item.brhName)">/</span>
        </div>
      </van-list>
    </div>
    <!-- 营业部下辖无数据时 -->
    <div class="no-math" v-show="Nomatchdata" v-if="!title">
      <div class="nomatch-image">
        <!-- <img src="images/noseacrch.png" alt="" /> -->
      </div>
      <div class="text">没有匹配的客户</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 块标题
    title: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: Array,
      default: () => [],
    },
    mainSelectList: {
      type: Array,
      default: () => [],
    },
    mainDeleLsit: {
      type: Array,
      default: () => [],
    },
    income: {
      type: String,
    },
  },
  data() {
    return {
      cc: "",
      gender: "1",
      keyword: "",
      isFocused: false,
      newArray: [],
      lowArray: [],
      matchList: [],
      matchList2: [],
      matchList3: [],
      // matchList: [
      //   { title: "陈玉龙1", desc: "7314/桂林临桂区荔柳路证券营业部", id: 1 },
      //   { title: "陈玉龙2", desc: "7314/桂林临桂区荔柳路证券营业部", id: 2 },
      //   { title: "陈玉龙3", desc: "7314/桂林临桂区荔柳路证券营业部", id: 3 },
      //   { title: "陈玉龙4", desc: "7314/桂林临桂区荔柳路证券营业部", id: 4 },
      //   { title: "陈玉龙5", desc: "7314/桂林临桂区荔柳路证券营业部", id: 5 },
      //   { title: "陈玉龙6", desc: "7314/桂林临桂区荔柳路证券营业部", id: 6 },
      //   { title: "陈玉龙7", desc: "7314/桂林临桂区荔柳路证券营业部", id: 7 },
      //   { title: "陈玉龙8", desc: "7314/桂林临桂区荔柳路证券营业部", id: 8 },
      //   { title: "陈玉龙9", desc: "7314/桂林临桂区荔柳路证券营业部", id: 9 },
      // ],
      // 下拉框位置
      matchListStyle: {
        top: 0,
      },
      page: 1,
      pageSize: 10,
      page2: 1,
      pageSize2: 10,
      loading: false,
      finished: false,
      Nomatchdata: false, //无匹配结果
      showmatchdata: false, //有匹配结果
      showMain: false, //主体无结果
      showLow: false, //下辖无结果
    };
  },
  created() {
    console.log("income", this.income);
  },
  mounted() {
    let title = this.$refs.title.getBoundingClientRect();
    let search = this.$refs.search.getBoundingClientRect();
    this.matchListStyle = { top: search.bottom - title.top + "px" };
  },
  methods: {
    cc1() {
      this.$emit("cc1", 1);
    },
    cc2() {
      this.$emit("cc1", 0);
    },
    //服务归属搜索列表
    getServeList() {
      this.$apiFwgx
        .getsubordinatemanager({
          keyword: this.keyword,
          pageNum: 1,
          pageSize: this.pageSize,
        })
        .then((data) => {
          console.log("getServeList", data);
          if (data.data.data.rows.length == 0) {
            this.Nomatchdata = true;
            this.showmatchdata = false;
          } else {
            this.finished = false;
            this.matchList = data.data.data.rows;
            if (data.data.data.rows.length < 10) {
              this.finished = true;
            }
            this.showmatchdata = true;
          }
        });
    },
    //下拉加载归属服务列表数据

    onLoadServe() {
      // 异步更新数据

      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        this.$apiFwgx
          .getsubordinatemanager({
            keyword: this.keyword,
            pageSize: 10,
            pageNum: (this.page += 1),
          })
          .then((data) => {
            console.log("下拉加载", data);
            if (data.data.data.rows.length != 0) {
              let arr = data.data.data.rows;
              arr.forEach((item) => {
                this.matchList.push(item);
              });
            } else {
              this.finished = true;
            }
            this.loading = false;
          });
      }, 500);
    },
    //特殊字符处理
    isEmoji(val) {
      const emojiRe =
        /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/i;
      return emojiRe.test(val);
    },
    inputServe() {
      if (!this.keyword) {
        this.showmatchdata = true;
        this.Nomatchdata = false;
      }
      if ((this.keyword.trim() == "" && this.keyword.length > 0) || this.isEmoji(this.keyword)) {
        this.Nomatchdata = true;
        return;
      } else {
        //实时输入后500毫秒之后再请求模糊匹配接口
        setTimeout(() => {
          this.getServeList();
        }, 200);
      }
    },
    searchServe() {
      if (!this.keyword) {
        this.showmatchdata = true;
        this.Nomatchdata = false;
      }
      if ((this.keyword.trim() == "" && this.keyword.length > 0) || this.isEmoji(this.keyword)) {
        this.Nomatchdata = true;
        return;
      } else {
        //实时输入后500毫秒之后再请求模糊匹配接口
        setTimeout(() => {
          this.getServeList();
        }, 200);
      }
    },

    //取主体公司列表
    getMainList() {
      this.$apiFwgx
        .getmaincompany({
          keyword: this.keyword,
          pageNum: 1,
          pageSize: this.pageSize2,
        })
        .then((data) => {
          console.log("取主体公司列表", data, this.keyword, this.page, this.pageSize);
          if (data.data.data.rows.length == 0) {
            this.showMain = false;
            this.Nomatchdata = true;
          } else {
            this.finished = false;
            this.matchList2 = data.data.data.rows;
            if (data.data.data.rows.length < 10) {
              this.finished = true;
            }
            this.showMain = true;
            this.Nomatchdata = false;
          }
        });
    },

    inputMain() {
      // setTimeout(() => {
      //   this.getMainList();
      // }, 200);
      if (!this.keyword) {
        this.Nomatchdata = false;
      }
      if ((this.keyword.trim() == "" && this.keyword.length > 0) || this.isEmoji(this.keyword)) {
        this.Nomatchdata = true;
        return;
      } else {
        //实时输入后500毫秒之后再请求模糊匹配接口
        setTimeout(() => {
          this.getMainList();
        }, 500);
      }
    },
    //下拉加载更多主体的列表
    onLoadMain() {
      setTimeout(() => {
        this.$apiFwgx
          .getmaincompany({
            keyword: this.keyword,
            pageSize: 10,
            pageNum: (this.page2 += 1),
          })
          .then((data) => {
            console.log("下拉加载", data);
            if (data.data.data.rows.length != 0) {
              let arr = data.data.data.rows;
              arr.forEach((item) => {
                this.matchList2.push(item);
              });
            } else {
              this.finished = true;
            }
            this.loading = false;
          });
      }, 500);
    },

    searchMain() {
      if (!this.keyword) {
        this.Nomatchdata = false;
      }
      if ((this.keyword.trim() == "" && this.keyword.length > 0) || this.isEmoji(this.keyword)) {
        this.Nomatchdata = true;
        return;
      } else {
        //实时输入后500毫秒之后再请求模糊匹配接口
        setTimeout(() => {
          this.getMainList();
        }, 500);
      }
    },
    //获取下辖营业部列表
    getDownList() {
      console.log("下辖这边获取主体字段", this.mainSelectList);
      let brhNos = this.mainSelectList;
      console.log("brhNos", brhNos);
      this.$apiFwgx
        .getsubdepartment({
          keyword: this.keyword,
          pageNum: 1,
          pageSize: this.pageSize,
          mainBrhNo: brhNos.join(","),
        })
        .then((data) => {
          console.log("获取下辖营业部列表", data);
          if (data.data.data.rows.length == 0) {
            this.Nomatchdata = true;
            this.showLow = false;
          } else {
            this.finished = false;
            this.matchList3 = data.data.data.rows;
            if (data.data.data.rows.length < 10) {
              this.finished = true;
            }
            this.showLow = true;
          }
        });
    },
    //下拉加载更多下辖管理列表
    onLoadLow() {
      setTimeout(() => {
        this.$apiFwgx
          .getsubdepartment({
            keyword: this.keyword,
            pageSize: 10,
            pageNum: (this.page += 1),
          })
          .then((data) => {
            console.log("下拉加载", data);
            if (data.data.data.rows.length != 0) {
              let arr = data.data.data.rows;
              arr.forEach((item) => {
                this.matchList3.push(item);
              });
            } else {
              this.finished = true;
            }
            this.loading = false;
          });
      }, 500);
    },
    inputLow() {
      if (!this.keyword) {
        this.Nomatchdata = false;
      }
      if ((this.keyword.trim() == "" && this.keyword.length > 0) || this.isEmoji(this.keyword)) {
        this.Nomatchdata = true;
        return;
      } else {
        //实时输入后500毫秒之后再请求模糊匹配接口
        setTimeout(() => {
          this.getDownList();
        }, 200);
      }
    },
    searchLow() {
      if (!this.keyword) {
        this.Nomatchdata = false;
      }
      if ((this.keyword.trim() == "" && this.keyword.length > 0) || this.isEmoji(this.keyword)) {
        this.Nomatchdata = true;
        return;
      } else {
        //实时输入后500毫秒之后再请求模糊匹配接口
        setTimeout(() => {
          this.getDownList();
        }, 200);
      }
    },
    handleFocus() {
      this.isFocused = true;
      this.$emit("focus", this.$refs.autoComplete.offsetTop);
    },
    handleBlur() {
      setTimeout(() => {
        this.isFocused = false;
      }, 0);
    },
    // 服务归属高亮搜索内容
    getTitle(oaUserName) {
      return oaUserName.replace(
        new RegExp(this.keyword, "g"),
        `<span style="color: #007BF6">${this.keyword}</span>`,
      );
    },
    // 主体高亮搜索内容v
    getName(mainBrhAbbr) {
      var isChinese = new RegExp("[\u4E00-\u9FA5]+");
      if (isChinese.test(this.keyword) && mainBrhAbbr) {
        return mainBrhAbbr.replace(
          new RegExp(this.keyword, "g"),
          `<span style="color: #007BF6">${this.keyword}</span>`,
        );
      } else {
        return mainBrhAbbr;
      }
    },
    //搜索下辖编号高亮
    getNo(brhNo) {
      var isNum = new RegExp("^[0-9-]+");
      if (isNum.test(this.keyword) && brhNo) {
        return brhNo.replace(
          new RegExp(this.keyword, "g"),
          `<span style="color: #007BF6">${this.keyword}</span>`,
        );
      } else {
        return brhNo;
      }
    },
    getbrhName(brhName) {
      var isChinese = new RegExp("[\u4E00-\u9FA5]+");
      if (isChinese.test(this.keyword) && brhName) {
        return brhName.replace(
          new RegExp(this.keyword, "g"),
          `<span style="color: #007BF6">${this.keyword}</span>`,
        );
      } else {
        return brhName;
      }
    },

    // 服务归属选值
    handleItemClick(item) {
      let valueCopy = JSON.parse(JSON.stringify(this.value));
      valueCopy.push(item);
      this.$emit("input", valueCopy);
      this.$emit("inputData", valueCopy);
      this.showmatchdata = false;
      this.keyword = "";
      // console.log("iniii+", valueCopy);
    },
    //营业部主体选值
    handleItemClick2(item) {
      let valueCopy = JSON.parse(JSON.stringify(this.value));
      valueCopy.push(item);
      this.$emit("input", valueCopy);
      this.$emit("inputData2", valueCopy);
      this.searchMain = false;
      this.keyword = "";
      this.newArray.push(item.mainBrhNo);
      this.$emit("mainSelect", this.newArray);
    },
    //营业部下辖选值
    handleItemClick3(item) {
      let valueCopy = JSON.parse(JSON.stringify(this.value));
      valueCopy.push(item);
      this.$emit("input", valueCopy);
      this.$emit("inputData3", valueCopy);
      this.searchLow = false;
      this.keyword = "";
      this.lowArray.push(item.mainBrhNo);
      this.$emit("lowSelect", this.lowArray);
      console.log("this.lowArray+", this.lowArray);
    },
    // 服务归属删值
    handleItemDelete(item) {
      console.log("item1:", item);
      let valueCopy = JSON.parse(JSON.stringify(this.value));
      console.log("valueCopy1:", valueCopy);
      let index = valueCopy.findIndex((i) => i.oaUserId === item.oaUserId);
      valueCopy.splice(index, 1);
      this.$emit("input", valueCopy);
      this.$emit("inputData", valueCopy);
    },
    //营业部主体删值
    handleItemDelete2(item) {
      console.log("删除主体的值:", item);
      let valueCopy = JSON.parse(JSON.stringify(this.value));
      console.log("valueCopy2:", valueCopy);
      let index = valueCopy.findIndex((i) => i.mainBrhNo === item.mainBrhNo);
      // console.log("index:", index);
      valueCopy.splice(index, 1);
      let mainDelearr = [];
      mainDelearr.push(item.mainBrhNo);
      console.log("mainDelearr", mainDelearr);
      this.$emit("input", valueCopy);
      this.$emit("inputData2", valueCopy);
      this.$emit("mainDelearr", mainDelearr);
    },
    //营业部下辖删值
    handleItemDelete3(item) {
      console.log("删除下辖之前查看选了几个值:", this.value);
      console.log("删除下辖之前查主体删除的编号", this.mainDeleLsit);
      let valueCopy = JSON.parse(JSON.stringify(this.value));
      console.log("valueCopy3:", valueCopy);
      let index = valueCopy.findIndex((i) => i.brhNo === item.brhNo);
      valueCopy.splice(index, 1);
      this.$emit("input", valueCopy);
      this.$emit("inputData3", valueCopy);
    },
  },
};
</script>

<style lang="less" scoped>
.auto-complete {
  position: relative;
  display: flex;
  flex-direction: column;
  .radio {
    font-size: 0.28rem;
    font-weight: 400;
    color: #333333;
    line-height: 0.36rem;
    margin-top: 0.3rem;
    input {
      width: 0.36rem;
      height: 0.36rem;
      border: 0.02rem solid #007bf6;
    }
  }
  /deep/ .van-search {
    padding: 0;
    margin-top: 0.3rem;
    .van-search__content {
      border-radius: 0.12rem;
      padding-left: 0.3rem;
    }
    .van-field__left-icon {
      margin-right: 0.2rem;
    }
    img {
      width: 0.25rem;
    }
  }
  .auto-complete-title {
    width: 100%;
    font-size: 0.32rem;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 0.45rem;
  }
  .selected-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.1rem;
    .selected-item {
      display: flex;
      align-items: center;
      padding: 0.1rem 0.2rem;
      margin-right: 0.2rem;
      margin-top: 0.2rem;
      background: rgba(0, 123, 246, 0.03);
      border: 1px solid #007bf6;
      border-radius: 0.04rem;
      .selected-item-title {
        font-size: 0.28rem;
        font-weight: 400;
        text-align: left;
        color: #007bf6;
        line-height: 0.4rem;
      }
      img {
        width: 0.32rem;
        height: 0.32rem;
        margin-left: 0.2rem;
      }
    }
  }
  //有数据的匹配表
  .match-list {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 10;
    max-height: 4.6rem;
    overflow: auto;
    padding: 0 0.3rem;
    margin-bottom: 0.6rem;
    background: #ffffff;
    border-radius: 0px 0px 0.12rem 0.12rem;
    box-shadow: 0px 0.04rem 0.2rem 0px rgba(153, 153, 153, 0.25);
    font-size: 0.28rem;
    font-weight: 500;
    text-align: left;
    color: #333;
    line-height: 0.4rem;
    .match-item {
      padding: 0.32rem 0 0.28rem 0;
      border-bottom: 1px solid #ebebeb;
      &:last-child {
        border: none;
      }
      .match-item-title {
        margin-right: 0.15rem;
      }
    }
  }
  //无数据提示
  .no-math {
    width: 6.9rem;
    height: 4.6rem;
    background: #ffffff;
    box-shadow: 0px 0.04rem 0.2rem 0px rgba(153, 153, 153, 0.25);
    border-radius: 0px 0px 0.12rem 0.12rem;
    .nomatch-image {
      width: 4.4rem;
      height: 2.8rem;
      // background: red;
      margin-top: 0.7rem;
      margin-left: 1.25rem;
      background: url("../images/noseacrch.png") no-repeat;
      background-size: 100%;
    }
    .text {
      height: 0.4rem;
      font-size: 0.28rem;
      font-weight: 400;
      text-align: center;
      color: #999999;
    }
  }
}
</style>
